import { prisma } from '@buildflow/db';
import { getPendingOutboxEvents, markEventPublished, incrementRetryCount } from '../events/outbox';
import { processEvent } from '../events/consume';
import { validateEvent, EventEnvelope } from '@buildflow/events';
import type { Prisma } from '@buildflow/db';

let publisherInterval: NodeJS.Timeout | null = null;
const POLL_INTERVAL_MS = 1000;

async function publishPendingEvents(): Promise<void> {
  try {
    const pendingEvents = await getPendingOutboxEvents(100);
    
    for (const outboxEvent of pendingEvents) {
      try {
        const event = outboxEvent.eventPayload as unknown as EventEnvelope;
        const validation = validateEvent(event);
        
        if (!validation.valid) {
          await incrementRetryCount(outboxEvent.id, `Validation failed: ${validation.errors?.join(', ')}`);
          continue;
        }
        
        // Move to event log
        const eventLog = await prisma.eventLog.create({
          data: {
            id: event.id,
            eventType: event.type,
            eventPayload: event as unknown as Prisma.InputJsonValue,
            orgId: event.orgId,
            actorId: event.actorId,
            correlationId: event.correlationId,
          },
        });
        
        await markEventPublished(outboxEvent.id);
        
        // Process consumers (non-blocking)
        processEvent(eventLog.id, event).catch(err => {
          console.error(`Error processing event ${event.id}:`, err);
        });
        
      } catch (error) {
        await incrementRetryCount(outboxEvent.id, error instanceof Error ? error.message : String(error));
      }
    }
  } catch (error) {
    console.error('Outbox publisher error:', error);
  }
}

export function startOutboxPublisher(): void {
  if (publisherInterval) return;
  
  publisherInterval = setInterval(publishPendingEvents, POLL_INTERVAL_MS);
  console.log('📤 Outbox publisher started');
}

export function stopOutboxPublisher(): void {
  if (publisherInterval) {
    clearInterval(publisherInterval);
    publisherInterval = null;
    console.log('📤 Outbox publisher stopped');
  }
}
