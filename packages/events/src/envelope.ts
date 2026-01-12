import { randomUUID } from 'crypto';
import { z } from 'zod';
import { IdSchema, OrgIdSchema } from '@buildflow/shared';

export const EventEnvelopeSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  version: z.number().int().positive().default(1),
  orgId: OrgIdSchema,
  actorId: IdSchema.optional(),
  actorType: z.enum(['user', 'system', 'ai']).default('user'),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
  timestamp: z.coerce.date(),
  payload: z.record(z.unknown()),
  metadata: z.object({
    source: z.string().optional(),
    requestId: z.string().optional(),
    userAgent: z.string().optional(),
  }).optional(),
});

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;

export function createEvent<T extends Record<string, unknown>>(params: {
  type: string;
  orgId: string;
  payload: T;
  actorId?: string;
  actorType?: 'user' | 'system' | 'ai';
  correlationId?: string;
  causationId?: string;
  version?: number;
  metadata?: EventEnvelope['metadata'];
}): EventEnvelope {
  return {
    id: randomUUID(),
    type: params.type,
    version: params.version ?? 1,
    orgId: params.orgId,
    actorId: params.actorId,
    actorType: params.actorType ?? 'user',
    correlationId: params.correlationId,
    causationId: params.causationId,
    timestamp: new Date(),
    payload: params.payload,
    metadata: params.metadata,
  };
}

export function defineEvent<TPayload extends z.ZodType>(type: string, payloadSchema: TPayload) {
  return {
    type,
    payloadSchema,
    create: (params: {
      orgId: string;
      payload: z.infer<TPayload>;
      actorId?: string;
      actorType?: 'user' | 'system' | 'ai';
      correlationId?: string;
      causationId?: string;
    }): EventEnvelope => createEvent({ ...params, type }),
    validate: (event: EventEnvelope): boolean => {
      if (event.type !== type) return false;
      const result = payloadSchema.safeParse(event.payload);
      return result.success;
    },
    parsePayload: (event: EventEnvelope): z.infer<TPayload> => {
      if (event.type !== type) throw new Error(`Expected event type ${type}, got ${event.type}`);
      return payloadSchema.parse(event.payload);
    },
  };
}
