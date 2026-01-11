import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const LeadCreatedPayload = z.object({
  leadId: z.string().uuid(),
  source: z.string().optional(),
});

export const LeadCreated = defineEvent('LeadCreated', LeadCreatedPayload);
registerEventSchema(LeadCreated);

export const LeadQualifiedPayload = z.object({
  leadId: z.string().uuid(),
  qualifiedBy: z.string().uuid(),
});

export const LeadQualified = defineEvent('LeadQualified', LeadQualifiedPayload);
registerEventSchema(LeadQualified);

export const LeadConvertedPayload = z.object({
  leadId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const LeadConverted = defineEvent('LeadConverted', LeadConvertedPayload);
registerEventSchema(LeadConverted);
