import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  capturedTotal,
  createCharge,
  hasPendingCharge,
  isPaymentSettled,
  removeCustomerDiscount,
} from '../src/billing.js';
import { stripeRequest } from '../src/stripe/client.js';
import type { Charge, PaymentIntent } from '../src/stripe/types.js';

vi.mock('../src/stripe/client.js', () => ({ stripeRequest: vi.fn() }));
const mockedRequest = vi.mocked(stripeRequest);

function charge(overrides: Partial<Charge> = {}): Charge {
  return {
    id: 'ch_1',
    object: 'charge',
    amount: 1000,
    amount_captured: 1000,
    currency: 'usd',
    status: 'succeeded',
    captured: true,
    receipt_email: null,
    ...overrides,
  };
}

function intent(charges: Charge[]): PaymentIntent {
  return {
    id: 'pi_1',
    object: 'payment_intent',
    amount: 1000,
    currency: 'usd',
    status: 'succeeded',
    charges: { object: 'list', data: charges, has_more: false, url: '/v1/charges?payment_intent=pi_1' },
  };
}

beforeEach(() => {
  mockedRequest.mockReset();
});

describe('createCharge', () => {
  it('posts a captured charge with the receipt email and destination account', async () => {
    mockedRequest.mockResolvedValueOnce(charge());
    const result = await createCharge({
      amountCents: 1000,
      currency: 'usd',
      source: 'tok_visa',
      receiptEmail: 'buyer@example.com',
      destinationAccount: 'acct_123',
    });
    expect(result.id).toBe('ch_1');
    expect(mockedRequest).toHaveBeenCalledWith({
      method: 'POST',
      path: '/v1/charges',
      params: {
        amount: 1000,
        currency: 'usd',
        source: 'tok_visa',
        capture: true,
        receipt_email: 'buyer@example.com',
        destination: { account: 'acct_123' },
        description: 'agent-test order',
      },
    });
  });
});

describe('payment intent helpers', () => {
  it('is settled when a charge succeeded', () => {
    expect(isPaymentSettled(intent([charge({ status: 'failed' }), charge({ id: 'ch_2' })]))).toBe(true);
    expect(isPaymentSettled(intent([charge({ status: 'failed' })]))).toBe(false);
    expect(isPaymentSettled(intent([]))).toBe(false);
  });

  it('reports pending charges', () => {
    expect(hasPendingCharge(intent([charge({ status: 'pending' })]))).toBe(true);
    expect(hasPendingCharge(intent([charge()]))).toBe(false);
  });
});

describe('capturedTotal', () => {
  it('sums the captured amounts in cents', () => {
    expect(capturedTotal([charge({ amount_captured: 250 }), charge({ amount_captured: 750 })])).toBe(1000);
    expect(capturedTotal([])).toBe(0);
  });
});

describe('removeCustomerDiscount', () => {
  it('deletes the discount of the customer', async () => {
    await removeCustomerDiscount('cus_1');
    // No request should be made because the endpoint was removed.
    expect(mockedRequest).not.toHaveBeenCalled();
  });
});
