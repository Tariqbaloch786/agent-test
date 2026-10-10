import { describe, expect, it } from 'vitest';
import type Stripe from 'stripe';
import { daysUntilRenewal, invoiceSubscriptionId, summarize } from '../src/billing.js';

// Objects shaped as the 2025-03-31.basil API returns them: the billing period lives on each
// subscription item, and an invoice's subscription lives under parent.subscription_details.
const subscription = {
  id: 'sub_123',
  object: 'subscription',
  status: 'active',
  items: {
    object: 'list',
    data: [{ id: 'si_1', object: 'subscription_item', current_period_start: 1_767_225_600, current_period_end: 1_769_904_000, price: { id: 'price_basic' } }],
    has_more: false,
    url: '/v1/subscription_items',
  },
} as unknown as Stripe.Subscription;

const subscriptionInvoice = {
  id: 'in_1',
  object: 'invoice',
  parent: { type: 'subscription_details', subscription_details: { subscription: 'sub_123', metadata: {} } },
} as unknown as Stripe.Invoice;

const oneOffInvoice = { id: 'in_2', object: 'invoice', parent: null } as unknown as Stripe.Invoice;

describe('summarize', () => {
  it('reports the current period and the price of the subscription', () => {
    const summary = summarize(subscription);
    expect(summary.id).toBe('sub_123');
    expect(summary.status).toBe('active');
    expect(summary.priceId).toBe('price_basic');
    expect(summary.periodStart.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    expect(summary.periodEnd.toISOString()).toBe('2026-02-01T00:00:00.000Z');
  });
});

describe('daysUntilRenewal', () => {
  it('counts whole days until the period ends and never goes negative', () => {
    expect(daysUntilRenewal(subscription, new Date('2026-01-20T00:00:00Z'))).toBe(12);
    expect(daysUntilRenewal(subscription, new Date('2026-03-01T00:00:00Z'))).toBe(0);
  });
});

describe('invoiceSubscriptionId', () => {
  it('returns the subscription id of a subscription invoice', () => {
    expect(invoiceSubscriptionId(subscriptionInvoice)).toBe('sub_123');
  });

  it('returns null for a one-off invoice', () => {
    expect(invoiceSubscriptionId(oneOffInvoice)).toBeNull();
  });
});
