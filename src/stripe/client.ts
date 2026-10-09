/**
 * Minimal Stripe REST client. Talks to the API directly with form-encoded bodies, pinned to
 * the 2022-08-01 API version.
 */

const API_BASE = 'https://api.stripe.com';
export const STRIPE_API_VERSION = '2022-08-01';

export type StripeParamValue = string | number | boolean | undefined;
export type StripeParams = Record<string, StripeParamValue | Record<string, StripeParamValue>>;

export interface StripeRequest {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  params?: StripeParams;
}

export class StripeApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'StripeApiError';
  }
}

export function encodeParams(params: StripeParams): string {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (typeof value === 'object') {
      for (const [childKey, childValue] of Object.entries(value)) {
        if (childValue !== undefined) body.set(`${key}[${childKey}]`, String(childValue));
      }
    } else {
      body.set(key, String(value));
    }
  }
  return body.toString();
}

export async function stripeRequest<T>(request: StripeRequest, apiKey = process.env.STRIPE_SECRET_KEY ?? ''): Promise<T> {
  const url = new URL(request.path, API_BASE);
  const init: RequestInit = {
    method: request.method,
    headers: {
      authorization: `Bearer ${apiKey}`,
      'stripe-version': STRIPE_API_VERSION,
      'content-type': 'application/x-www-form-urlencoded',
    },
  };
  if (request.params) {
    if (request.method === 'GET') url.search = encodeParams(request.params);
    else init.body = encodeParams(request.params);
  }
  const response = await fetch(url, init);
  const data = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    throw new StripeApiError(data.error?.message ?? `Stripe request failed with HTTP ${response.status}`, response.status);
  }
  return data;
}
