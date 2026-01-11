import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const ChangeOrderDraftedPayload = z.object({
  draftId: z.string().uuid(),
  amount: z.number(),
});

export const ChangeOrderDrafted = defineEvent('ChangeOrderDrafted', ChangeOrderDraftedPayload);
registerEventSchema(ChangeOrderDrafted);

export const ChangeOrderApprovedPayload = z.object({
  changeOrderId: z.string().uuid(),
  draftId: z.string().uuid(),
  amount: z.number(),
});

export const ChangeOrderApproved = defineEvent('ChangeOrderApproved', ChangeOrderApprovedPayload);
registerEventSchema(ChangeOrderApproved);

export const BudgetUpdatedPayload = z.object({
  projectId: z.string().uuid(),
  changeOrderId: z.string().uuid(),
  newTotal: z.number(),
});

export const BudgetUpdated = defineEvent('BudgetUpdated', BudgetUpdatedPayload);
registerEventSchema(BudgetUpdated);
