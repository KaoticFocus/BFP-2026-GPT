import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const MessageDraftCreatedPayload = z.object({
  draftId: z.string().uuid(),
  channel: z.string(),
});

export const MessageDraftCreated = defineEvent('MessageDraftCreated', MessageDraftCreatedPayload);
registerEventSchema(MessageDraftCreated);

export const MessageSentPayload = z.object({
  messageId: z.string().uuid(),
  channel: z.string(),
  recipientId: z.string().uuid().optional(),
});

export const MessageSent = defineEvent('MessageSent', MessageSentPayload);
registerEventSchema(MessageSent);
