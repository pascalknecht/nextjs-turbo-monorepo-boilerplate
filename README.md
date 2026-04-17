# Next.js Starter Kit

A production-ready monorepo starter template built with **Next.js 16**, **Prisma 7**, **Better Auth**, **Stripe**, and **shadcn/ui**.

## Tech Stack

| Category         | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org/) with [React 19](https://react.dev/)     |
| Language         | [TypeScript](https://www.typescriptlang.org/)                              |
| Build System     | [Turborepo](https://turbo.build/repo)                                      |
| Package Manager  | [pnpm](https://pnpm.io/)                                                  |
| Database ORM     | [Prisma 7](https://www.prisma.io/) with PostgreSQL                        |
| Authentication   | [Better Auth](https://www.better-auth.com/) (email/password, organizations)|
| Payments         | [Stripe](https://stripe.com/) (checkout, webhooks)                         |
| UI Components    | [shadcn/ui](https://ui.shadcn.com/) + [Radix](https://www.radix-ui.com/)  |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com/)                                |
| Testing          | [Vitest](https://vitest.dev/) + Testing Library                            |
| Linting          | [ESLint 9](https://eslint.org/) (flat config)                              |
| Formatting       | [Prettier](https://prettier.io/) with Tailwind plugin                      |
| Env Validation   | [@t3-oss/env-nextjs](https://env.t3.gg/) with Zod                          |

## Project Structure

```
├── apps/
│   └── nextjs/            # Next.js 16 application
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
├── Dockerfile.dev         # Development build with hot reload
├── docker-compose.prod.yml # App + Postgres (production)
├── docker-compose.dev.yml # App + Postgres + pgAdmin (development)
├── turbo.json             # Turborepo pipeline config
├── pnpm-workspace.yaml    # Workspace definition
└── .env.example           # Environment variable template
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

```bash
cp .env.example .env
```

Edit `.env` with your values. Required variables for local development:

| Variable                      | Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`                | PostgreSQL connection string                                              |
| `BETTER_AUTH_SECRET`          | Secret for session signing (`openssl rand -base64 32`)                   |
| `BETTER_AUTH_URL`             | Base fallback URL for Better Auth (used in production and as dev fallback) |
| `NEXT_PUBLIC_APP_URL`         | Public-facing app URL                                                     |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional comma-separated extra origins allowed by Better Auth origin check |

Optional variables for additional features:

| Variable                 | Description                  |
| ------------------------ | ---------------------------- |
| `GOOGLE_CLIENT_ID`       | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET`   | Google OAuth client secret   |
| `STRIPE_API_KEY`         | Stripe secret key            |
| `STRIPE_WEBHOOK_SECRET`  | Stripe webhook signing secret|
| `STRIPE_PRICE_ID`        | Stripe price ID for checkout |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key       |

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

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | Start all apps in dev mode (Turbopack)|
| `pnpm build`         | Build all apps for production         |
| `pnpm lint`          | Lint all apps with ESLint             |
| `pnpm typecheck`     | Run TypeScript type checking          |
| `pnpm test`          | Run tests with Vitest                 |
| `pnpm format`        | Format codebase with Prettier         |
| `pnpm format:check`  | Check formatting (CI-friendly)        |
| `pnpm db:generate`   | Generate Prisma client                |
| `pnpm db:push`       | Push Prisma schema to database        |

For Stripe webhook testing (run from `apps/nextjs`):

```bash
pnpm stripe:listen
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

## Environment Validation

Environment variables are validated at runtime using [`@t3-oss/env-nextjs`](https://env.t3.gg/) with Zod schemas. See `apps/nextjs/src/env.ts`.

To skip validation (e.g., during Docker builds), set `SKIP_ENV_VALIDATION=1`.

## Docker

A full Docker setup is included. There are two modes: **production** (optimized build) and **development** (hot reload with volume mounts). pgAdmin is available in the development compose only. The files are intentionally standalone—run either `docker-compose.dev.yml` or `docker-compose.prod.yml`, not both together.

### Development mode

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts the app with Turbopack hot-reloading inside the container. Source files are bind-mounted so changes on your host are reflected immediately — no rebuild needed.

If you previously started the production stack (or changed compose files), recreate containers to avoid stale port bindings:

```bash
docker compose -f docker-compose.dev.yml down --remove-orphans
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

| Service    | Default host port            | Description                  |
| ---------- | ---------------------------- | ---------------------------- |
| `app`      | Dynamic (Docker-assigned)    | Next.js dev server           |
| `postgres` | Dynamic (Docker-assigned)    | PostgreSQL 17 database       |
| `pgadmin`  | Dynamic (Docker-assigned)    | pgAdmin database UI          |

Docker now publishes each service on a random free host port by default. To check which port was assigned:

```bash
docker compose -f docker-compose.dev.yml port app 3000
docker compose -f docker-compose.dev.yml port postgres 5432
docker compose -f docker-compose.dev.yml port pgadmin 80
```

After starting for the first time, push the database schema:

```bash
docker compose -f docker-compose.dev.yml exec app pnpm db:push
```

To rebuild the dev image (e.g., after adding dependencies):

```bash
docker compose -f docker-compose.dev.yml up -d --build app
```

### Production mode

```bash
docker compose -f docker-compose.prod.yml up -d
```

This starts two services:

| Service    | URL                          | Description                  |
| ---------- | ---------------------------- | ---------------------------- |
| `app`      | http://localhost:3000        | Next.js application          |
| `postgres` | `localhost:5432`             | PostgreSQL 17 database       |

**Postgres credentials:** `postgres` / `postgres` (database: `nextjs-boilerplate`)

### Running only Postgres (for local development)

If you want to develop locally but use Docker for the database:

```bash
docker compose -f docker-compose.prod.yml up -d postgres
```

Then use the default `DATABASE_URL` from `.env.example` which points to `localhost:5432`.

### Push the database schema

After starting Postgres for the first time, push the Prisma schema:

```bash
pnpm db:generate
pnpm db:push
```

### Rebuild the app image

```bash
docker compose -f docker-compose.prod.yml up -d --build app
```

### Environment variables

The production `app` service reads environment variables from `docker-compose.prod.yml`. To override or add variables (e.g., Stripe keys), either edit the `environment` section in `docker-compose.prod.yml` or create a `.env` file and reference it with `env_file` in the compose config.

In development compose (`docker-compose.dev.yml`), you can pin host ports via compose environment variables:

- `APP_PORT` (default: `0`, random host port mapped to container `3000`)
- `POSTGRES_PORT` (default: `0`, random host port mapped to container `5432`)
- `PGADMIN_PORT` (dev only, default: `0`, random host port mapped to container `80`)

In development mode, Compose now derives the app URLs from `APP_PORT` by default, so Better Auth and the frontend URL stay aligned when you pin a port. When `APP_PORT=0` (random host port), Docker chooses the final host port after startup, so that exact value cannot be pre-injected into container env vars by Compose. You should still set:

- `APP_PORT` to pin a predictable host port (for example, `3001`) when you want stable URLs
- `NEXT_PUBLIC_APP_URL` / `BETTER_AUTH_URL` only if you need to override Compose defaults
- `BETTER_AUTH_TRUSTED_ORIGINS` if you access the same dev server from additional origins (for example, `http://localhost:3000,http://127.0.0.1:3001`)

## Deployment

This project is optimized for [Vercel](https://vercel.com/) deployment. The `turbo.json` configuration includes Vercel-aware environment variables.

For other platforms, run:

```bash
pnpm build
pnpm start
```
