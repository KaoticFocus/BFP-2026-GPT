import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const CloseoutReadyPayload = z.object({
  projectId: z.string().uuid(),
  closeoutId: z.string().uuid(),
});

export const CloseoutReady = defineEvent('CloseoutReady', CloseoutReadyPayload);
registerEventSchema(CloseoutReady);

export const ReviewRequestDraftedPayload = z.object({
  draftId: z.string().uuid(),
  platform: z.string(),
});

export const ReviewRequestDrafted = defineEvent('ReviewRequestDrafted', ReviewRequestDraftedPayload);
registerEventSchema(ReviewRequestDrafted);

export const ReviewRequestSentPayload = z.object({
  reviewRequestId: z.string().uuid(),
  platform: z.string(),
});

export const ReviewRequestSent = defineEvent('ReviewRequestSent', ReviewRequestSentPayload);
registerEventSchema(ReviewRequestSent);
