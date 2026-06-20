# 🏛️ Frontend Architecture and Standards

This document is the **Skill/Development Guide** for the Frontend of this base project (**React 19 + Vite + TypeScript + Tailwind CSS**). It establishes the architectural rules and best practices that **must always be followed** when adding new features, libraries, or code — regardless of the final project's business domain.

> **Note:** The associated backend is `backend-express` (Express + TypeScript), not NestJS. This guide reflects the current frontend.

---

## 1. 🌐 HTTP Request Handling (TanStack Query + Axios)

**Golden Rule:** NEVER use `axios` or `fetch` directly inside a React component. Also, do NOT use `useEffect` to load basic data.

### A. Creating Endpoints (`src/api/urls/`)

All endpoints must be abstracted into their own file inside `src/api/urls/`.

- They must export the interfaces/DTOs for the data they send or receive.
- They must use the generic `request` function from `src/api/config/network.ts`.

```typescript
// src/api/urls/courses.ts
import { request } from '../config/network';

export interface CourseDto {
  id: string;
  title: string;
  description?: string | null;
}

export interface CreateCourseDto {
  title: string;
  description?: string | null;
}

export const coursesApi = {
  getAll: () => request<CourseDto[]>({ url: '/courses', method: 'GET' }),
  create: (data: CreateCourseDto) => request<CourseDto>({ url: '/courses', method: 'POST', data }),
};
```

### B. Using in Components (`useApiGet` and `useApiSend`)

Only import the base Custom Hooks located in `src/api/config/customHooks.ts`.

- **For reading data (GET):** Use `useApiGet`.

  ```tsx
  const { data, isPending, isError } = useApiGet(['courses'], coursesApi.getAll);
  ```

- **For mutating data (POST, PUT, DELETE, PATCH):** Use `useApiSend`.
  - **Mandatory:** pass an array with the cache keys (`invalidateKey`) to update after success.
  - The current signature is: `useApiSend(fn, invalidateKey?, options?, onSuccess?)`.

  ```tsx
  const { mutate: createCourse, isPending } = useApiSend(
    coursesApi.create,
    [['courses']],              // Automatically refreshes the associated GET
    {
      onError: (err) => console.error('Error:', err),
    },
    (data) => console.log('Success:', data)
  );
  ```

---

## 2. 🧠 Global State Management (Zustand)

**Golden Rule:** Avoid creating complex Contexts (`React.Context`). Use **Zustand** for any global state that transcends the local hierarchy of a component.

### Zustand Rules:

1. **Slices Pattern:** Create a separate store file for each logical domain (e.g., `useAuthStore.ts`, `useToastStore.ts`, `useUIStore.ts`).
2. **Location:** All stores must be kept in `src/store/`.
3. **Middlewares:**
   - Always use `devtools` to audit state with Redux DevTools.
   - Use `persist` for state that should survive a page reload (e.g., authentication tokens or theme preferences).

```typescript
// src/store/useDomainStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DomainState {
  value: string;
  setValue: (val: string) => void;
}

export const useDomainStore = create<DomainState>()(
  devtools(
    persist(
      (set) => ({
        value: '',
        setValue: (val) => set({ value: val }, false, 'domain/setValue'),
      }),
      { name: 'domain-storage' }
    ),
    { name: 'DomainStore' }
  )
);
```

### Current Reference Stores

| Store | Purpose | Middleware |
|-------|---------|------------|
| `useAuthStore.ts` | User, token, authentication, logout | `devtools` + `persist` |
| `useToastStore.ts` | Toast list, add/remove | `devtools` |
| `useUIStore.ts` | Sidebar, light/dark theme | `devtools` |

---

## 3. ⚙️ Library Integration and Configurations

**Golden Rule:** Any external library (UI, Routing, Authentication) must be configured in a scalable, "Enterprise" way.

1. **Abstraction:** If a library requires global configuration, it should not pollute component logic. It must be initialized in a dedicated file (like `network.ts` for Axios) and provided in `App.tsx` (like `QueryClientProvider`).
2. **Routing:** We use **React Router v7** with the `createBrowserRouter` and `RouterProvider` architecture, supporting Layouts (like `MainLayout.tsx`).
3. **Lazy loading:** Pages are loaded with `React.lazy` + `Suspense`.

