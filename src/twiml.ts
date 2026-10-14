import twilio from 'twilio';

/** The TwiML for the greeting an inbound caller hears, with the caller's name emphasised. */
export function greeting(name: string): string {
  const response = new twilio.twiml.VoiceResponse();
  const say = response.say({ voice: 'alice' }, 'Welcome back, ');
  say.emphasis({ level: 'strong' }, name);
  say.break({ strength: 'medium' });
  response.say({ voice: 'alice' }, 'How can we help today?');
  return response.toString();
}
