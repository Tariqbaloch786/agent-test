import { stripeRequest } from './stripe/client.js';
import type { Charge, Customer, DeletedObject, PaymentIntent } from './stripe/types.js';

export interface NewCharge {
  amountCents: number;
  currency: string;
  /** A card token or source id, e.g. "tok_visa". */
  source: string;
  receiptEmail?: string;
  /** Connected account that should receive the funds. */
  destinationAccount?: string;
}

/** Creates and immediately captures a card charge. */
export async function createCharge(input: NewCharge): Promise<Charge> {
  return stripeRequest<Charge>({
    method: 'POST',
    path: '/v1/charges',
    params: {
      amount: input.amountCents,
      currency: input.currency,
      source: input.source,
      capture: true,
      receipt_email: input.receiptEmail,
      destination: input.destinationAccount ? { account: input.destinationAccount } : undefined,
      description: 'agent-test order',
    },
  });
}

/** Captures a charge that was created with capture=false. */
export async function captureCharge(chargeId: string, amountCents?: number): Promise<Charge> {
  return stripeRequest<Charge>({
    method: 'POST',
    path: `/v1/charges/${chargeId}/capture`,
    params: amountCents === undefined ? {} : { amount: amountCents },
  });
}

export async function getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
  return stripeRequest<PaymentIntent>({ method: 'GET', path: `/v1/payment_intents/${paymentIntentId}` });
}

/** True once any charge created by the payment intent succeeded. */
export function isPaymentSettled(chargesOrIntent: Charge[] | PaymentIntent): boolean {
  if (Array.isArray(chargesOrIntent)) {
    return chargesOrIntent.some((charge) => charge.status === 'succeeded');
  }
  // For a PaymentIntent, consider it settled when its status indicates success.
  return chargesOrIntent.status === 'succeeded';
}

/** True while a charge is still pending (bank debits can take days). */
export function hasPendingCharge(chargesOrIntent: Charge[] | PaymentIntent): boolean {
  if (Array.isArray(chargesOrIntent)) {
    return chargesOrIntent.some((charge) => charge.status === 'pending');
  }
  // PaymentIntent does not expose individual charge status; treat as not pending.
  return false;
}

/** Total captured across charges, in cents. */
export function capturedTotal(chargesOrIntent: Charge[] | PaymentIntent): number {
  if (Array.isArray(chargesOrIntent)) {
    return chargesOrIntent.reduce((sum, charge) => sum + charge.amount_captured, 0);
  }
  // PaymentIntent does not provide captured amount per charge; return 0.
  return 0;
}

export async function getCustomer(customerId: string): Promise<Customer> {
  return stripeRequest<Customer>({ method: 'GET', path: `/v1/customers/${customerId}` });
}

/** Removes the coupon currently applied to a customer. */
export async function removeCustomerDiscount(customerId: string): Promise<void> {
  await stripeRequest<DeletedObject>({ method: 'DELETE', path: `/v1/customers/${customerId}/discount` });
}
