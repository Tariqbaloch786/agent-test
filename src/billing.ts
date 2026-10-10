import type Stripe from 'stripe';
import { stripe } from './stripe.js';

export interface SubscriptionSummary {
  id: string;
  status: Stripe.Subscription.Status;
  priceId: string | null;
  periodStart: Date;
  periodEnd: Date;
}

/** The current billing period of a subscription, for the account page. */
export function summarize(subscription: Stripe.Subscription): SubscriptionSummary {
  return {
    id: subscription.id,
    status: subscription.status,
    priceId: subscription.items.data[0]?.price.id ?? null,
    periodStart: new Date(subscription.current_period_start * 1000),
    periodEnd: new Date(subscription.current_period_end * 1000),
  };
}

export async function describeSubscription(subscriptionId: string): Promise<SubscriptionSummary> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return summarize(subscription);
}

/** Whole days until the subscription renews, never negative. */
export function daysUntilRenewal(subscription: Stripe.Subscription, now = new Date()): number {
  const end = subscription.current_period_end * 1000;
  return Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000));
}

/** The subscription an invoice belongs to, as an id, or null for a one-off invoice. */
export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.subscription;
  if (!subscription) return null;
  return typeof subscription === 'string' ? subscription : subscription.id;
}

export async function subscriptionForInvoice(invoiceId: string): Promise<string | null> {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoiceSubscriptionId(invoice);
}
