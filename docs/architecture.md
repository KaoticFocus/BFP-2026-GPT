# BuildFlow Pro AI - Architecture

## Overview

BuildFlow Pro AI is an AI-powered construction project management platform.

## Monorepo Structure

```
buildflow-pro-ai/
├── apps/
│   ├── api/          # Fastify API server
│   ├── web/          # Next.js web app
│   ├── mobile/       # Expo React Native
│   ├── extension/    # Chrome MV3 extension
│   └── companion/    # Electron tray app
├── packages/
│   ├── db/           # Prisma client + schema
│   ├── shared/       # Shared types & utils
│   ├── events/       # Event schemas
│   ├── ai/           # AI client + prompts
│   └── ui/           # Shared UI components
└── docs/
    └── cursor-prompts/  # PRD prompt pack
```

## Key Patterns

### Multi-Tenancy
Every domain record includes `orgId`. All queries scope by org.

### Event-Driven Architecture
- Outbox Pattern for reliable event publishing
- Idempotent consumers with receipts
- Dead letter queue for failed events

### AI Safety
- Review-first: AI outputs are drafts
- Approval gates for external actions
- Full audit logging with citations

## Technology Stack

- TypeScript everywhere
- pnpm + Turborepo
- Next.js App Router
- Fastify API
- PostgreSQL + pgvector
- Redis + BullMQ
- S3-compatible storage
