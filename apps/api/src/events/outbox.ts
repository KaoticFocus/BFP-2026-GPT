import { prisma } from '@buildflow/db';
import { createEvent, EventEnvelope } from '@buildflow/events';
import type { Prisma } from '@buildflow/db';

export async function insertOutboxEvent(params: {
  type: string;
  orgId: string;
  payload: Record<string, unknown>;
  actorId?: string;
}): Promise<string> {
  const event = createEvent(params);
  
  const outboxEntry = await prisma.eventOutbox.create({
    data: {
      id: event.id,
      eventType: event.type,
      eventPayload: event as unknown as Prisma.InputJsonValue,
      orgId: event.orgId,
    },
  });
  
  return outboxEntry.id;
}

export async function markEventPublished(eventId: string): Promise<void> {
  await prisma.eventOutbox.update({
    where: { id: eventId },
    data: { publishedAt: new Date() },
  });
}

export async function incrementRetryCount(eventId: string, error: string): Promise<void> {
  await prisma.eventOutbox.update({
    where: { id: eventId },
    data: {
      retryCount: { increment: 1 },
      lastError: error,
    },
  });
}

export async function getPendingOutboxEvents(limit = 100): Promise<Array<{ id: string; eventType: string; eventPayload: object; orgId: string }>> {
  const rows = await prisma.eventOutbox.findMany({
    where: {
      publishedAt: null,
      retryCount: { lt: 5 },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
  // Prisma returns JsonValue for Json columns; callers treat it as an EventEnvelope-ish object.
  return rows as unknown as Array<{ id: string; eventType: string; eventPayload: object; orgId: string }>;
}
