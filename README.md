# Next.js Starter Kit

A production-ready monorepo starter template built with **Next.js 16**, **Prisma 7**, **Better Auth**, **Stripe**, and **shadcn/ui**.

## Tech Stack

| Category        | Technology                                                                  |
| --------------- | --------------------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org/) with [React 19](https://react.dev/)       |
| Language        | [TypeScript](https://www.typescriptlang.org/)                               |
| Build System    | [Turborepo](https://turbo.build/repo)                                       |
| Package Manager | [pnpm](https://pnpm.io/)                                                    |
| Database ORM    | [Prisma 7](https://www.prisma.io/) with PostgreSQL                          |
| Authentication  | [Better Auth](https://www.better-auth.com/) (email/password, organizations) |
| Payments        | [Stripe](https://stripe.com/) (checkout, webhooks)                          |
| UI Components   | [shadcn/ui](https://ui.shadcn.com/) + [Radix](https://www.radix-ui.com/)    |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com/)                                 |
| Testing         | [Vitest](https://vitest.dev/) + Testing Library                             |
| Linting         | [ESLint 9](https://eslint.org/) (flat config)                               |
| Formatting      | [Prettier](https://prettier.io/) with Tailwind plugin                       |
| Env Validation  | [@t3-oss/env-nextjs](https://env.t3.gg/) with Zod                           |

## Project Structure

```
├── apps/
│   └── nextjs/            # Next.js 16 application
│       ├── .env.example   # Env template (copy to .env in this folder)
│       ├── prisma/        # Database schema
│       └── src/
│           ├── app/       # App Router (pages, layouts, API routes)
│           │   ├── (marketing)/   # Landing page, login, register, pricing
│           │   ├── (main)/        # Authenticated app (dashboard, settings)
│           │   ├── (legal)/       # Privacy policy, terms of service
│           │   └── api/           # Auth & webhook handlers
│           ├── components/        # UI components (shadcn/ui)
│           ├── hooks/             # Custom React hooks
│           ├── lib/               # Auth, database, Stripe, utilities
│           └── use-cases/         # Business logic layer
├── docker/                # Docker configuration files
│   └── pgadmin/           # pgAdmin server pre-configuration
├── Dockerfile             # Multi-stage production build
├── docker-compose.dev.yml # Postgres + pgAdmin (run Next.js on the host)
├── turbo.json             # Turborepo pipeline config
├── pnpm-workspace.yaml    # Workspace definition
└── .env.example           # Pointer to apps/nextjs/.env.example
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.19.0
- [pnpm](https://pnpm.io/) 10.6+
- A PostgreSQL database

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

All variables for the Next.js app live in **`apps/nextjs/.env`** (not the repo root). The template is committed as `apps/nextjs/.env.example`; the root `.env.example` only points there.

```bash
cp apps/nextjs/.env.example apps/nextjs/.env
```

If you still have a legacy **repo-root** `.env`, move its contents to `apps/nextjs/.env` so there is a single app env file.

**How values are loaded**

- **Next.js** (`next dev`, `next build`, `next start`) loads `.env`, `.env.local`, etc. from `apps/nextjs/` automatically. App scripts do not use a `with-env` wrapper.
- **Prisma CLI** (`pnpm db:generate`, `pnpm db:push`) loads `apps/nextjs/.env` via `apps/nextjs/prisma.config.ts`.
- **Validation** at runtime uses `@t3-oss/env-nextjs` in `apps/nextjs/src/env.ts` (see [Environment validation](#environment-validation)).

Edit `apps/nextjs/.env` with your values. Required for local development:

| Variable              | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `DATABASE_URL`        | PostgreSQL connection string                           |
| `BETTER_AUTH_SECRET`  | Secret for session signing (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL`     | Base URL of your app (e.g., `http://localhost:3000`)   |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL (usually same host as above)    |

Optional variables for additional features:

| Variable                 | Description                   |
| ------------------------ | ----------------------------- |
| `GOOGLE_CLIENT_ID`       | Google OAuth client ID        |
| `GOOGLE_CLIENT_SECRET`   | Google OAuth client secret    |
| `STRIPE_API_KEY`         | Stripe secret key             |
| `STRIPE_WEBHOOK_SECRET`  | Stripe webhook signing secret |
| `STRIPE_PRICE_ID`        | Stripe price ID for checkout  |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key        |

### 3. Set up the database

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
```

### 4. Start development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

Run these from the monorepo root:

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start all apps in dev mode (Turbopack) |
| `pnpm build`        | Build all apps for production          |
| `pnpm lint`         | Lint all apps with ESLint              |
| `pnpm typecheck`    | Run TypeScript type checking           |
| `pnpm test`         | Run tests with Vitest                  |
| `pnpm format`       | Format codebase with Prettier          |
| `pnpm format:check` | Check formatting (CI-friendly)         |
| `pnpm db:generate`  | Generate Prisma client                 |
| `pnpm db:push`      | Push Prisma schema to database         |

For Stripe webhook testing:

```bash
pnpm --filter @repo/nextjs stripe:listen
```

## Authentication

This starter uses [Better Auth](https://www.better-auth.com/) with:

- **Email/password** authentication (enabled by default)
- **Organization** plugin for team/workspace support
- **Prisma adapter** for database-backed sessions

Protected routes (`/dashboard/*`, `/settings/*`) are guarded by a proxy that checks for a valid session cookie and redirects unauthenticated users to `/login`.

## Stripe Integration

Stripe is pre-configured with:

- A lazy-initialized Stripe client (`src/lib/stripe.ts`)
- A webhook handler at `/api/webhooks/stripe` with signature verification
- Event stubs for `checkout.session.completed` and `invoice.payment_succeeded`

Stripe-related environment variables are optional so you can start building without a Stripe account.

## Adding Shared Packages

To add shared code (e.g., a design system or shared config), create a `packages/` directory and uncomment the entry in `pnpm-workspace.yaml`:

```yaml
packages:
  - apps/*
  - packages/*
```

## Environment validation

[`@t3-oss/env-nextjs`](https://env.t3.gg/) validates the same variables you define in **`apps/nextjs/.env`**. Schemas and `runtimeEnv` wiring live in `apps/nextjs/src/env.ts`.

Better Auth uses `baseURL` from validated `env` in `apps/nextjs/src/lib/auth.ts` and `auth-client.ts`, so `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` stay aligned with the file.

To skip validation (e.g., during production Docker builds), set `SKIP_ENV_VALIDATION=1` in the build environment.

## Docker

Docker Compose runs **PostgreSQL** and **pgAdmin** only. Run the Next.js app on the host (`pnpm dev` from the repo root or `apps/nextjs`) so Turbopack hot reload works reliably.

```bash
docker compose -f docker-compose.dev.yml up
```

Or:

```bash
pnpm docker:dev
```

Recreate containers after compose changes:

```bash
docker compose -f docker-compose.dev.yml down --remove-orphans
docker compose -f docker-compose.dev.yml up --force-recreate
```

| Service    | Default host port       | Description            |
| ---------- | ----------------------- | ---------------------- |
| `postgres` | `localhost:5432`        | PostgreSQL 17 database |
| `pgadmin`  | http://localhost:5050   | pgAdmin database UI    |

Default host ports are stable. Override them with env vars if needed.

**Postgres credentials:** `postgres` / `postgres` (database: `nextjs-boilerplate`)

Point **`DATABASE_URL`** in `apps/nextjs/.env` at the mapped host port, for example:

`postgresql://postgres:postgres@localhost:5432/nextjs-boilerplate`

(Use the same port as `POSTGRES_PORT` if you override it.)

### Push the database schema

After starting Postgres for the first time, push the Prisma schema:

```bash
pnpm db:generate
pnpm db:push
```

Host port overrides (optional env vars when you run Compose):

- `POSTGRES_PORT` (default: `5432`, mapped to container `5432`)
- `PGADMIN_PORT` (default: `5050`, mapped to container `80`)

## Deployment

This project is optimized for [Vercel](https://vercel.com/) deployment. The `turbo.json` configuration includes Vercel-aware environment variables.

Configure the same keys as in **`apps/nextjs/.env.example`** on your host (Vercel project settings, Fly secrets, etc.). There is no repo-root `.env` for the app.

For other platforms, run:

```bash
pnpm build
pnpm start
```
