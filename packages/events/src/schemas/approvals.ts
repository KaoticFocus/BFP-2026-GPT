import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const ApprovalRequestedPayload = z.object({
  approvalRequestId: z.string().uuid(),
  approvalType: z.string(),
  targetEntityType: z.string(),
  targetEntityId: z.string().uuid(),
});

export const ApprovalRequested = defineEvent('ApprovalRequested', ApprovalRequestedPayload);
registerEventSchema(ApprovalRequested);

export const ApprovalDecidedPayload = z.object({
  approvalRequestId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  decidedBy: z.string().uuid(),
});

export const ApprovalDecided = defineEvent('ApprovalDecided', ApprovalDecidedPayload);
registerEventSchema(ApprovalDecided);
