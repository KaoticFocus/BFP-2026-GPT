import { prisma } from '@buildflow/db';
import type { Prisma } from '@prisma/client';

export interface AIActionLogParams {
  orgId: string;
  userId?: string;
  promptId: string;
  promptVersion: number;
  model: string;
  inputJson: Prisma.InputJsonValue;
  outputJson: Prisma.InputJsonValue;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  triggerType: 'ask' | 'transform' | 'classify' | 'extract' | 'generate';
  triggerEntityType?: string;
  triggerEntityId?: string;
}

export async function logAIAction(params: AIActionLogParams): Promise<string> {
  const log = await prisma.aIActionLog.create({
    data: params as any,
  });
  return log.id;
}

export interface CreateAIActionLogParams {
  orgId: string;
  userId?: string;
  promptId: string;
  promptVersion: number;
  triggerType: 'ask' | 'transform' | 'classify' | 'extract' | 'generate';
  inputJson: Record<string, unknown>;
  completionResult: {
    content: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
  };
  outputJson: Record<string, unknown>;
  triggerEntityType?: string;
  triggerEntityId?: string;
}

export async function createAIActionLog(params: CreateAIActionLogParams): Promise<string> {
  const log = await prisma.aIActionLog.create({
    data: {
      orgId: params.orgId,
      userId: params.userId,
      promptId: params.promptId,
      promptVersion: params.promptVersion,
      model: params.completionResult.model,
      inputJson: params.inputJson as Prisma.InputJsonValue,
      outputJson: params.outputJson as Prisma.InputJsonValue,
      inputTokens: params.completionResult.inputTokens,
      outputTokens: params.completionResult.outputTokens,
      latencyMs: params.completionResult.latencyMs,
      triggerType: params.triggerType,
      triggerEntityType: params.triggerEntityType,
      triggerEntityId: params.triggerEntityId,
    },
  });
  return log.id;
}

export async function addCitations(
  aiActionLogId: string,
  citations: Array<{ documentChunkId: string; score: number }>
): Promise<void> {
  await prisma.aIActionLogCitation.createMany({
    data: citations.map((cite, index) => ({
      aiActionLogId,
      documentChunkId: cite.documentChunkId,
      score: cite.score,
      position: index,
    })),
  });
}
