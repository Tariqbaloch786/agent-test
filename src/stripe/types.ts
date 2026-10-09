/** Stripe object shapes as of API version 2022-08-01 (only the fields this app reads). */

export type ChargeStatus = 'succeeded' | 'failed';

export interface Charge {
  id: string;
  object: 'charge';
  amount: number;
  amount_captured: number;
  currency: string;
  status: ChargeStatus;
  captured: boolean;
  receipt_email: string | null;
}

export interface ChargeList {
  object: 'list';
  data: Charge[];
  has_more: boolean;
  url: string;
}

export interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  status: string;
  charges: ChargeList;
}

export interface Customer {
  id: string;
  object: 'customer';
  email: string | null;
  discount: { id: string } | null;
}

export interface DeletedObject {
  id: string;
  object: string;
  deleted: true;
}