---

## 4. 🎨 Styles and Visual Design

1. **Tailwind CSS:** This is the primary styling system. Design tokens (colors, shadows, radii, fonts) live in `tailwind.config.js`.
2. **We do not use CSS Modules** in this project. Component-specific styles are handled with Tailwind classes directly in components.
3. **CSS Variables:** The file `src/styles/variables.css` is deprecated and no longer used. Do not add new variables there; extend `tailwind.config.js` if you need new tokens.
4. **Utilities:** Use `cn()` (`src/lib/utils/cn.ts`) to combine Tailwind classes conditionally.
5. **Visual Quality:** Always aim for a modern design, using interactive hover states (`transform`, `box-shadow`) and vibrant colors over clean schemes (`#f8fafc`).

### Icons — Lucide React

**Lucide React is the only icon library for this project.** Do not install `react-icons`, `heroicons`, `phosphor-icons`, or any other icon package.

- Docs: https://lucide.dev/guide/react/
- Install (if not already in `package.json`): `pnpm add lucide-react`

**Basic usage:**

```tsx
import { Home, Settings, ChevronRight, Loader2 } from 'lucide-react'

<Home size={20} className="text-blue-500" />
<ChevronRight size={16} strokeWidth={1.5} />
```

**Rules:**

| Rule | Correct | Wrong |
|---|---|---|
| Import only what you use | `import { Home } from 'lucide-react'` | `import * as Icons from 'lucide-react'` |
| Size via `size` prop | `<Home size={20} />` | `<Home className="w-5 h-5" />` |
| Color via Tailwind | `<Home className="text-slate-500" />` | `<Home color="#64748b" />` |
| Weight via `strokeWidth` | `<Home strokeWidth={1.5} />` | _(default 2 is fine for most cases)_ |

**Common patterns:**

```tsx
// Loading spinner
<Loader2 size={18} className="animate-spin text-blue-500" />

// Button with icon
<button className="flex items-center gap-2">
  <Plus size={16} />
  Add item
</button>

// Icon-only button (always add aria-label)
<button aria-label="Delete item">
  <Trash2 size={18} className="text-red-500" />
</button>

// Nav link with icon
<NavLink to="/settings" className="flex items-center gap-3">
  <Settings size={18} />
  Settings
</NavLink>
```

Tree-shaking is automatic — only imported icons are bundled.

---

## 5. 🎯 UX & Interaction Design

**Golden Rule:** Every state the app can be in — loading, empty, error, success, disabled — must look intentional, not broken. A blank screen or a frozen button is always a UX bug.

---

### A. Loading States — Skeleton vs Spinner

| Situation | Use |
|---|---|
| Initial page/list load (predictable shape) | **Skeleton** — matches the layout of real content |
| Background refetch (data already visible) | Nothing, or a subtle `isFetching` indicator |
| Button action in progress | **Spinner** inline in the button (`Loader2` + `animate-spin`) |
| Small inline section reload | **Spinner** centered in the container |

**Never** show a full-page spinner for a list that TanStack Query already has cached.

```tsx
// Skeleton for a list of cards
if (isPending) return (
  <ul className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <li key={i} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
    ))}
  </ul>
)

// Spinner inside a submit button
<button disabled={isPending} className="flex items-center gap-2 ...">
  {isPending
    ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
    : 'Save'}
</button>
```

---

### B. Empty States

Never render an empty list or a blank container. Every empty state needs three things: an icon, a message, and an action.

```tsx
if (!items.length) return (
  <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
    <PackageOpen size={40} strokeWidth={1.5} />
    <p className="text-sm font-medium">No items yet</p>
    <button onClick={onAdd} className="text-sm text-blue-600 hover:underline">
      Add your first item
    </button>
  </div>
)
```

---

### C. Mutation Feedback — Button States

A button that triggers a mutation must communicate every state it can be in.

