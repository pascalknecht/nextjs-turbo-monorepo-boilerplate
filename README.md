# Next.js 16 Turborepo Monorepo Boilerplate

A modern, full-featured Turborepo monorepo starter template with Next.js 16, Prisma 7, Better Auth, Stripe, and shadcn/ui.

## 📦 What's Included

### Core Applications

- `apps/nextjs` — Main web application (Next.js 16 with Turbopack)

### Project Structure

```
├── apps/
│   └── nextjs/            # Next.js 16 application
│       ├── prisma/        # Prisma schema
│       └── src/
│           ├── app/       # App Router pages & layouts
│           ├── components/# UI components (shadcn/ui)
│           ├── lib/       # Shared utilities
│           └── use-cases/ # Business logic
├── turbo.json             # Turborepo pipeline config
├── pnpm-workspace.yaml    # pnpm workspace definition
└── .env.example           # Environment variable template
```

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) with [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build System | [Turborepo](https://turbo.build/repo) |
| Database ORM | [Prisma 7](https://www.prisma.io/) with MariaDB adapter |
| Authentication | [Better Auth](https://www.better-auth.com/) |
| Payments | [Stripe](https://stripe.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Linting | [ESLint](https://eslint.org/) |
| Formatting | [Prettier](https://prettier.io/) |

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.19.0
- [pnpm](https://pnpm.io/) 10.6+
- A MariaDB or MySQL database

### Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MariaDB/MySQL connection string |
| `BETTER_AUTH_SECRET` | Secret for Better Auth session signing |
| `BETTER_AUTH_URL` | Base URL of your application |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |

### Development Server

```bash
pnpm install
pnpm db:generate
pnpm dev
```

### Useful Commands

```bash
pnpm dev          # Start all apps in development mode (Turbopack)
pnpm build        # Build all apps for production
pnpm lint         # Lint all apps
pnpm format       # Format codebase with Prettier
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push Prisma schema to database
```
