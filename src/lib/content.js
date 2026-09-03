// Structured business facts that both the UI and the build-time SEO generator
// read. Keeping them here (a plain module, no JSX) means the pricing table and
// the Product/Offer schema, or the FAQ accordion and the FAQPage schema, cannot
// drift apart — search engines and visitors are always shown the same numbers.

export const PLANS = [
  {
    name: 'Basics',
    price: 97,
    unit: 'per month',
    summary: 'CRM, email and SMS marketing, reputation management, and scheduling in one login.',
    lines: [
      'CRM & contact management',
      'Email & SMS marketing',
      '2-way text & email conversations',
      'Reputation management',
      'GMB messaging & call tracking',
      'Website & funnel builder',
      'Scheduling & calendar',
      '24/7 support',
    ],
  },
  {
    name: 'Pro',
    price: 197,
    unit: 'per month',
    featured: true,
    summary: 'Everything in Basics plus workflow automation, social scheduling, and AI content.',
    lines: [
      'Everything in Basics',
      'Unlimited funnels & websites',
      'Workflow automation builder',
      'Social media scheduler',
      '60+ AI content prompts',
      'Surveys & forms',
      'Affiliate manager',
      'Advanced reporting & analytics',
    ],
  },
  {
    name: 'Platinum',
    price: 497,
    unit: 'per month',
    summary: 'Everything in Pro plus courses, memberships, payments, and done-for-you automation.',
    lines: [
      'Everything in Pro',
      'Unlimited courses & communities',
      'Membership sites',
      'Payment & invoicing tools',
      'Branded mobile app (optional)',
      'Priority onboarding session',
      'Dedicated account manager',
      'Done-for-you automation setup',
    ],
  },
];

// Annual billing is presented as 20% off the monthly rate.
export const ANNUAL_DISCOUNT = 0.8;

export const GROW_FAQ = [
  ['Do I need any tech experience?', 'None. We build everything, set everything up, and manage it for you. You get a login to see your results, and we handle the rest. If you can read a report, you’re more than qualified.'],
  ['How long until I see results?', 'Most clients see their first automated leads and review requests go out within 5–7 business days of onboarding. Real results — more leads, higher review counts, better Google rankings — typically show within 60 days.'],
  ['What kinds of businesses do you work with?', 'We specialize in Central Florida service businesses: home services (HVAC, plumbing, roofing, landscaping), healthcare and wellness (dentists, chiropractors, med spas), professional services, restaurants, and local retail.'],
  ['Is there a contract?', 'We work month-to-month. No long-term lock-in. We keep your business because we earn it every month — not because you’re trapped in a contract.'],
  ['What makes this different from hiring a marketing agency?', 'Most agencies charge you for strategy, meetings, and deliverables you can’t track. We build systems that run without manual effort and report on real metrics — leads, bookings, revenue — not impressions and reach.'],
  ['Do you run ads too?', 'Yes, but only on our Dominate plan. We manage Facebook and Google Ads as part of a connected system — meaning every ad click is tracked through to a lead and, ultimately, a sale.'],
  ['What if I already have a website or CRM?', 'We work alongside existing tools or replace them depending on what you have. During our free strategy call, we’ll assess what you’re already using and tell you honestly what to keep and what to replace.'],
];

// Service area for the Central Florida landing page, used for the areaServed
// node in the LocalBusiness schema. This list is the whole geographic signal —
// see localBusinessLd() in lib/seo.js for why there is no street address.
export const SERVICE_AREA = [
  'Celebration', 'Kissimmee', 'Orlando', 'St. Cloud', 'Winter Garden',
  'Clermont', 'Winter Park', 'Lake Mary', 'Sanford', 'Altamonte Springs',
  'Oviedo', 'Apopka', 'Central Florida',
];
