import { z } from 'zod';
import { defineEvent } from '../envelope';
import { registerEventSchema } from '../registry';

export const DocumentUploadedPayload = z.object({
  documentId: z.string().uuid(),
  fileKey: z.string(),
  mimeType: z.string(),
});

export const DocumentUploaded = defineEvent('DocumentUploaded', DocumentUploadedPayload);
registerEventSchema(DocumentUploaded);

export const DocumentClassifiedPayload = z.object({
  documentId: z.string().uuid(),
  docType: z.string(),
  confidence: z.number(),
});

export const DocumentClassified = defineEvent('DocumentClassified', DocumentClassifiedPayload);
registerEventSchema(DocumentClassified);

export const DocumentExtractedPayload = z.object({
  documentId: z.string().uuid(),
  extractedFields: z.record(z.unknown()),
});

export const DocumentExtracted = defineEvent('DocumentExtracted', DocumentExtractedPayload);
registerEventSchema(DocumentExtracted);
