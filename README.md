[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![CI](https://github.com/Jsequeirag/Proyecto-Base-express-React-Tailwind-Skills/actions/workflows/ci.yml/badge.svg)](https://github.com/Jsequeirag/Proyecto-Base-express-React-Tailwind-Skills/actions)

# ⚡ Express + React Starter

> Production-ready full-stack boilerplate — **React 19 + Vite** frontend, **Express.js + TypeScript** backend, JWT auth, Prisma + MongoDB, and zero-config in-memory mode for instant development.

Clone it. Rename it. Ship it.

---

## ✨ Features

| Area | What's included |
|---|---|
| 🔐 **Auth** | Register, login, JWT tokens, protected routes, auto-logout on 401 |
| 🗄️ **Database** | Prisma + MongoDB — swap to in-memory with one env var |
| 🧱 **Architecture** | Layered backend (Routes → Controller → Service → Repository) |
| 🎨 **UI** | Tailwind CSS, reusable components, global toasts, error boundaries |
| 📋 **Forms** | React Hook Form + Zod validation on both frontend and backend |
| 🌐 **HTTP** | Axios client, TanStack Query, base hooks (`useApiGet` / `useApiSend`) |
| 🔒 **Security** | Helmet, CORS, rate limiting, compression, bcrypt password hashing |
| 🧪 **Testing** | Vitest + Supertest (integration) + Testing Library (unit) |
| 📝 **Logging** | Structured logs with Pino + pino-pretty |
| ⚙️ **DX** | ESLint, Prettier, strict TypeScript, nodemon, tsx watch |

---

## 🛠️ Tech Stack

| Frontend | Backend |
|---|---|
| React 19 + Vite | Express.js 4 |
| TypeScript (strict) | TypeScript (strict, ESM) |
| Tailwind CSS 3 | Prisma 6 + MongoDB |
| React Router v7 | Zod validation |
| TanStack Query v5 | JWT + bcryptjs |
| Zustand v5 | Pino logger |
| React Hook Form + Zod | Helmet + CORS + rate-limit |
| Lucide React (icons) | — |
| Vitest + Testing Library | Vitest + Supertest |

---

## 📋 Requirements

- **Node.js** 20+
- **pnpm** 9+
- **MongoDB** _(optional — runs fully in-memory without it)_

---

## ⚡ Quick Start

### 1. Clone

```bash
git clone https://github.com/Jsequeirag/Proyecto-Base-express-React-Tailwind-Skills.git my-app
cd my-app
```

### 2. Install dependencies

```bash
# Backend
cd backend-express && pnpm install

# Frontend
cd ../frontend && pnpm install
```

### 3. Configure environment

**`backend-express/.env`** (copy from `.env.example`):

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-key-at-least-32-chars
JWT_EXPIRES_IN=1d
BCRYPT_ROUNDS=10
# Leave DATABASE_URL empty to run with in-memory repositories (no MongoDB needed)
# DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
```

**`frontend/.env`** (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Run

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend-express && pnpm dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && pnpm dev
```

That's it. No database required for the first run.

---

## 📁 Project Structure

```
.
├── backend-express/
│   ├── src/
│   │   ├── config/          # env, cors, logger, security, repositories
│   │   ├── modules/
│   │   │   ├── auth/        # register, login — routes/controller/service/schema/repo
│   │   │   └── items/       # CRUD example — routes/controller/service/schema/repo
│   │   ├── routes/          # root router
│   │   ├── shared/          # middlewares, error classes, response helpers
│   │   └── types/
│   ├── tests/
│   │   ├── integration/     # auth.test.ts, items.test.ts (Supertest)
│   │   └── unit/            # service unit tests
│   └── prisma/schema.prisma
│
├── frontend/
│   └── src/
│       ├── api/             # Axios client, base hooks, URL constants, DTOs
│       ├── components/      # ui/, common/, layout/
│       ├── pages/           # lazy-loaded pages
│       ├── routes/          # React Router config
│       ├── store/           # Zustand global state
│       └── lib/             # utilities, Zod schemas
│
└── .skills/                 # Team dev guides (read before contributing)
```

---

## 🔐 Authentication Flow

```
POST /api/auth/register  →  creates user, returns JWT
POST /api/auth/login     →  validates credentials, returns JWT
GET  /api/auth/profile   →  protected — requires Authorization: Bearer <token>
```

- The frontend stores the JWT in `localStorage` via Zustand persist middleware.
- Every Axios request automatically injects `Authorization: Bearer <token>`.
- A 401 response triggers automatic logout and redirect to `/login`.

> **Production note:** `localStorage` is XSS-vulnerable. For hardened apps, switch to `HttpOnly` cookies.

---

## 🧪 Testing

```bash
# Backend — unit + integration (uses in-memory repos, no DB needed)
cd backend-express && pnpm test

# Frontend — component + hook tests
cd frontend && pnpm test

# Coverage reports
pnpm test:coverage   # in either directory
```

---

## 📦 Production Build

```bash
# Backend
cd backend-express
pnpm build   # compiles to dist/
pnpm start       # node dist/server.js

# Frontend
cd frontend
pnpm build   # outputs to dist/
pnpm preview # local preview of the production build
```

---

## 🗂️ Available Scripts

### Backend

| Command | Description |
|---|---|
| `pnpm dev` | Dev server with `tsx watch` |
| `pnpm dev:nodemon` | Dev server with nodemon |
| `pnpm build` | Compile TypeScript → `dist/` |
| `pnpm start` | Run production build |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm test:coverage` | Tests with coverage report |
| `pnpm db:push` | Sync Prisma schema to MongoDB |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:studio` | Open Prisma Studio |

### Frontend

| Command | Description |
|---|---|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests (Vitest) |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

---

## 🏗️ Architecture

### Backend — Layered

```
Request → Route → Middleware → Controller → Service → Repository → Response
```

Each module under `src/modules/<feature>/` is self-contained:

- `.routes.ts` — endpoints and middleware wiring
- `.controller.ts` — request/response handling only
- `.service.ts` — all business logic
- `.schema.ts` — Zod input validation
- `.prisma-repository.ts` — MongoDB persistence
- `.memory-repository.ts` — in-memory fallback (dev / tests)

### Frontend — Feature-Oriented

- `api/config/` — Axios instance + generic `useApiGet` / `useApiSend` hooks
- `api/urls/` — URL constants grouped by resource
- `components/ui/` — base design-system components (Button, Input, …)
- `store/` — Zustand slices (auth, notifications)
- `pages/` — lazy-loaded via `React.lazy`

---

## 📅 Commit Strategy

> Full convention, scopes, and more examples in [`.skills/COMMIT_GUIDE.md`](./.skills/COMMIT_GUIDE.md).

**Language rule: all commits must be in English** — subject, body, and branch names. This is a public template; English history is readable worldwide and signals professionalism to anyone evaluating the project.

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | New feature, endpoint, page, or component |
| `fix:` | Bug fix |
| `refactor:` | Code restructure, no behavior change |
| `test:` | Adding or fixing tests |
| `docs:` | README, comments, guides |
| `chore:` | Config, deps, tooling, CI |

**Scopes** keep history scannable in a monorepo: `feat(backend):`, `feat(frontend):`, `fix(auth):`, `feat(db):`.

**Initial release example** (adapted to this project):

```
feat: initial release — express + react starter template

Production-ready full-stack boilerplate for building modern web applications.

- React 19 + Vite + TypeScript + Tailwind CSS frontend
- Express.js + TypeScript + Prisma + MongoDB backend (in-memory fallback)
- JWT authentication with persistent session (Zustand + localStorage)
- Clean layered architecture: Routes → Controller → Service → Repository
- Dual repositories: Prisma (MongoDB) + in-memory (zero-config dev/tests)
- Vitest + Supertest integration and unit tests
- Helmet, CORS, rate limiting, compression out of the box
- React Hook Form + Zod validation on both frontend and backend
- TanStack Query v5 + Axios with base hooks (useApiGet / useApiSend)
```

**Recommended cadence:** one atomic commit per logical change, at least 3–5 per week. Never bundle unrelated changes — if you can't describe a commit in one sentence, split it.

---

## 📄 License

**MIT** — free for personal and commercial use. See [LICENSE](LICENSE).

> MIT was chosen because this is a starter template meant to be forked and adapted freely. It places no restrictions on how you use, modify, or distribute the code — including in proprietary products — which is exactly what a boilerplate should offer.

---

_Built as a production-ready full-stack base for modern web applications._
