# BuildFlow Pro AI - Demo Data Reference

This document describes all entities created by the seed and demo flow scripts.

## Deterministic IDs

The demo uses fixed UUIDs for consistent references:

| Entity | ID |
|--------|-------|
| Org | `00000000-0000-0000-0000-000000000001` |
| Owner User | `00000000-0000-0000-0000-000000000010` |
| Sales User | `00000000-0000-0000-0000-000000000011` |
| Tech User | `00000000-0000-0000-0000-000000000012` |
| Customer | `00000000-0000-0000-0000-000000000020` |
| Lead | `00000000-0000-0000-0000-000000000030` |
| Project | `00000000-0000-0000-0000-000000000040` |
| Vendor | `00000000-0000-0000-0000-000000000050` |

## Entities Created by Seed

- Organization: BuildFlow Demo Co
- Users: Owner, Sales, Tech
- Customer: Acme Corporation
- Lead: Acme Office Renovation
- Project: Acme Office Renovation
- Vendor: Premium Electrical Supply
- Cost Codes: Labor, Material, Subcontract, etc.
- Tasks: Site prep, Electrical, HVAC, Finishes
- SOP Template & Checklist Template

## Events Emitted by Demo

- LeadCreated
- TranscriptionCompleted
- TaskCreated
- BudgetCreated
- CostCommitted
- CostActualized
- BudgetDriftDetected
- CORecommended
- ChangeOrderDrafted
- MessageDraftCreated
- MessageSent
- CloseoutReady
- ReviewRequestDrafted
