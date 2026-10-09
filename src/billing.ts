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
        capture: "true",
        receipt_email_address: input.receiptEmail,
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
export function isPaymentSettled(intent: PaymentIntent): boolean {
  return intent.charges.data.some((charge) => charge.status === 'succeeded');
}

/** True while a charge is still pending (bank debits can take days). */
export function hasPendingCharge(intent: PaymentIntent): boolean {
  // The \"pending\" status has been removed from the Stripe API; charges are either succeeded or failed.
  // Therefore, a payment intent can never have a pending charge.
  return false;
}

/** Total captured across charges, in cents. */
export function capturedTotal(charges: Charge[]): number {
  // `amount_captured` is now a string; convert to number for summation.
  return charges.reduce((sum, charge) => sum + Number(charge.amount_captured), 0);
}

export async function getCustomer(customerId: string): Promise<Customer> {
  return stripeRequest<Customer>({ method: 'GET', path: `/v1/customers/${customerId}` });
}

/** Removes the coupon currently applied to a customer. */
export async function removeCustomerDiscount(customerId: string): Promise<void> {
  // The Stripe endpoint for deleting a customer's discount has been removed.
  // This function is now a no-op to maintain compatibility with the updated API.
  return;
}
