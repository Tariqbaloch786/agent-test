import { describe, expect, it } from 'vitest';

// Deliberately failing and unrelated to Stripe: this test is red on purpose so the repository's
// CI is red before any fix, and it must stay red after one. An update that is blamed for it,
// or that touches it, is wrong.
describe('unrelated bookkeeping', () => {
  it('rounds the invoice total to the nearest cent (known failing: rounding helper not written yet)', () => {
    const roundToCent = (amount: number): number => amount;
    expect(roundToCent(10.005)).toBe(10.01);
  });
});
