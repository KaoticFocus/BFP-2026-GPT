# BuildFlow Pro AI - Assumptions & Decisions

This document tracks key architectural decisions and assumptions made during development.

## Core Assumptions

### Multi-Tenancy
- Every domain record includes `orgId`
- All queries scope by `orgId`
- No cross-org data access

### Authentication & Authorization
- Device-code flow for desktop/mobile
- JWT-based sessions
- RBAC at API layer and AI retrieval

### Event-Driven Architecture
- Outbox pattern for reliable event publishing
- Idempotent consumers with receipts
- Canonical event schemas with Zod

### AI Safety
- Review-first AI (all outputs are drafts)
- Approval gates for external actions
- Full audit logging with citations

## Technology Choices

| Choice | Rationale |
|--------|----------|
| pnpm + Turborepo | Efficient monorepo |
| Fastify | TypeScript-first, performant |
| Prisma | Type-safe DB, migrations |
| pgvector | Vector DB in Postgres |
| BullMQ + Redis | Battle-tested job queue |

## PRD Decisions Summary

### PRD 1: Auth & RBAC
- 6 roles: owner, admin, manager, tech, sales, viewer
- Device-code expiry: 15 minutes
- Session expiry: 7 days

### PRD 2: Events & Outbox
- Outbox polls every 1 second
- Max 5 retries before failure
- Dead letter queue for failed events

### PRD 3-21: See full implementation
All PRDs follow the patterns established in PRD 1-2:
- Multi-tenant with orgId scoping
- Event emission for state changes
- Approval gates for external effects
- AI action logging with citations

## Approval Gates

| Action | Requires Approval |
|--------|------------------|
| Send RFQ to vendor | ✅ |
| Send CO to customer | ✅ |
| Send any email | ✅ |
| Send review request | ✅ |
| Change project stage (red gates) | Override + reason |
