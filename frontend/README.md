# Frontend Template

Professional frontend template with **React 19 + TypeScript + Vite + Tailwind CSS**, designed to connect to the project's Express backend.

## Stack

- **React 19** — UI library.
- **TypeScript** — Static typing (strict mode enabled).
- **Vite 8** — Build tool and dev server.
- **Tailwind CSS 3.4** — Utility-first CSS framework.
- **React Router v7** — Routing with lazy loading.
- **TanStack Query (React Query)** — Fetching, caching, and server state.
- **Zustand** — Global state.
- **react-hook-form + zod** — Forms and validation.
- **Axios** — HTTP client.
- **Vitest + Testing Library** — Tests.
- **ESLint + Prettier** — Linting and formatting.

## Requirements

- Node.js 18 or higher.
- Express backend running at `http://localhost:3000` (see `backend-express/`).

## Installation

```bash
cd frontend
cp .env.example .env
pnpm install
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:3000/api` |

## Scripts

```bash
pnpm dev           # Development server
pnpm build         # Production build
pnpm preview       # Preview build
pnpm lint          # ESLint
pnpm format        # Prettier
pnpm test              # Run tests once
pnpm test:watch    # Tests in watch mode
pnpm test:coverage # Coverage
```

## Structure

```
src/
├── api/
│   ├── config/        # Axios singleton + React Query hooks
│   ├── dtos/          # Shared types
│   └── urls/          # Endpoint modules (auth, items)
├── components/
│   ├── common/        # ErrorBoundary, Toast, ProtectedRoute
│   ├── demo/          # Example components (ResourceManager)
│   ├── layout/        # MainLayout
│   └── ui/            # Base components (Button, Input, Label, FormError)
├── lib/
│   ├── schemas/       # Zod schemas
│   └── utils/         # Helpers (cn, getErrorMessage)
├── pages/
│   ├── Demo/
│   ├── Home/
│   ├── Login/
│   └── Register/
├── routes/
│   └── Routes.tsx
├── store/
│   ├── useAuthStore.ts
│   ├── useToastStore.ts
│   └── useUIStore.ts
├── main.tsx
└── App.tsx
```

## Authentication

The frontend implements complete JWT authentication:

- **Login** (`/login`)
- **Register** (`/register`)
- **Protected routes** (`ProtectedRoute`)
- **Automatic logout** on `401`
- **Axios interceptor** injects the token automatically

The token is stored in `localStorage` for this template. In production, consider `HttpOnly` cookies for greater security.

## Conventions

- Always use the `useApiGet` / `useApiSend` hooks for HTTP calls.
- Use `react-hook-form` + zod for all forms.
- Use components from `components/ui/` to maintain visual consistency.
- Type API errors with `ApiError` from `@/lib/utils/error`.
- New business modules go in `src/modules/` or `src/features/`.

## Connected Endpoints

| Frontend | Backend |
|----------|---------|
| `POST /api/auth/register` | Register |
| `POST /api/auth/login` | Login |
| `GET /api/auth/me` | Profile |
| `GET /api/items` | List items |
| `POST /api/items` | Create item |
| `PATCH /api/items/:id` | Update item |
| `DELETE /api/items/:id` | Delete item |

## Tests

```bash
pnpm test
```

Tests use Vitest + jsdom + Testing Library. They do not require a running backend.

## Notes

- `/demo` is protected and requires authentication.
- The Express backend can use MongoDB (string IDs) or memory (number IDs). The frontend supports both ID types.
- See `backend-express/README.md` to configure the backend.
