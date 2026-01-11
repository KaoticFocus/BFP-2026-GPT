import { prisma } from '@buildflow/db';
import { EventEnvelope } from '@buildflow/events';
import { getEventHandlers } from '@buildflow/events';

export async function processEvent(eventLogId: string, event: EventEnvelope): Promise<void> {
  const handlers = getEventHandlers(event.type);
  
  for (const [consumerName, handler] of handlers) {
    const existingReceipt = await prisma.eventConsumerReceipt.findUnique({
      where: { eventLogId_consumerName: { eventLogId, consumerName } },
    });
    
    if (existingReceipt) {
      continue; // Already processed - idempotent
    }
    
    try {
      await handler(event);
      
      await prisma.eventConsumerReceipt.create({
        data: {
          eventLogId,
          consumerName,
          success: true,
        },
      });
    } catch (error) {
      await prisma.eventConsumerReceipt.create({
        data: {
          eventLogId,
          consumerName,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      });
      
      await prisma.deadLetter.create({
        data: {
          eventLogId,
          consumerName,
          error: error instanceof Error ? error.message : String(error),
          payload: event as unknown as object,
        },
      });
    }
  }
}
