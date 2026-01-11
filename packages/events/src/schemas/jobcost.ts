import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const BudgetCreatedPayload = z.object({
  projectId: z.string().uuid(),
  budgetId: z.string().uuid(),
  amount: z.number(),
});

export const BudgetCreated = defineEvent('BudgetCreated', BudgetCreatedPayload);
registerEventSchema(BudgetCreated);

export const CostCommittedPayload = z.object({
  projectId: z.string().uuid(),
  amount: z.number(),
  sourceType: z.string(),
});

export const CostCommitted = defineEvent('CostCommitted', CostCommittedPayload);
registerEventSchema(CostCommitted);

export const CostActualizedPayload = z.object({
  projectId: z.string().uuid(),
  amount: z.number(),
  costType: z.string(),
});

export const CostActualized = defineEvent('CostActualized', CostActualizedPayload);
registerEventSchema(CostActualized);

export const BudgetDriftDetectedPayload = z.object({
  projectId: z.string().uuid(),
  driftAmount: z.number(),
  driftPercent: z.number(),
});

export const BudgetDriftDetected = defineEvent('BudgetDriftDetected', BudgetDriftDetectedPayload);
registerEventSchema(BudgetDriftDetected);

export const CORecommendedPayload = z.object({
  projectId: z.string().uuid(),
  reason: z.string(),
  recommendedAmount: z.number(),
});

export const CORecommended = defineEvent('CORecommended', CORecommendedPayload);
registerEventSchema(CORecommended);
