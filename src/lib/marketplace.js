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
import brandBrain from '../../marketplace/skills/brand-brain/SKILL.md?raw';
import { PAID_SKILLS } from './paidSkills.js';

export const LAUNCHED = true;

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

export const CATEGORIES = ['All', 'Brand', 'Social', 'Paid ads', 'Conversion', 'Sales', 'Local', 'Agency', 'Strategy', 'Tracking', 'Email'];

export const SKILLS = [
  // Free skills are lead magnets: each unlocks with an email (CRM email list tag = the skill's slug).
  {
    slug: 'brand-brain',
    name: 'Brand Brain',
    category: 'Brand',
    tier: 'free',
    leadMagnet: true,
    icon: 'Brain',
    tagline: 'Teach Claude your business once. Every output sounds like you after that.',
    description:
      'A five-minute guided interview (or paste your website and skip most of it). Claude captures your offer, customer, positioning, proof, voice, banned words, colors and call to action, saves it as a brand profile, and reads it before every marketing task so the first draft already sounds like your brand.',
    outputs: ['A reusable brand profile file', 'One-page positioning statement', 'Voice & tone guide with do/don’t examples', 'Three on-brand samples to check the voice'],
    prompt: 'Set up my Brand Brain. Here’s our website copy.',
    source: body(brandBrain),
  },
  {
    slug: 'ad-copy-workshop',
    name: 'Ad Copy Workshop',
    category: 'Paid ads',
    tier: 'free',
    leadMagnet: true,
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
    leadMagnet: true,
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
    leadMagnet: true,
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
    leadMagnet: true,
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
    price: PAID_SKILLS['saas-launch-playbook'].priceUsd,
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
    slug: 'content-engine',
    name: '30-Day Content Engine',
    category: 'Social',
    tier: 'paid',
    // Built and tested; goes on sale once netlify/lib/paid-skills/content-engine.enc.js is committed.
    // Then: add it back to PAID_SKILLS + BUY_URLS + skill-order CATALOG, use buyUrl, drop soon/eta.
    soon: true,
    eta: 'November 2026',
    icon: 'CalendarBlank',
    price: 4.99,
    tagline: 'A full month of posts, planned, written and ready to shoot.',
    description:
      'Claude plans 30 days of Reels, TikToks, carousels and stories around your content pillars, then writes every caption, carousel slide, story frame and shot list. One idea becomes several formats, and you get a batch-filming plan so a month of content takes one afternoon to shoot. English, Spanish or both.',
    outputs: [
      'A one-page strategy: monthly goal, pillars, weekly themes and key dates',
      'A branded Excel calendar with every post (opens in Google Sheets too)',
      'Every caption, hook and hashtag set, written in your brand voice',
      'Timed Reel/TikTok scripts with on-screen text and shot lists',
      'Carousel slide copy and story frames with stickers',
      'A batch-filming plan grouped by location and outfit',
    ],
    inside: [
      'A 7-step workflow from one round of questions to a finished month',
      'Pillar, format-mix and hook-style guides for any posting schedule',
      'An Excel calendar builder that checks pillar ratio, promo spacing, hooks and caption limits',
      'Post card, intake and filming-plan templates, plus a fully written example week',
      'Reads your free Brand Brain profile so every post sounds like you',
    ],
    prompt: 'Plan our December content. We post daily: Reels, carousels and stories.',
  },
  // Coming soon: listed with details and planned price; buyers can join the waitlist
  // (CRM email tag "waitlist-<slug>"). To launch one, build it, add it to PAID_SKILLS
  // and BUY_URLS, and remove `soon: true`.
  {
    slug: 'hook-script-lab',
    name: 'Hook & Script Lab',
    category: 'Social',
    tier: 'paid',
    soon: true,
    eta: 'December 2026',
    icon: 'FilmSlate',
    price: 4.99,
    tagline: 'Scroll-stopping hooks and timed short-form scripts in minutes.',
    description:
      'Most videos are lost in the first two seconds. Claude writes ten or more hooks per idea across proven styles, scores them and picks three to test, then writes a timed 15, 30 or 60-second script with on-screen text, B-roll cues and a call to action. Works for talking-head, faceless and UGC videos.',
    outputs: ['Hook bank with a score on every hook', 'Timed scripts with on-screen text', 'B-roll and shot cues', 'A three-hook A/B test plan'],
    prompt: 'Give me hooks and a 30-second script about why most small businesses post and get no leads.',
  },
  {
    slug: 'ad-copy-studio',
    name: 'Ad Copy Studio',
    category: 'Paid ads',
    tier: 'paid',
    soon: true,
    eta: 'January 2027',
    icon: 'PenNib',
    price: 4.99,
    tagline: 'Full ad sets for every platform, matched to your landing page.',
    description:
      'The next step up from the free Ad Copy Workshop. Claude builds complete, upload-ready ad sets for Meta, Google, TikTok and LinkedIn: three angles with five variants each, creative briefs for your designer, a check against every character limit, and flags on claims likely to get an ad rejected.',
    outputs: ['Upload-ready ad copy table', '3 angles × 5 variants', 'Creative briefs for images and video', 'Policy-risk flags before you launch'],
    prompt: 'Build a full Meta and Google ad set for our spring promo. Here’s the landing page.',
  },
  {
    slug: 'ads-performance-auditor',
    name: 'Ads Performance Auditor',
    category: 'Paid ads',
    tier: 'paid',
    soon: true,
    eta: 'January 2027',
    icon: 'ChartLineUp',
    price: 4.99,
    tagline: 'See exactly what’s wasting your ad budget, and what to fix first.',
    description:
      'Export a report from Meta or Google Ads and Claude compares two periods, explains the few changes that matter, finds wasted spend (bad search terms, tired creatives, weak audiences), checks whether your conversion tracking can be trusted, and hands you a ranked fix list. It only reads. It never changes your account.',
    outputs: ['One-page account scorecard', 'Top five findings in plain English', 'Wasted-spend finder', 'Ranked, approval-ready fix list'],
    prompt: 'Audit last month’s Google Ads export against the month before.',
  },
  {
    slug: 'landing-page-audit',
    name: 'Landing Page Conversion Audit',
    category: 'Conversion',
    tier: 'paid',
    soon: true,
    eta: 'January 2027',
    icon: 'Browser',
    price: 4.99,
    tagline: 'Turn more visitors into leads without paying for more traffic.',
    description:
      'Claude scores your page against a conversion checklist (headline clarity, offer, proof, friction, call to action, mobile layout and trust), then rewrites the weak sections and ranks A/B test ideas by likely impact. Checklists are tuned for local services, e-commerce, SaaS and coaching.',
    outputs: ['Scored page audit', 'Rewritten hero, call to action and key sections', 'Mobile and trust fixes', 'A ranked test backlog'],
    prompt: 'Audit our booking page. Lots of visits, very few calls.',
  },
  {
    slug: 'lead-follow-up',
    name: 'Lead Follow-Up Machine',
    category: 'Sales',
    tier: 'paid',
    soon: true,
    eta: 'February 2027',
    icon: 'ChatsCircle',
    price: 4.99,
    tagline: 'Never lose another lead to slow follow-up.',
    description:
      'Leads go cold within minutes. Claude writes your instant reply and full follow-up sequence (day 1, 3, 7 and 14), plus no-show recovery and re-engagement messages for email, text and DMs, personalized to where each lead came from. It also writes ready replies to the objections you hear most.',
    outputs: ['Instant-reply and nurture sequences', 'Email, text and DM versions', 'No-show and win-back messages', 'Objection-handling replies'],
    prompt: 'Write follow-ups for leads from our website quote form.',
  },
  {
    slug: 'local-reputation',
    name: 'Local Reputation Booster',
    category: 'Local',
    tier: 'paid',
    soon: true,
    eta: 'February 2027',
    icon: 'Star',
    price: 4.99,
    tagline: 'More five-star reviews and a Google profile that wins the map.',
    description:
      'Built for restaurants, distilleries, salons, contractors and clinics. Claude writes review-request messages, on-brand replies to good and bad reviews, four weeks of Google Business Profile posts, Q&A entries and an optimized description, and flags the gaps holding back your local ranking.',
    outputs: ['Review-reply library, including calm replies to bad reviews', 'Review-request texts, emails and QR card copy', 'Four weeks of profile posts', 'Local profile checklist'],
    prompt: 'Help us get more Google reviews and reply to this one-star review.',
  },
  {
    slug: 'prospect-outreach',
    name: 'Prospect & Outreach Builder',
    category: 'Sales',
    tier: 'paid',
    soon: true,
    eta: 'March 2027',
    icon: 'Crosshair',
    price: 4.99,
    tagline: 'Find the right prospects and start real conversations.',
    description:
      'Claude defines your ideal customer, researches and qualifies a prospect list from public business information, and writes a personal four-touch sequence for email, LinkedIn and DMs, each opening with something useful for that prospect. It finishes with a call opener script.',
    outputs: ['Ideal customer profile sheet', 'Qualified prospect table', 'Personal four-touch sequences', 'Call opener script'],
    prompt: 'Find 20 HVAC companies in Orlando that would fit our service and write the outreach.',
  },
  {
    slug: 'report-proposal-pro',
    name: 'Client Report & Proposal Pro',
    category: 'Agency',
    tier: 'paid',
    soon: true,
    eta: 'March 2027',
    icon: 'FileText',
    price: 4.99,
    tagline: 'Win the deal, then prove the results, in half the time.',
    description:
      'For agencies, consultants and freelancers. Claude turns discovery-call notes into a polished proposal with scope, timeline and three pricing tiers, and turns each month’s numbers into a client-ready report: wins, insights and next month’s plan in plain English, plus a summary email.',
    outputs: ['Proposal with Good / Better / Best pricing', 'Monthly client report and narrative', 'Executive summary email', 'Reusable branded templates'],
    prompt: 'Turn these call notes into a proposal for a three-month social media retainer.',
  },
];

export const skillDownloadHref = (slug) => `/skills/${slug}.zip`;
