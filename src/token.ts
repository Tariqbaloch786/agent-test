import twilio from 'twilio';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const API_KEY_SID = process.env.TWILIO_API_KEY_SID ?? 'SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET ?? 'placeholder-secret-placeholder-secret';

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

/** A short-lived token that lets one chat user join the given messaging service. */
export function chatToken(identity: string, serviceSid: string, ttlSeconds = 3600): string {
  const token = new AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET, { ttl: ttlSeconds });
  token.identity = identity;
  token.addGrant(new ChatGrant({ serviceSid }));
  return token.toJwt();
}

/** The identity and grant names inside a token (no signature check; for display and tests only). */
export function describeToken(jwt: string): { identity: string | null; grants: string[] } {
  const payload = jwt.split('.')[1] ?? '';
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { grants?: Record<string, unknown> };
  const grants = decoded.grants ?? {};
  const identity = typeof grants.identity === 'string' ? grants.identity : null;
  return { identity, grants: Object.keys(grants).filter((key) => key !== 'identity') };
}
