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
  // In OpenAI SDK v4 the chat completion endpoint is accessed via `openai.chat.completions.create`.
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: question }],
    max_tokens: 200,
  });
  // The v4 SDK returns the completion object directly (no `.data` wrapper).
  return extractAnswer(response);
}

/** The ids of every model the key can use, newest first. */
export async function listModelIds(): Promise<string[]> {
  // In SDK v4 model listing is performed via `openai.models.list()`.
  const response = await openai.models.list();
  // The response contains a `data` array of models (no nested `data` field).
  return [...response.data].sort((a, b) => b.created - a.created).map((model) => model.id);
}
