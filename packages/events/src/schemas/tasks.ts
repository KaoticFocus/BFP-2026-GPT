import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const TaskCreatedPayload = z.object({
  taskId: z.string().uuid(),
  projectId: z.string().uuid(),
  sourceType: z.string().optional(),
  sourceId: z.string().uuid().optional(),
});

export const TaskCreated = defineEvent('TaskCreated', TaskCreatedPayload);
registerEventSchema(TaskCreated);

export const TaskCompletedPayload = z.object({
  taskId: z.string().uuid(),
  projectId: z.string().uuid(),
  completedBy: z.string().uuid(),
});

export const TaskCompleted = defineEvent('TaskCompleted', TaskCompletedPayload);
registerEventSchema(TaskCompleted);
