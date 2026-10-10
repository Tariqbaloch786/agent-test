import Stripe from 'stripe';

// No apiVersion is pinned: the installed SDK release decides which API version requests use.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder');
