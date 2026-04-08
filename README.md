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

| Variable             | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string                             |
| `BETTER_AUTH_SECRET`  | Secret for session signing (`openssl rand -base64 32`)  |
| `BETTER_AUTH_URL`     | Base URL of your app (e.g., `http://localhost:3000`)    |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL                                   |

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

Protected routes (`/dashboard/*`, `/settings/*`) are guarded by middleware that checks for a valid session cookie and redirects unauthenticated users to `/login`.

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

## Deployment

This project is optimized for [Vercel](https://vercel.com/) deployment. The `turbo.json` configuration includes Vercel-aware environment variables.

For other platforms, run:

```bash
pnpm build
pnpm start
```
