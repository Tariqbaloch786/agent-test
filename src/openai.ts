import { Configuration, OpenAIApi } from 'openai';

// One client for the whole module. The v3 library wraps axios: every call returns { data, status, ... }.
export const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY ?? 'sk-test-placeholder' }));
