import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const MeetingScheduledPayload = z.object({
  meetingId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
});

export const MeetingScheduled = defineEvent('MeetingScheduled', MeetingScheduledPayload);
registerEventSchema(MeetingScheduled);

export const TranscriptionCompletedPayload = z.object({
  meetingId: z.string().uuid(),
  transcriptId: z.string().uuid(),
});

export const TranscriptionCompleted = defineEvent('TranscriptionCompleted', TranscriptionCompletedPayload);
registerEventSchema(TranscriptionCompleted);
