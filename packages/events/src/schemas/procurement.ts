import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const RFQSentPayload = z.object({
  rfqId: z.string().uuid(),
  vendorId: z.string().uuid(),
});

export const RFQSent = defineEvent('RFQSent', RFQSentPayload);
registerEventSchema(RFQSent);

export const QuoteReceivedPayload = z.object({
  quoteId: z.string().uuid(),
  vendorId: z.string().uuid(),
  amount: z.number(),
});

export const QuoteReceived = defineEvent('QuoteReceived', QuoteReceivedPayload);
registerEventSchema(QuoteReceived);

export const QuoteAcceptedPayload = z.object({
  quoteId: z.string().uuid(),
  commitmentId: z.string().uuid(),
});

export const QuoteAccepted = defineEvent('QuoteAccepted', QuoteAcceptedPayload);
registerEventSchema(QuoteAccepted);
