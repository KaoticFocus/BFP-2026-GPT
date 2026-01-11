# BuildFlow Pro AI

AI-powered construction project management platform.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start infrastructure
docker-compose up -d

# Run migrations and seed
pnpm db:migrate
pnpm db:seed

# Start development
pnpm dev

# Run E2E demo
pnpm demo
```

## Architecture

- **Monorepo**: pnpm + Turborepo
- **API**: Fastify + Prisma
- **Web**: Next.js App Router
- **Mobile**: Expo React Native
- **Database**: PostgreSQL + pgvector
- **Queue**: BullMQ + Redis
- **Storage**: S3-compatible (MinIO dev)

## Documentation

- [Demo Script](docs/demo-script.md)
- [Demo Data](docs/demo-data.md)
- [Architecture](docs/architecture.md)
- [Assumptions](docs/assumptions.md)

## PRD Implementation

All 21 PRDs + E2E demo have been implemented:

| PRD | Feature |
|-----|---------|
| 1 | Auth, RBAC, Audit |
| 2 | Events & Outbox |
| 3 | Mobile Offline Sync |
| 4 | Browser Extension |
| 5 | Companion App |
| 6 | Ask BuildFlow (RAG) |
| 7 | Universal Intake |
| 8 | Document Intelligence |
| 9 | Transformers |
| 10 | Approvals |
| 11 | Messaging Hub |
| 12 | MeetingFlow |
| 13 | TaskFlow |
| 14 | CloserFlow |
| 15 | ScheduleFlow |
| 16 | TimeClock |
| 17 | JobCost |
| 18 | Change Orders |
| 19 | Procurement |
| 20 | SOP Gates |
| 21 | Closeout & Reviews |

See `docs/cursor-prompts/` for the full prompt pack.
