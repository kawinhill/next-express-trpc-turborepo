# Next.js + Express + tRPC Turborepo

Modern full-stack TypeScript monorepo with type-safe APIs and shared packages.

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/server/env.example apps/server/.env
cp apps/web/env.example apps/web/.env.local

# Start development
pnpm dev
```

## Structure

```
apps/
├── web/          # Next.js frontend
└── server/       # Express backend
packages/
├── ui/           # Shared components (shadcn/ui)
├── types/        # Shared types & validation
├── utils/        # Shared utilities
└── database/     # Database singleton
```

## Scripts

- `pnpm dev` - Start development
- `pnpm build` - Build all packages
- `pnpm lint` - Lint code
- `pnpm ui:add` - Add shadcn/ui components

## Features

- **Type-safe** end-to-end with tRPC
- **Modern UI** with shadcn/ui + Tailwind
- **Secure** with rate limiting & CORS
- **Validated** with Zod schemas
- **Fast** development with hot reload

## Tech Stack

**Frontend:** Next.js 15, React 19, Tailwind CSS  
**Backend:** Express, tRPC, Winston  
**Shared:** TypeScript, Zod, Turborepo  

## License

MIT
