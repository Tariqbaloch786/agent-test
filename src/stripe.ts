import Stripe from 'stripe';

// The API version is pinned here: every request uses 2024-12-18.acacia regardless of the installed SDK.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', { apiVersion: '2024-12-18.acacia' });
