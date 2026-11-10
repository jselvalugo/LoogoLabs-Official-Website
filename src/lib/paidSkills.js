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
  'viral-cut-studio': {
    priceUsd: 19.99,
    name: 'Viral Cut Studio — Claude skill',
    checkoutDescription:
      'Turn raw footage into finished Reels, TikToks and Shorts with Claude: cuts, hook, vertical reframing, zooms, animated captions, sound, clips from long videos, post copy, plus the Number-Hook Reel format. Instant download.',
    image: '/skills/covers/viral-cut-studio.png',
  },
};
