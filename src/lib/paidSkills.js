// Prices for paid marketplace skills: the ONE place to change them.
//
// Used by the marketplace page (the price buyers see) and by
// netlify/functions/skill-order.js (the amount Stripe charges), so the two can
// never disagree. Change a number, merge, and the new price is live once the
// deploy finishes. Past purchases are unaffected. Discount codes are created in
// the Stripe Dashboard (Products → Coupons) and need no code change.
//
// Plain module with no imports: it is bundled into both the site and the function.
export const PAID_SKILLS = {
  'saas-launch-playbook': {
    priceUsd: 39,
    name: 'SaaS Launch Playbook — Claude skill',
    checkoutDescription:
      'Plan and run your SaaS launch with Claude: positioning, pricing, launch model, dated calendar, launch day, ads, email, scorecard and 30/60/90 review. Instant download.',
    image: '/skills/covers/saas-launch-playbook.png',
  },
  'content-engine': {
    priceUsd: 4.99,
    name: '30-Day Content Engine — Claude skill',
    checkoutDescription:
      'A full month of social content with Claude: pillars, a dated calendar, every caption, carousel, story and shot list, plus a batch-filming plan and a spreadsheet calendar. Instant download.',
    image: '/skills/covers/content-engine.png',
  },
};
