import { describe, expect, it } from 'vitest';
import { chatToken, describeToken } from '../src/token.js';
import { greeting } from '../src/twiml.js';

describe('greeting', () => {
  it('produces a Say verb that emphasises the name', () => {
    const xml = greeting('Ada');
    expect(xml).toContain('<Say voice="alice">');
    expect(xml).toContain('Welcome back,');
    expect(xml).toMatch(/<emphasis level="strong">Ada<\/emphasis>/);
    expect(xml).toContain('How can we help today?');
  });
});

describe('chatToken', () => {
  it('carries the identity and exactly one service grant', () => {
    const described = describeToken(chatToken('alice', 'ISxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'));
    expect(described.identity).toBe('alice');
    expect(described.grants).toHaveLength(1);
  });
});
