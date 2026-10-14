import OpenAI from 'openai';

// One client for the whole module. The v3 library wraps axios: every call returns { data, status, ... }.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? 'sk-test-placeholder' });
