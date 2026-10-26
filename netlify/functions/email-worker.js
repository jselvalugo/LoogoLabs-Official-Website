import { runQueue } from '../lib/crm-marketing.js';

// Sends queued marketing email (campaigns and automation steps) every 10
// minutes, within EMAIL_DAILY_LIMIT. See netlify/lib/crm-marketing.js.
export default async () => {
  try {
    console.log('email-worker', await runQueue());
  } catch (err) {
    console.error('email-worker failed', err);
  }
  return new Response(null, { status: 204 });
};

export const config = { schedule: '*/10 * * * *' };
