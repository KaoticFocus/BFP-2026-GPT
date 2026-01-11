import { describe, it, expect } from 'vitest';
import { createEvent, defineEvent, EventEnvelopeSchema } from '../envelope';
import { validateEvent, parseEvent } from '../registry';
import { z } from 'zod';

describe('Event Envelope', () => {
  it('should create a valid event envelope', () => {
    const event = createEvent({
      type: 'TestEvent',
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: { foo: 'bar' },
      actorId: '123e4567-e89b-12d3-a456-426614174001',
    });

    expect(event.id).toBeDefined();
    expect(event.type).toBe('TestEvent');
    expect(event.orgId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(event.payload).toEqual({ foo: 'bar' });
    expect(event.timestamp).toBeInstanceOf(Date);
  });

  it('should validate envelope structure', () => {
    const validEvent = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'TestEvent',
      version: 1,
      orgId: '123e4567-e89b-12d3-a456-426614174001',
      actorType: 'user',
      timestamp: new Date().toISOString(),
      payload: {},
    };

    const result = EventEnvelopeSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('should reject invalid envelope', () => {
    const invalidEvent = {
      type: 'TestEvent',
      // missing required fields
    };

    const result = EventEnvelopeSchema.safeParse(invalidEvent);
    expect(result.success).toBe(false);
  });
});

describe('Typed Event Definition', () => {
  const TestPayload = z.object({
    itemId: z.string().uuid(),
    quantity: z.number().positive(),
  });

  const TestEvent = defineEvent('TestEvent', TestPayload);

  it('should create typed events', () => {
    const event = TestEvent.create({
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        itemId: '123e4567-e89b-12d3-a456-426614174001',
        quantity: 5,
      },
    });

    expect(event.type).toBe('TestEvent');
    expect(event.payload.itemId).toBe('123e4567-e89b-12d3-a456-426614174001');
    expect(event.payload.quantity).toBe(5);
  });

  it('should validate event payloads', () => {
    const validEvent = TestEvent.create({
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        itemId: '123e4567-e89b-12d3-a456-426614174001',
        quantity: 5,
      },
    });

    expect(TestEvent.validate(validEvent)).toBe(true);
  });

  it('should reject invalid payloads', () => {
    const event = createEvent({
      type: 'TestEvent',
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        itemId: 'not-a-uuid',
        quantity: -5, // invalid: must be positive
      },
    });

    expect(TestEvent.validate(event)).toBe(false);
  });
});

describe('Event Registry', () => {
  it('should validate registered events', () => {
    // LeadCreated is registered in the schemas
    const event = createEvent({
      type: 'LeadCreated',
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        leadId: '123e4567-e89b-12d3-a456-426614174001',
        customerName: 'Test Customer',
      },
    });

    const result = validateEvent(event);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid registered events', () => {
    const event = createEvent({
      type: 'LeadCreated',
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        // missing required leadId
        customerName: 'Test Customer',
      },
    });

    const result = validateEvent(event);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should parse valid events', () => {
    const rawEvent = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'TaskCreated',
      version: 1,
      orgId: '123e4567-e89b-12d3-a456-426614174001',
      actorType: 'user',
      timestamp: new Date().toISOString(),
      payload: {
        taskId: '123e4567-e89b-12d3-a456-426614174002',
        projectId: '123e4567-e89b-12d3-a456-426614174003',
        title: 'Test Task',
      },
    };

    const parsed = parseEvent(rawEvent);
    expect(parsed.type).toBe('TaskCreated');
  });

  it('should reject AIActionLogged with invalid trigger type', () => {
    const event = createEvent({
      type: 'AIActionLogged',
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      payload: {
        aiActionLogId: '123e4567-e89b-12d3-a456-426614174001',
        promptId: 'test_prompt',
        promptVersion: 1,
        model: 'gpt-4o',
        inputTokens: 100,
        outputTokens: 200,
        latencyMs: 500,
        triggerType: 'invalid_trigger', // Not in enum
      },
    });

    const result = validateEvent(event);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('triggerType'))).toBe(true);
  });

  it('should accept valid AIActionLogged event', () => {
    const event = createEvent({
      type: 'AIActionLogged',
      orgId: '123e4567-e89b-12d3-a456-426614174000',
      actorId: '123e4567-e89b-12d3-a456-426614174005',
      payload: {
        aiActionLogId: '123e4567-e89b-12d3-a456-426614174001',
        promptId: 'intake_classifier.v1',
        promptVersion: 1,
        model: 'gpt-4o',
        inputTokens: 100,
        outputTokens: 200,
        latencyMs: 500,
        citationCount: 3,
        triggerType: 'classify',
        triggerEntityType: 'IntakeItem',
        triggerEntityId: '123e4567-e89b-12d3-a456-426614174002',
      },
    });

    const result = validateEvent(event);
    expect(result.valid).toBe(true);
  });
});
