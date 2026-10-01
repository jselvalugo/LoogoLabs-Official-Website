// Fixed-price, one-time packages rendered by pages/ServicePackage.jsx.
// Keep copy honest: describe deliverables, never promise rankings or review counts.
export const SERVICE_PACKAGES = [
  {
    page: 'GBPMakeover',
    path: '/packages/google-business-profile',
    badge: 'Google Business Profile makeover',
    cardTitle: 'Google Business Profile Makeover',
    from: 'From $299',
    headline: 'Turn your Google profile into your best salesperson.',
    accent: 'From $299.',
    summary: 'Your Google Business Profile is often the first thing customers see. We rebuild it end to end so it looks complete, trustworthy, and ready to win the call.',
    cardDescription: 'Full profile optimization, categories, services, edited photos, seeded Q&A, a month of posts, and a before/after ranking snapshot.',
    metaTitle: 'Google Business Profile Optimization',
    metaDescription: 'Done-for-you Google Business Profile makeover: categories, services, photos, Q&A, four weeks of posts, and a before/after ranking snapshot. From $299.',
    turnaround: 'Live in 7 days',
    tiers: [
      {
        name: 'Makeover',
        price: '$299',
        items: ['Full profile optimization', 'Primary & secondary categories', 'Services & descriptions written', 'Q&A seeded with real customer questions', 'Before/after ranking snapshot'],
      },
      {
        name: 'Makeover + Content',
        price: '$499',
        featured: true,
        items: ['Everything in Makeover', '10 photos edited & uploaded', '4 weeks of Google posts written & scheduled'],
      },
    ],
    steps: [
      ['Grant access', 'Add us as a manager on your profile — we send simple instructions.'],
      ['Baseline snapshot', 'We record where you rank today in the areas you serve.'],
      ['Rebuild', 'Categories, services, description, photos, Q&A, and posts — done for you.'],
      ['After snapshot', 'We re-check your rankings and send the before/after report.'],
    ],
    needs: ['Manager access to your Google Business Profile', 'Your list of services and service areas', 'Up to 10 photos (for Makeover + Content)'],
    faq: [
      ['Do you guarantee I will rank #1?', 'No one honestly can. We fix everything that is in your control and show you the before/after so you can see what changed.'],
      ['I don\'t have a profile yet — can you help?', 'Yes. We can create and verify it with you; verification timing is set by Google.'],
      ['Will you change my business name?', 'No. We use your real business name exactly as it appears on your signage — keyword stuffing can get a profile suspended.'],
    ],
  },
  {
    page: 'ReviewKickstart',
    path: '/packages/review-kickstart',
    badge: 'Review Kickstart',
    cardTitle: 'Review Kickstart',
    from: '$399',
    headline: 'Wake up the happy customers you already have.',
    accent: '$399, done in 14 days.',
    summary: 'Most businesses have hundreds of satisfied past customers who were never asked for a review. We ask them for you — by text and email — and set you up to keep the reviews coming.',
    cardDescription: 'We import your past customers, run a one-time SMS & email review campaign, and hand over reply templates and a QR review card. Delivered in 14 days.',
    metaTitle: 'Review Kickstart — Review Campaign for Past Customers',
    metaDescription: 'A one-time SMS and email review campaign to your past customers, plus reply templates and a QR review card design. $399, delivered in 14 days.',
    turnaround: 'Delivered in 14 days',
    tiers: [
      {
        name: 'Review Kickstart',
        price: '$399',
        featured: true,
        items: ['Import & clean your past customer list', 'One-time SMS & email review campaign', 'Review reply templates (positive & negative)', 'QR review card design, print-ready', 'Results summary at day 14'],
      },
    ],
    steps: [
      ['Send your list', 'A spreadsheet or CRM export of past customers — we tidy it up.'],
      ['Approve the message', 'We write the text and email; nothing sends until you sign off.'],
      ['Campaign runs', 'Requests go out by SMS and email, with a polite follow-up.'],
      ['Wrap-up', 'You get the results summary, reply templates, and your QR card.'],
    ],
    needs: ['A list of past customers (name plus phone and/or email)', 'Your Google review link (or we find it)', 'Your logo for the QR card'],
    faq: [
      ['Is this allowed by Google?', 'Yes. We ask every customer for honest feedback — we never offer incentives or filter out unhappy customers, both of which break Google\'s rules.'],
      ['How many reviews will I get?', 'It depends on your list size and how customers feel about you, so we don\'t promise a number. You see exactly who was asked and the results.'],
      ['Do my customers need to have opted in?', 'You should only send us customers you have a business relationship with and permission to contact. Every message includes an opt-out.'],
    ],
  },
  {
    page: 'CityPages',
    path: '/packages/city-pages',
    badge: 'City Page Pack',
    cardTitle: 'City Page Pack',
    from: 'From $499',
    headline: 'Show up in every city you serve.',
    accent: '5 pages for $499.',
    summary: 'Customers search “service + city.” If your site only has one page about one town, you are invisible everywhere else. We write and publish genuinely local city/service pages for your site.',
    cardDescription: '5 or 10 SEO city/service pages, written for your service areas and published on your site.',
    metaTitle: 'City Page Pack — Local SEO City & Service Pages',
    metaDescription: 'Five or ten SEO city/service pages written and published on your website for the areas you serve. $499 for 5, $899 for 10.',
    turnaround: 'Published in 10–14 days',
    tiers: [
      {
        name: '5 pages',
        price: '$499',
        items: ['5 city/service pages written', 'Local details for each area', 'Titles, meta & internal links set', 'Published on your site'],
      },
      {
        name: '10 pages',
        price: '$899',
        featured: true,
        items: ['10 city/service pages written', 'Everything in the 5-page pack', 'Best value per page'],
      },
    ],
    steps: [
      ['Pick your areas', 'Tell us the cities and services that matter most to you.'],
      ['We research & write', 'Each page is written for that area — no copy-paste with the city swapped.'],
      ['You review', 'You approve every page before it goes live.'],
      ['We publish', 'Pages go live on your site with titles, meta, and internal links set.'],
    ],
    needs: ['Your list of target cities and services', 'Access to your website (or your web person\'s contact)', 'Any local job photos or project examples you have'],
    faq: [
      ['Which website platforms do you work with?', 'WordPress, Wix, Squarespace, Webflow, GoDaddy, and most others. If we can\'t publish directly, we send ready-to-paste pages.'],
      ['Are these the same page with the city name changed?', 'No. Thin duplicate pages can hurt you. Each page is written around that area and the work you do there.'],
      ['How soon will they rank?', 'Search engines need time to find and trust new pages, typically weeks to a few months. We don\'t promise specific rankings.'],
    ],
  },
];

export const SERVICE_PACKAGE_BY_PAGE = Object.fromEntries(SERVICE_PACKAGES.map((p) => [p.page, p]));
