// BuildFlow Pro AI - RAG (Retrieval Augmented Generation)

import { prisma } from '@buildflow/db';
import { Prisma } from '@prisma/client';
import { generateEmbedding } from '../client';
import { MAX_CONTEXT_CHUNKS, MAX_TOKENS_PER_CHUNK } from '@buildflow/shared';

export interface RetrievalResult {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface RetrievalOptions {
  orgId: string;
  query: string;
  limit?: number;
  minScore?: number;
  // RBAC filtering
  userPermissions?: string[];
  projectIds?: string[];
}

/**
 * Retrieve relevant document chunks using vector similarity search
 * with RBAC filtering based on user permissions
 */
export async function retrieveChunks(
  options: RetrievalOptions
): Promise<RetrievalResult[]> {
  const limit = options.limit ?? MAX_CONTEXT_CHUNKS;
  const minScore = options.minScore ?? 0.7;

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(options.query);
  const embeddingString = `[${queryEmbedding.join(',')}]`;

  // Build the query with orgId scoping (multi-tenant requirement)
  // Note: This uses raw SQL for pgvector similarity search
  const results = await prisma.$queryRaw<
    Array<{
      id: string;
      document_id: string;
      content: string;
      metadata: Prisma.JsonValue;
      similarity: number;
    }>
  >`
    SELECT 
      dc.id,
      dc."documentId" as document_id,
      dc.content,
      dc.metadata,
      1 - (dc.embedding <=> ${embeddingString}::vector) as similarity
    FROM "DocumentChunk" dc
    JOIN "Document" d ON dc."documentId" = d.id
    WHERE dc."orgId" = ${options.orgId}
      ${options.projectIds?.length
        ? Prisma.sql`AND d."projectId" IN (${Prisma.join(options.projectIds)})`
        : Prisma.empty}
      AND dc.embedding IS NOT NULL
    ORDER BY dc.embedding <=> ${embeddingString}::vector
    LIMIT ${limit}
  `;

  // Filter by minimum score and map to result format
  return results
    .filter((r) => r.similarity >= minScore)
    .map((r) => ({
      chunkId: r.id,
      documentId: r.document_id,
      content: r.content,
      score: r.similarity,
      metadata: r.metadata as Record<string, unknown> | undefined,
    }));
}

/**
 * Chunk text into smaller pieces for embedding
 */
export function chunkText(
  text: string,
  maxTokens: number = MAX_TOKENS_PER_CHUNK,
  overlap: number = 100
): string[] {
  // Rough approximation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  const overlapChars = overlap * 4;

  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChars;

    // Try to break at a sentence or paragraph boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > start + maxChars / 2) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlapChars;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}

/**
 * Index a document by creating chunks and embeddings
 */
export async function indexDocument(
  documentId: string,
  orgId: string,
  text: string,
  metadata?: Record<string, unknown>
): Promise<number> {
  const chunks = chunkText(text);

  // Delete existing chunks for this document
  await prisma.documentChunk.deleteMany({
    where: { documentId },
  });

  // Create new chunks with embeddings
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    const embeddingString = `[${embedding.join(',')}]`;

    // Use raw SQL to insert with vector type
    await prisma.$executeRaw`
      INSERT INTO "DocumentChunk" (id, "orgId", "documentId", "chunkIndex", content, embedding, metadata, "createdAt")
      VALUES (
        gen_random_uuid(),
        ${orgId},
        ${documentId},
        ${i},
        ${chunks[i]},
        ${embeddingString}::vector,
        ${metadata ? JSON.stringify(metadata) : null}::jsonb,
        NOW()
      )
    `;
  }

  return chunks.length;
}

/**
 * Build context string from retrieved chunks
 */
export function buildContext(chunks: RetrievalResult[]): string {
  return chunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1}]\n${chunk.content}`
    )
    .join('\n\n---\n\n');
}
