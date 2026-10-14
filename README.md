# openai-agent-test

A small assistant module on the `openai` Node library **v3** (`Configuration` + `OpenAIApi`, `createChatCompletion`, `response.data`), used as a target repository for API Update Agent. The real migration here is the v3 to v4 change of the library: `new OpenAI(...)`, `client.chat.completions.create(...)`, results returned directly instead of under `data`.

- `src/openai.ts`: the client.
- `src/assistant.ts`: `answer()` and `listModelIds()` use the library; `extractAnswer()` and `newestModelId()` are pure helpers whose input shape is the same in every library version.
- `test/`: tests the pure helpers only, so they stay green across the migration; the typecheck is what the migration changes.
