// Skills Marketplace catalog + preview gate.
//
// The marketplace is not public yet. The /marketplace page is unlisted (noindex,
// out of nav, sitemap and llms.txt), and the floating side button that links to
// it only shows when marketplaceEnabled() is true:
//   - on any host that isn't the production domain (localhost, Netlify deploy
//     previews, branch deploys), or
//   - on production after visiting /marketplace?preview=1 once (remembered in
//     this browser; /marketplace?preview=0 turns it off again).
// To launch: set LAUNCHED to true and drop `unlisted` from its route in seo.js.

import adCopy from '../../marketplace/skills/ad-copy-workshop/SKILL.md?raw';
import brief from '../../marketplace/skills/campaign-brief-builder/SKILL.md?raw';
import utm from '../../marketplace/skills/utm-tracking-plan/SKILL.md?raw';
import email from '../../marketplace/skills/saas-email-sequences/SKILL.md?raw';

export const LAUNCHED = false;

// Buy links for paid skills. netlify/functions/skill-order.js (?buy=) opens a branded
// Stripe Checkout (price and branding live there); after payment Stripe returns to
// /marketplace/thank-you?session_id=..., where skill-order.js verifies and delivers.
export const BUY_URLS = {
  'saas-launch-playbook': '/.netlify/functions/skill-order?buy=saas-launch-playbook',
};
const PREVIEW_KEY = 'll_marketplace_preview';
const PROD_HOSTS = ['loogolabs.com', 'www.loogolabs.com'];

/** True on localhost, Netlify deploy previews and branch deploys; false on loogolabs.com. */
export function isPreviewHost() {
  if (typeof window === 'undefined') return false;
  return !PROD_HOSTS.includes(window.location.hostname);
}

export function marketplaceEnabled() {
  if (LAUNCHED) return true;
  if (typeof window === 'undefined') return false;
  try {
    const q = new URLSearchParams(window.location.search).get('preview');
    if (q === '1') window.localStorage.setItem(PREVIEW_KEY, '1');
    if (q === '0') window.localStorage.removeItem(PREVIEW_KEY);
  } catch { /* storage blocked: fall through */ }
  if (isPreviewHost()) return true;
  try { return window.localStorage.getItem(PREVIEW_KEY) === '1'; } catch { return false; }
}

// Strip YAML frontmatter so the preview shows the instructions themselves.
const body = (md) => md.replace(/^---[\s\S]*?---\s*/, '');

export const CATEGORIES = ['All', 'Paid ads', 'Strategy', 'Tracking', 'Email'];

export const SKILLS = [
  {
    slug: 'ad-copy-workshop',
    name: 'Ad Copy Workshop',
    category: 'Paid ads',
    tier: 'free',
    icon: 'Megaphone',
    tagline: 'Platform-ready ad copy in five angles, every line counted against the limit.',
    description:
      'Give Claude a product, an offer and an audience. It writes Meta, Google Search, LinkedIn and TikTok copy in distinct angles (pain, outcome, proof, objection, curiosity), counts every character against each platform’s limit, and ends with a testing plan.',
    outputs: ['Copy per platform and angle', 'Character counts on every line', '15 RSA headlines + 4 descriptions', 'A two-angle testing plan'],
    prompt: 'Write Meta and Google ads for our 14-day free trial. Audience: agency owners drowning in client reporting.',
    source: body(adCopy),
  },
  {
    slug: 'campaign-brief-builder',
    name: 'Campaign Brief Builder',
    category: 'Strategy',
    tier: 'free',
    icon: 'ClipboardText',
    tagline: 'Messy notes in, a one-page brief your whole team can work from out.',
    description:
      'Paste call notes, an email thread or a one-line idea. Claude turns it into a one-page brief (objective, audience, key message, channels, budget, KPIs, timeline, assets and risks), marks every assumption, and lists the open questions instead of guessing.',
    outputs: ['One-page campaign brief', 'KPI table with targets', 'Phased timeline', 'Open questions to send the client'],
    prompt: 'Here are my notes from today’s kickoff call. Turn them into a campaign brief.',
    source: body(brief),
  },
  {
    slug: 'utm-tracking-plan',
    name: 'UTM & Tracking Plan',
    category: 'Tracking',
    tier: 'free',
    icon: 'LinkSimple',
    tagline: 'One naming convention, a full link sheet, and the events worth tracking.',
    description:
      'Claude sets a clean UTM convention that lands traffic in the right GA4 channel, builds every tagged link as a table and CSV, lists the conversion events the campaign needs, and gives you a QA checklist before launch.',
    outputs: ['UTM naming convention', 'Tagged link sheet (CSV)', 'Conversion events map', 'Pre-launch QA checklist'],
    prompt: 'Build the UTMs for our November launch: Meta, Google, the newsletter and two partner posts.',
    source: body(utm),
  },
  {
    slug: 'saas-email-sequences',
    name: 'SaaS Email Sequences',
    category: 'Email',
    tier: 'free',
    icon: 'EnvelopeSimple',
    tagline: 'Onboarding, trial-to-paid and win-back flows built around activation.',
    description:
      'Claude builds lifecycle sequences around the one action that makes users stick: send timing, subject and preview lines, one CTA per email, and the rule for when each email should be skipped. It finishes with a build sheet for any email tool.',
    outputs: ['5-email onboarding or trial flow', 'Subject + preview text', 'Suppression rules', 'Build sheet for your ESP'],
    prompt: 'Write a 14-day trial-to-paid sequence. Activation is connecting the first ad account.',
    source: body(email),
  },
  // Paid skills: placeholders so the paid layout can be reviewed. No download yet.
  {
    slug: 'saas-launch-playbook',
    name: 'SaaS Launch Playbook',
    category: 'Strategy',
    tier: 'paid',
    icon: 'RocketLaunch',
    price: 39,
    buyUrl: BUY_URLS['saas-launch-playbook'],
    tagline: 'Plan and run your launch with Claude, from positioning to the 90-day review.',
    description:
      'The launch process we run with clients, packaged as a skill. Claude diagnoses your launch, tells you whether your goal is reachable with your budget and team, then builds the plan: positioning, pricing, a dated calendar, launch day, ads, email and a scorecard. Every session ends with your next actions, and your progress carries over between sessions.',
    outputs: [
      'A verdict: can you hit your goal with this budget and team?',
      'Positioning, messaging and pricing decisions',
      'Launch model with an affordable cost per customer',
      'Dated launch calendar that skips holidays',
      'Launch-day runbook, ads, email and outreach plans',
      'Scorecard, weekly check-ins and a 30/60/90 review',
    ],
    inside: [
      '11 step-by-step modules, each explaining why it matters and the common mistakes',
      'Launch model and calendar calculators',
      '8 fill-in templates, including a company profile and a progress file',
      'Works on its own; pairs with the four free skills here',
    ],
    prompt: 'Use the SaaS Launch Playbook. We launch on March 10 and want 100 paying users by the end of April.',
  },
  {
    slug: 'paid-ads-audit',
    name: 'Paid Ads Audit Kit',
    category: 'Paid ads',
    tier: 'paid',
    icon: 'MagnifyingGlass',
    tagline: 'Audit a Meta or Google account like a senior media buyer would.',
    description: 'A structured audit of account structure, tracking, creative and spend, with a prioritized fix list. Coming soon.',
    outputs: ['Account health score', 'Tracking gaps', 'Wasted-spend finder', 'Prioritized fix list'],
  },
];

export const skillDownloadHref = (slug) => `/skills/${slug}.zip`;
