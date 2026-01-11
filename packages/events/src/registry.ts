import { EventEnvelope, EventEnvelopeSchema } from './envelope';
import { z } from 'zod';

type EventHandler = (event: EventEnvelope) => Promise<void>;
type EventDefinition = { type: string; payloadSchema: z.ZodType };

const eventRegistry = new Map<string, EventDefinition>();
const eventHandlers = new Map<string, Map<string, EventHandler>>();

export function registerEventSchema(definition: EventDefinition): void {
  eventRegistry.set(definition.type, definition);
}

export function getEventSchema(type: string): EventDefinition | undefined {
  return eventRegistry.get(type);
}

export function validateEvent(event: unknown): { valid: boolean; errors?: string[] } {
  const baseResult = EventEnvelopeSchema.safeParse(event);
  if (!baseResult.success) {
    return { valid: false, errors: baseResult.error.errors.map(e => e.message) };
  }
  const definition = eventRegistry.get(baseResult.data.type);
  if (!definition) {
    return { valid: true };
  }
  const payloadResult = definition.payloadSchema.safeParse(baseResult.data.payload);
  if (!payloadResult.success) {
    return { valid: false, errors: payloadResult.error.errors.map(e => e.message) };
  }
  return { valid: true };
}

export function registerEventHandler(eventType: string, consumerName: string, handler: EventHandler): void {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new Map());
  }
  eventHandlers.get(eventType)!.set(consumerName, handler);
}

export function getEventHandlers(eventType: string): Map<string, EventHandler> {
  return eventHandlers.get(eventType) || new Map();
}

export function listRegisteredEvents(): string[] {
  return Array.from(eventRegistry.keys());
}