```tsx
<button
  type="submit"
  disabled={isPending || !isValid}
  className={cn(
    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
    'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
    (isPending || !isValid) && 'cursor-not-allowed opacity-50',
  )}
>
  {isPending
    ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
    : <><Save size={15} /> Save</>}
</button>
```

Rules:
- Disable on `isPending` **and** when the form is invalid (`!isValid` from `formState`)
- Keep **Cancel / Close** buttons enabled during mutation — the user must be able to abort
- Show a success toast via `useToastStore` on `onSuccess`, not an inline "Saved!" that replaces button text permanently

---

### D. Destructive Actions — Always Confirm

Any action that deletes or overwrites data must require explicit confirmation. Never fire a DELETE on a single click.

```tsx
// Minimal inline confirm pattern
const [confirming, setConfirming] = useState(false)

{confirming ? (
  <div className="flex items-center gap-2">
    <span className="text-sm text-slate-600">Are you sure?</span>
    <button onClick={() => mutate(id)} className="text-sm text-red-600 font-medium hover:underline">
      Yes, delete
    </button>
    <button onClick={() => setConfirming(false)} className="text-sm text-slate-500 hover:underline">
      Cancel
    </button>
  </div>
) : (
  <button onClick={() => setConfirming(true)} aria-label={`Delete "${item.name}"`}>
    <Trash2 size={16} className="text-slate-400 hover:text-red-500 transition-colors" />
  </button>
)}
```

- Use red only for destructive buttons, never for neutral actions
- Default focus on open should be on the **Cancel** option, not the destructive one

---

### E. Micro-interactions & Transitions

Apply transitions consistently so the UI feels responsive, not static.

```tsx
// Standard hover card
<div className="rounded-xl border border-slate-200 p-4
                transition-shadow duration-200
                hover:shadow-md hover:border-slate-300">

// List item appear (use with new items after mutation)
<li className="animate-in fade-in slide-in-from-top-2 duration-200">

// Icon button hover
<button className="rounded-md p-1.5 text-slate-400
                   transition-colors hover:bg-slate-100 hover:text-slate-700">
  <Pencil size={16} />
</button>

// Active / press feedback on any clickable element
<button className="... active:scale-95 transition-transform">
```

Rules:
- Use `duration-150`–`duration-200` for hover transitions — faster feels snappier
- Use `duration-300` for modals, drawers, or page-level transitions
- `active:scale-95` on every button gives physical click feedback
- Never animate color and layout simultaneously — it looks janky

---

### F. Responsive Design

Mobile-first: start with the mobile layout, add breakpoints to expand.

```tsx
// Grid that stacks on mobile, goes 3-column on desktop
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

// Sidebar hidden on mobile, visible on lg+
<aside className="hidden lg:flex lg:flex-col lg:w-64 ...">

// Table that scrolls horizontally on mobile
<div className="overflow-x-auto rounded-lg border border-slate-200">
  <table className="min-w-full text-sm">
```

Breakpoint reference for this project:

| Prefix | Min-width | Typical use |
|---|---|---|
| _(none)_ | 0px | Mobile, stacked layout |
| `sm:` | 640px | Two-column grids, wider inputs |
| `md:` | 768px | Show secondary panels |
| `lg:` | 1024px | Sidebar visible, full dashboard |

---

### G. Navigation & Page Feedback

- Use `NavLink` (not `Link`) for sidebar/nav items — it exposes `isActive` for styling
- Show the active route clearly: distinct background, color, or left border accent
- After a successful create/update that navigates away, scroll the new item into view or highlight it briefly so the user sees the result of their action

```tsx
<NavLink
  to="/items"
  className={({ isActive }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-blue-50 text-blue-700 font-medium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    )
  }
>
  <Package size={18} />
  Items
</NavLink>
```

---

## 6. 🛡️ Error Handling

**Golden Rule:** The user must always receive clear feedback on any failure — network, logic, or rendering.

### A. Error Boundary (rendering crashes)

Wrap `App.tsx` with the `ErrorBoundary` component from `src/components/common/ErrorBoundary.tsx`. This catches JavaScript errors in the component tree and shows a recovery screen instead of a blank screen.

