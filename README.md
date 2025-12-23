# SQL4All

Interactive SQL learning platform built with Next.js 15, Neon DB, and Drizzle ORM.

## Tech Stack

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Clerk
- **State Management**: TanStack Query with optimistic updates
- **Validation**: Zod schemas
- **SQL Sandbox**: PGLite (browser-based PostgreSQL)
- **Styling**: Tailwind CSS + Radix UI
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Bun 1.0+
- Neon Database account
- Clerk account (keys auto-generated on startup)

### Environment Variables

Create a `.env.local` file:

```bash
# Neon Database
DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"
```

> **Note**: Clerk keys are automatically generated on startup. No need to add them manually.

### Database Setup

```bash
bun run db:push
```

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

- `bun dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Run migrations
- `bun run db:push` - Push schema to database
- `bun run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (protected)
│   └── exercises/         # Exercise pages
├── components/            # React components
├── hooks/                 # TanStack Query hooks
├── lib/
│   ├── db/               # Drizzle schema and config
│   ├── validations/      # Zod schemas
│   └── query-client.ts   # TanStack Query config
├── middleware.ts         # Clerk middleware
└── types/                # TypeScript types
```

## Features

- 🎯 Interactive SQL exercises with real-time feedback
- 🔐 Clerk authentication
- 📊 Progress tracking with scores and streaks
- ⚡ Optimistic UI updates
- 🌙 Dark/Light mode
- 📱 Responsive design

## License

MIT
