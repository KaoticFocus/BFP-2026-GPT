import { z } from 'zod';

export const SyncMutationTypeSchema = z.enum([
  'task_complete', 'task_update',
  'time_entry_create', 'time_entry_update',
  'checklist_tick', 'punch_item_complete',
  'photo_upload', 'voice_note_upload',
]);
export type SyncMutationType = z.infer<typeof SyncMutationTypeSchema>;

export const SyncMutationSchema = z.object({
  id: z.string().uuid(),
  type: SyncMutationTypeSchema,
  entityId: z.string().uuid().optional(),
  payload: z.record(z.unknown()),
  fileRef: z.string().optional(),
  clientTimestamp: z.coerce.date(),
});
export type SyncMutation = z.infer<typeof SyncMutationSchema>;

export const SyncPushRequestSchema = z.object({
  mutations: z.array(SyncMutationSchema),
});
export type SyncPushRequest = z.infer<typeof SyncPushRequestSchema>;

export const SyncPushResultSchema = z.object({
  id: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
  serverTimestamp: z.coerce.date().optional(),
});
export type SyncPushResult = z.infer<typeof SyncPushResultSchema>;

export const SyncPullRequestSchema = z.object({
  cursor: z.string().optional(),
  entityTypes: z.array(z.string()).optional(),
});
export type SyncPullRequest = z.infer<typeof SyncPullRequestSchema>;

export const SyncDeltaSchema = z.object({
  entityType: z.string(),
  entityId: z.string(),
  operation: z.enum(['create', 'update', 'delete']),
  data: z.record(z.unknown()).optional(),
  timestamp: z.coerce.date(),
});
export type SyncDelta = z.infer<typeof SyncDeltaSchema>;

export const SyncPullResponseSchema = z.object({
  deltas: z.array(SyncDeltaSchema),
  cursor: z.string(),
  hasMore: z.boolean(),
});
export type SyncPullResponse = z.infer<typeof SyncPullResponseSchema>;