```tsx
// App.tsx
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toast />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### B. Global toasts for network errors

Errors from `useApiGet` and `useApiSend` are automatically captured via `QueryCache` and `MutationCache` in `App.tsx` and shown as notifications using `useToastStore` (`src/store/useToastStore.ts`). The `Toast` component (`src/components/common/Toast.tsx`) is mounted once in `App.tsx`.

- **It is not necessary** to show individual error messages in each component for network errors — the toast covers them.
- For form validation errors, show the error inline next to the field.

### C. Loading and error states in components

- Loading state: use `role="status"` with `aria-live="polite"`.
- Error state: use `role="alert"` with `aria-live="assertive"`.

```tsx
if (isPending) return <div role="status" aria-live="polite">Loading...</div>;
if (isError) return <div role="alert" aria-live="assertive">Could not connect to the server.</div>;
```

---

## 7. 📝 Forms

1. **React Hook Form + Zod:** All forms must use `react-hook-form` with schema resolution via `@hookform/resolvers/zod`.
2. **Schemas in `src/lib/schemas/`:** Define form Zod schemas in dedicated files (`auth.schema.ts`, `item.schema.ts`, etc.).
3. **Base components:** Use UI components (`Input`, `Button`, `Label`, `FormError`) to maintain consistency.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/schemas/auth.schema';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    // call mutate
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <FormError>{errors.email.message}</FormError>}
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

---

## 8. ♿ Accessibility (A11y)

**Golden Rule:** Every interface must be keyboard-navigable and understandable for screen readers.

### Mandatory Rules:

1. **`lang` in HTML:** The `index.html` file must have `<html lang="en">` (or the correct project language).

2. **Semantic HTML:** Use the correct tags:
   - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` instead of generic `<div>` where appropriate.
   - `<ul>/<li>` for dynamic item lists.
   - A single `<h1>` per page; pages use `<h2>`, components use `<h3>`.

3. **Skip link:** Every layout must include a "Skip to main content" link visible when focused with Tab:

   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only ...">
     Skip to main content
   </a>
   <main id="main-content">...</main>
   ```

4. **`aria-label` on contextual action buttons:** Buttons that operate on a specific item must identify it:

   ```tsx
   <button aria-label={`Delete "${resource.name}"`}>Delete</button>
   ```

5. **`aria-label` on `<nav>`:** Always name navigation regions:

   ```tsx
   <nav aria-label="Main navigation">...</nav>
   ```

6. **Dynamic regions (`aria-live`):** Containers whose content changes in response to user actions must use `aria-live`:
   - `aria-live="polite"` — non-urgent updates (lists, results).
   - `aria-live="assertive"` — critical errors requiring immediate attention.

7. **`aria-busy` and `aria-pressed`:** Add `aria-busy={isPending}` on action buttons during processing. Use `aria-pressed` on toggle buttons.

---

## 9. 🔐 Authentication

1. The JWT is stored in `localStorage` via Zustand `persist` (`useAuthStore`).
2. The Axios interceptor in `network.ts` automatically injects the `Authorization: Bearer <token>` header.
3. On `401`, the interceptor executes `logout()` and redirects to `/login`.
4. Protected routes use `ProtectedRoute` (`src/components/common/ProtectedRoute.tsx`).

> **Production warning:** storing JWT in `localStorage` exposes you to XSS. For real projects, evaluate `HttpOnly` cookies.

---

## Instruction for the AI Model

> "When starting any task in this repository, you must read and apply these guidelines. If the task involves creating a new page or feature, you must use TanStack Query + Axios through `useApiGet`/`useApiSend`, Zustand for global state, Tailwind for styles, React Hook Form + Zod for forms, React Router v7 for routing, and Lucide React for icons. Apply Section 5 UX rules on every component: show skeleton or spinner for loading states, render an icon+message+action empty state for empty lists, add button feedback during mutations, confirm destructive actions before firing, and apply `transition-*` / `active:scale-95` for micro-interactions. Do not use `fetch`/`axios` directly in components, do not use CSS Modules, do not add CSS variables to `src/styles/variables.css`, and do not install any icon library other than `lucide-react`."
