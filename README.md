# agent-test

Target repository for [API Update Agent](https://github.com/Tariqbaloch786/api-update-agent): a small billing module that talks to Stripe.

The situation it models is a common one: the `stripe` SDK was bumped to 18.5.0, whose default API version is 2025-08-27.basil, but the code still reads shapes that the 2025-03-31.basil release removed. `src/billing.ts` reads `subscription.current_period_start` and `current_period_end`, which Basil moved onto each subscription item, and `invoice.subscription`, which Basil moved under `invoice.parent.subscription_details`. The tests in `test/` already use the Basil shapes, so on `main` the typecheck and the tests are red on purpose. A correct migration of `src/billing.ts` makes both green.

No `apiVersion` is pinned: the installed SDK decides the version, which is what the agent's version gate reads.

Pull request #10 on this repository is an earlier, synthetic test: its changes came from a pair of hand-written spec fixtures with one change of each type, built to exercise the pipeline, and several of them never happened in Stripe's API.

```
npm ci
npm run typecheck
npm test
```
