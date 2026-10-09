# agent-test

A small Express app that talks to Stripe with the **2022-08-01** API shape. It exists as a target
for [API Update Agent](https://github.com/Tariqbaloch786): the agent watches Stripe's API, finds the
lines here that a change affects, and opens a draft pull request with the fix, verified by this
repository's own CI.

What it uses from Stripe:

- `POST /v1/charges` with `source`, `destination`, `receipt_email` and `capture: true`
- `POST /v1/charges/{charge}/capture`
- `GET /v1/payment_intents/{intent}` and the `charges` list on the payment intent
- `charge.status` values `succeeded` / `pending` / `failed`, `charge.amount_captured` as a number
- `DELETE /v1/customers/{customer}/discount`

```bash
npm ci
npm run typecheck
npm test
STRIPE_SECRET_KEY=sk_test_... npm run build && npm start
```

CI (`.github/workflows/ci.yml`) runs typecheck and tests on every push to `main` and every pull request.
