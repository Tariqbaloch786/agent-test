import { describe, expect, it } from 'vitest';
import { extractAnswer, newestModelId } from '../src/assistant.js';

describe('extractAnswer', () => {
  it('returns the first choice trimmed, or an empty string', () => {
    expect(extractAnswer({ choices: [{ message: { content: '  42  ' } }, { message: { content: 'other' } }] })).toBe('42');
    expect(extractAnswer({ choices: [{ message: { content: null } }] })).toBe('');
    expect(extractAnswer({ choices: [] })).toBe('');
  });
});

describe('newestModelId', () => {
  it('picks the most recently created model', () => {
    expect(newestModelId([{ id: 'old', created: 1 }, { id: 'new', created: 3 }, { id: 'mid', created: 2 }])).toBe('new');
    expect(newestModelId([])).toBeNull();
  });
});
