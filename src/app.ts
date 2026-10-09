import express, { type Request, type Response } from 'express';
import {
  captureCharge,
  capturedTotal,
  createCharge,
  getPaymentIntent,
  hasPendingCharge,
  isPaymentSettled,
  removeCustomerDiscount,
} from './billing.js';
import { StripeApiError } from './stripe/client.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post('/charges', async (req: Request, res: Response) => {
    const { amountCents, currency, source, receiptEmail, destinationAccount } = req.body as Record<string, unknown>;
    if (typeof amountCents !== 'number' || typeof currency !== 'string' || typeof source !== 'string') {
      res.status(400).json({ error: 'amountCents, currency and source are required' });
      return;
    }
    const charge = await createCharge({
      amountCents,
      currency,
      source,
      receiptEmail: typeof receiptEmail === 'string' ? receiptEmail : undefined,
      destinationAccount: typeof destinationAccount === 'string' ? destinationAccount : undefined,
    });
    res.status(201).json({ id: charge.id, status: charge.status, captured: capturedTotal([charge]) });
  });

  app.post('/charges/:id/capture', async (req: Request, res: Response) => {
    const charge = await captureCharge(String(req.params.id));
    res.json({ id: charge.id, status: charge.status });
  });

  app.get('/payment-intents/:id/status', async (req: Request, res: Response) => {
    const intent = await getPaymentIntent(String(req.params.id));
    res.json({ id: intent.id, settled: isPaymentSettled(intent), pending: hasPendingCharge(intent) });
  });

  app.delete('/customers/:id/discount', async (req: Request, res: Response) => {
    await removeCustomerDiscount(String(req.params.id));
    res.status(204).end();
  });

  app.use((error: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
    if (error instanceof StripeApiError) {
      res.status(502).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'internal error' });
  });

  return app;
}
