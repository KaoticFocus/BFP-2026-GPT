// BuildFlow Pro AI - Ask BuildFlow Service
// Grounded Q&A with citations and RBAC-filtered retrieval

import { generateCompletion } from '../client';
import { createAIActionLog, addCitations } from '../actionLog';
import { retrieveChunks, buildContext, type RetrievalResult } from '../rag';
import { ASK_BUILDFLOW_PROMPT } from '../prompts/ask_buildflow.v1';
import { prisma } from '@buildflow/db';

export interface AskBuildflowInput {
  orgId: string;
  userId: string;
  question: string;
  projectIds?: string[];
}

export interface Citation {
  sourceIndex: number;
  chunkId: string;
  documentId: string;
  documentName?: string;
  relevantQuote: string;
  deepLink: string;
  score: number;
}

export interface AskBuildflowResult {
  answerMarkdown: string;
  citations: Citation[];
  aiActionLogId: string;
  confidence: number;
  needsMoreContext: boolean;
}

/**
 * Ask BuildFlow - grounded Q&A with citations
 * 
 * 1. Retrieve relevant document chunks (RBAC-filtered by orgId)
 * 2. Build context from chunks
 * 3. Generate answer with citations
 * 4. Log the AI action
 * 5. Return answer with deep links to sources
 */
export async function askBuildflow(
  input: AskBuildflowInput
): Promise<AskBuildflowResult> {
  const { orgId, userId, question, projectIds } = input;

  // 1. Retrieve relevant chunks (scoped by orgId)
  const chunks = await retrieveChunks({
    orgId,
    query: question,
    projectIds,
    limit: 8,
    minScore: 0.65,
  });

  if (chunks.length === 0) {
    // No relevant context found - return graceful response
    const noContextResult: AskBuildflowResult = {
      answerMarkdown: "I couldn't find any relevant information in your documents to answer this question. Please try rephrasing or ensure the relevant documents have been uploaded.",
      citations: [],
      aiActionLogId: '',
      confidence: 0,
      needsMoreContext: true,
    };

    // Still log the attempt
    const logId = await createAIActionLog({
      orgId,
      userId,
      promptId: ASK_BUILDFLOW_PROMPT.id,
      promptVersion: ASK_BUILDFLOW_PROMPT.version,
      triggerType: 'ask',
      inputJson: { question, projectIds },
      completionResult: {
        content: '',
        model: 'none',
        inputTokens: 0,
        outputTokens: 0,
        latencyMs: 0,
      },
      outputJson: { noContext: true },
    });

    noContextResult.aiActionLogId = logId;
    return noContextResult;
  }

  // 2. Build context from chunks
  const context = buildContext(chunks);

  // 3. Generate answer with LLM
  const userPrompt = ASK_BUILDFLOW_PROMPT.userPromptTemplate
    .replace('{{context}}', context)
    .replace('{{question}}', question);

  const completion = await generateCompletion({
    systemPrompt: ASK_BUILDFLOW_PROMPT.systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.3,
  });

  // 4. Parse LLM response
  let parsed: {
    answer: string;
    citations: Array<{
      sourceIndex: number;
      chunkId?: string;
      relevantQuote: string;
    }>;
    confidence: number;
    needsMoreContext: boolean;
  };

  try {
    parsed = JSON.parse(completion.content);
  } catch {
    // If JSON parsing fails, treat the content as the answer
    parsed = {
      answer: completion.content,
      citations: [],
      confidence: 0.5,
      needsMoreContext: false,
    };
  }

  // 5. Enrich citations with deep links
  const enrichedCitations = await enrichCitations(chunks, parsed.citations, orgId);

  // 6. Log the AI action
  const aiActionLogId = await createAIActionLog({
    orgId,
    userId,
    promptId: ASK_BUILDFLOW_PROMPT.id,
    promptVersion: ASK_BUILDFLOW_PROMPT.version,
    triggerType: 'ask',
    inputJson: {
      question,
      projectIds,
      chunksRetrieved: chunks.length,
    },
    completionResult: completion,
    outputJson: {
      answer: parsed.answer,
      citationCount: enrichedCitations.length,
      confidence: parsed.confidence,
    },
  });

  // 7. Add retrieval citations to the log
  await addCitations(
    aiActionLogId,
    chunks.map((c) => ({
      documentChunkId: c.chunkId,
      score: c.score,
    }))
  );

  return {
    answerMarkdown: parsed.answer,
    citations: enrichedCitations,
    aiActionLogId,
    confidence: parsed.confidence ?? 0.7,
    needsMoreContext: parsed.needsMoreContext ?? false,
  };
}

/**
 * Enrich citations with document names and deep links
 */
async function enrichCitations(
  chunks: RetrievalResult[],
  llmCitations: Array<{ sourceIndex: number; chunkId?: string; relevantQuote: string }>,
  orgId: string
): Promise<Citation[]> {
  // Get document info for all chunks
  const documentIds = [...new Set(chunks.map((c) => c.documentId))];
  const documents = await prisma.document.findMany({
    where: { id: { in: documentIds }, orgId },
    select: { id: true, filename: true, projectId: true },
  });

  const docMap = new Map(documents.map((d) => [d.id, d]));

  return llmCitations.map((cite) => {
    const chunkIndex = (cite.sourceIndex ?? 1) - 1;
    const chunk = chunks[chunkIndex];

    if (!chunk) {
      return {
        sourceIndex: cite.sourceIndex,
        chunkId: '',
        documentId: '',
        relevantQuote: cite.relevantQuote,
        deepLink: '',
        score: 0,
      };
    }

    const doc = docMap.get(chunk.documentId);
    const projectId = doc?.projectId;

    // Build deep link to document
    // Format: /app/{org}/documents/{docId}
    const deepLink = projectId
      ? `/documents/${chunk.documentId}`
      : `/documents/${chunk.documentId}`;

    return {
      sourceIndex: cite.sourceIndex,
      chunkId: chunk.chunkId,
      documentId: chunk.documentId,
      documentName: doc?.filename,
      relevantQuote: cite.relevantQuote,
      deepLink,
      score: chunk.score,
    };
  });
}

/**
 * Get AIActionLog with full details including citations
 */
export async function getAskActionLog(logId: string, orgId: string) {
  const log = await prisma.aIActionLog.findFirst({
    where: { id: logId, orgId },
    include: {
      citations: {
        include: {
          documentChunk: {
            include: {
              document: {
                select: { id: true, filename: true, projectId: true },
              },
            },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  return log;
}
