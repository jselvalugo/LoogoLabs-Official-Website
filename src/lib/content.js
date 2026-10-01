import { CITIES } from './cfl.js';
// Structured business facts that both the UI and the build-time SEO generator
// read. Keeping them here (a plain module, no JSX) means the FAQ accordion and the FAQPage schema, cannot
// drift apart — search engines and visitors are always shown the same numbers.

export const GROW_FAQ = [
  ['Do I need any tech experience?', 'None. We build everything, set everything up, and manage it for you. You get a login to see your results, and we handle the rest. If you can read a report, you’re more than qualified.'],
  ['How long until I see results?', 'Most clients see their first automated leads and review requests go out within 5–7 business days of onboarding. Real results — more leads, higher review counts, better Google rankings — typically show within 60 days.'],
  ['What kinds of businesses do you work with?', 'We specialize in Central Florida service businesses: home services (HVAC, plumbing, roofing, landscaping), healthcare and wellness (dentists, chiropractors, med spas), professional services, restaurants, and local retail.'],
  ['Is there a contract?', 'We recommend a 3-month minimum — local SEO and review growth take time to compound, and three months is when results become clear. For smaller businesses that want to test things first, we also offer month-to-month.'],
  ['What makes this different from hiring a marketing agency?', 'Most agencies charge you for strategy, meetings, and deliverables you can’t track. We build systems that run without manual effort and report on real metrics — leads, bookings, revenue — not impressions and reach.'],
  ['Do you run ads too?', 'Yes. We manage Facebook and Google Ads as part of a connected system — every ad click is tracked through to a lead and, ultimately, a sale.'],
  ['Which Central Florida cities do you serve?', 'All of Greater Orlando — including Celebration, Kissimmee, St. Cloud, Orlando, Winter Garden, Clermont, Winter Park, Lake Mary, Sanford, Altamonte Springs, Oviedo, and Apopka. Each city has its own page with the searches and neighborhoods we target there.'],
  ['What if I already have a website or CRM?', 'We work alongside existing tools or replace them depending on what you have. During our free strategy call, we’ll assess what you’re already using and tell you honestly what to keep and what to replace.'],
];

// Service area for the Central Florida landing page, used for the areaServed
// node in the LocalBusiness schema. This list is the whole geographic signal —
// see localBusinessLd() in lib/seo.js for why there is no street address.
export const SERVICE_AREA = [...CITIES.map((c) => c.name), 'Central Florida'];
