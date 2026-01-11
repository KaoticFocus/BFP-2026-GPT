# BuildFlow Pro AI - Demo Script

Step-by-step guide to demonstrate the full BuildFlow Pro AI workflow.

## Prerequisites

```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Run migrations and seed
pnpm db:migrate
pnpm db:seed

# 3. Start API server
pnpm --filter @buildflow/api dev

# 4. Start web app
pnpm --filter @buildflow/web dev

# 5. (Optional) Run automated demo flow
pnpm demo
```

## Demo Credentials

| Role | Email | Description |
|------|-------|-------------|
| Owner | owner@demo.buildflow.local | Full admin access |
| Sales | sales@demo.buildflow.local | Sales/leads access |
| Tech | tech@demo.buildflow.local | Field tech access |

**Org Slug:** `demo`

## Demo Flow

1. Login & Dashboard
2. View Lead
3. Schedule Meeting with Consent
4. Review Transcript & Generate Tasks
5. Create Scope & Estimate
6. Create Budget from Estimate
7. Send RFQ & Accept Quote
8. Enter Time & Approve Timesheet
9. View Job Cost Variance
10. Create Change Order Draft
11. Approve CO & Send Customer Message
12. Complete Tasks & Punch List
13. Mark Closeout Ready
14. Generate Handoff Packet
15. Create Review Request Draft

See full documentation for detailed steps.
