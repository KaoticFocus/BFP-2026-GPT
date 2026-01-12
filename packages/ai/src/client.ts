import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatCompletion(params: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  maxTokens?: number;
}): Promise<{ content: string; usage: { inputTokens: number; outputTokens: number } }> {
  const response = await openai.chat.completions.create({
    model: params.model ?? 'gpt-4o',
    messages: params.messages,
    temperature: params.temperature ?? 0.7,
    max_tokens: params.maxTokens ?? 4096,
  });

  return {
    content: response.choices[0]?.message?.content ?? '',
    usage: {
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
    },
  };
}

export async function generateCompletion(params: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  temperature?: number;
  model?: string;
}): Promise<{
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}> {
  const startTime = Date.now();
  const model = params.model ?? 'gpt-4o';
  
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: params.systemPrompt },
    { role: 'user', content: params.userPrompt },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: params.temperature ?? 0.7,
    response_format: params.jsonMode ? { type: 'json_object' } : undefined,
  });

  const latencyMs = Date.now() - startTime;

  return {
    content: response.choices[0]?.message?.content ?? '',
    model,
    inputTokens: response.usage?.prompt_tokens ?? 0,
    outputTokens: response.usage?.completion_tokens ?? 0,
    latencyMs,
  };
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0]?.embedding ?? [];
}
