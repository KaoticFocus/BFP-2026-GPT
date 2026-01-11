import { prisma } from '@buildflow/db';

export interface AIActionLogParams {
  orgId: string;
  userId?: string;
  promptId: string;
  promptVersion: number;
  model: string;
  inputJson: Record<string, unknown>;
  outputJson: Record<string, unknown>;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  triggerType: 'ask' | 'transform' | 'classify' | 'extract' | 'generate';
  triggerEntityType?: string;
  triggerEntityId?: string;
}

export async function logAIAction(params: AIActionLogParams): Promise<string> {
  const log = await prisma.aIActionLog.create({
    data: params,
  });
  return log.id;
}
