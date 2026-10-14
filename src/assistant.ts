import { openai } from './openai.js';

/** The parts of a chat completion this module reads; the same shape in every library version. */
export interface CompletionLike {
  choices: Array<{ message?: { content?: string | null } | null }>;
}

export interface ModelLike {
  id: string;
  created: number;
}

/** The assistant's first answer, trimmed; empty when the completion has none. */
export function extractAnswer(completion: CompletionLike): string {
  return completion.choices[0]?.message?.content?.trim() ?? '';
}

/** The id of the most recently created model, or null for an empty list. */
export function newestModelId(models: ModelLike[]): string | null {
  const newest = [...models].sort((a, b) => b.created - a.created)[0];
  return newest ? newest.id : null;
}

/** Asks the model one question and returns its answer. */
export async function answer(question: string): Promise<string> {
  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: question }],
    max_tokens: 200,
  });
  return extractAnswer(response.data);
}

/** The ids of every model the key can use, newest first. */
export async function listModelIds(): Promise<string[]> {
  const response = await openai.listModels();
  return [...response.data.data].sort((a, b) => b.created - a.created).map((model) => model.id);
}
