import { prisma } from '@buildflow/db';
import { createEvent, EventEnvelope } from '@buildflow/events';

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
      eventPayload: event as unknown as object,
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
  return prisma.eventOutbox.findMany({
    where: {
      publishedAt: null,
      retryCount: { lt: 5 },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}
