import { trackSchedule } from './metaEvents';
import { gaBookCall } from './attribution';

export const BOOKING_URL = 'https://calendar.app.google/5hRpcMfH2xUPNmvv9';

// Every "Book a call" button goes through here, so each one reports Schedule
// to Meta (pixel + Conversions API). Callers that already report a different
// event for the same click (the package pages send InitiateCheckout) pass
// { schedule: false }. React passes the click event as the first argument when
// this is used directly as onClick, so anything that is not a plain options
// object is ignored.
export function openBooking(opts) {
  const o = opts && typeof opts === 'object' && !('nativeEvent' in opts) && !('target' in opts) ? opts : {};
  if (o.schedule !== false) trackSchedule(o.content_name ? { content_name: o.content_name } : undefined);
  else gaBookCall();
  window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
}
