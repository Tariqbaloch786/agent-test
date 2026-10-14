# twilio-agent-test

A small voice and chat module on the `twilio` Node library **v3**, used as a target repository for API Update Agent. The real migration here is the v3 to v4 change of the library, as documented in its upgrade guide: `Say.ssmlEmphasis()` and `Say.ssmlBreak()` replaced by `emphasis()` and `break()`, `IpMessagingGrant` removed, `identity` required in the `AccessToken` options.

- `src/twiml.ts`: a greeting with SSML helpers on `<Say>`.
- `src/token.ts`: a chat access token built the v3 way.
- `test/`: asserts the generated TwiML and the decoded token's identity and grant count, which hold across the migration.
