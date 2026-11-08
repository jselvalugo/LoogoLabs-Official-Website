// Central Florida city pages. One entry per city drives the page copy, the
// floating city rail, the route table in lib/seo.js, and the areaServed schema,
// so a city can never appear in one place and be missing from another.
//
// Every page carries copy written for that city (its market, its searches, its
// neighborhoods). A city page that is the hub page with the name swapped is a
// doorway page in Google's eyes; keep each entry genuinely specific.

export const CFL_BASE = '/grow';

export const CITIES = [
  {
    slug: 'celebration',
    name: 'Celebration',
    county: 'Osceola County',
    headline: 'Marketing systems for Celebration businesses that run on reputation.',
    intro:
      'Celebration is a small, tight-knit town where word of mouth decides who gets hired. Residents check Google reviews before they call, and visitors staying along the US-192 and Disney corridor search on their phones for whoever can show up today.',
    market: [
      ['Reputation is the whole game', 'In a town this size, a handful of reviews separates the business that gets the call from the one that does not. We automate the review ask after every job so your count climbs steadily.'],
      ['Two audiences, one profile', 'You serve year-round residents and short-stay visitors. Your Google Business Profile, service pages, and follow-up need to speak to both without confusing either.'],
      ['High expectations, fast answers', 'Homeowners here expect a polished, prompt response. Missed-call text-back and instant lead replies make sure nobody waits.'],
    ],
    industries: ['Home services & pool care', 'Med spas & wellness', 'Real estate & property management', 'Restaurants on Market Street', 'Dentists & family practices'],
    searches: ['pool service celebration fl', 'dentist celebration fl', 'handyman near celebration', 'med spa celebration'],
    areas: ['West Village', 'North Village', 'Artisan Park', 'Spring Lake', 'Island Village', 'Georgetown', 'Evander Square', 'Celebration Village', 'Celebration Town Center', 'Celebration Downtown'],
    nearby: ['kissimmee', 'st-cloud', 'clermont'],
    playbook: [
      [
        "Weeks 1-2: one profile for two audiences",
        "We rebuild your Google Business Profile so it speaks to year-round residents and short-stay visitors at the same time: service area set to Celebration and the US-192 corridor, the right categories, photos of real local jobs, and hours that show when you take after-hours calls."
      ],
      [
        "Weeks 3-6: a review after every job",
        "An automatic review request goes out by text after each completed job, in English or Spanish, with reply templates so every review gets an answer within a day. In a town where neighbors compare notes, your review count and your replies do most of the selling."
      ],
      [
        "Weeks 7-12: proof by village",
        "Service pages and profile posts that name the villages you actually work in, like West Village, Artisan Park and Island Village, plus missed-call text-back so a visitor who calls at 8 P.M. hears back before trying the next listing."
      ]
    ],
    faq: [
      [
        "Should a Celebration business market to residents or visitors?",
        "Usually both, but not with the same message. Residents choose on trust: reviews and how long you have been around. Visitors choose on speed: who can come today. We set up your profile and follow-up so each one sees what they need."
      ],
      [
        "Is Celebration too small for local SEO to matter?",
        "The opposite. With fewer competitors in the map results, a complete profile and a steady flow of reviews can move you up faster than in Orlando. The catch is that reputation travels fast here, good or bad, so follow-up has to be consistent."
      ],
      [
        "Do you only work with businesses on Market Street?",
        "No. Many businesses serve Celebration from somewhere nearby, like Kissimmee or the US-192 corridor. Google ranks service-area businesses by where they work, not only where their office is, and we build for that."
      ]
    ],
  },
  {
    slug: 'kissimmee',
    name: 'Kissimmee',
    county: 'Osceola County',
    headline: 'Get found first in Kissimmee — and answer before your competitor does.',
    intro:
      'Kissimmee is one of the most competitive local markets in Florida: a growing residential base, a huge vacation-rental economy along US-192, and a large bilingual community. The business that ranks in the map pack and replies first wins the job.',
    market: [
      ['Bilingual by default', 'A big share of Kissimmee searches and calls happen in Spanish. We build follow-up, review requests, and campaigns in English and Spanish so you never lose a lead to a language gap.'],
      ['Vacation rentals never sleep', 'Property managers and rental owners need HVAC, cleaning, and repairs on short notice — often at night. Automated replies capture those leads while you are off the clock.'],
      ['Crowded map pack', 'Dozens of competitors chase the same "near me" searches. A fully built-out Google Business Profile and steady review flow are how you climb.'],
    ],
    industries: ['HVAC, plumbing & roofing', 'Vacation-rental cleaning & maintenance', 'Auto repair & detailing', 'Restaurants & food trucks', 'Insurance & tax services'],
    searches: ['ac repair kissimmee', 'plomero kissimmee', 'vacation rental cleaning kissimmee', 'roofer kissimmee fl'],
    areas: ['Downtown & Broadway', 'US-192 corridor', 'Buenaventura Lakes', 'Poinciana', 'Lake Toho', 'Four Corners'],
    nearby: ['celebration', 'st-cloud', 'clermont'],
    playbook: [
      [
        "Weeks 1-2: a bilingual front door",
        "Your Google Business Profile, website forms and missed-call text-back set up in English and Spanish, so every caller gets an answer in the language they used."
      ],
      [
        "Weeks 3-6: win the map for the jobs that pay",
        "Profile categories, services and photos built around the work you want most, like AC repair, rental turnovers or roofing, with a review request after every job to climb a crowded map pack."
      ],
      [
        "Weeks 7-12: a pipeline for rental managers",
        "A separate follow-up track for vacation-rental owners and property managers, who send repeat work, with fast after-hours replies and a simple monthly check-in."
      ]
    ],
    faq: [
      [
        "Do I need Spanish marketing in Kissimmee?",
        "For most service businesses, yes. A large share of local searches and calls happen in Spanish. We write your follow-up, review requests and key pages in both languages so you never lose a lead to a language gap."
      ],
      [
        "How do I compete with dozens of businesses along US-192?",
        "By being the most complete, most reviewed and fastest-replying listing in your category. Most competitors leave their profile half-finished and answer leads hours later. Those are the gaps we close first."
      ],
      [
        "Can you help me win work from vacation-rental managers?",
        "Yes. We build a separate follow-up track for property managers and rental owners, since one manager can send work for many homes. Fast replies at night matter most to them."
      ]
    ],
  },
  {
    slug: 'st-cloud',
    name: 'St. Cloud',
    county: 'Osceola County',
    headline: 'St. Cloud is growing fast. Be the business new neighbors find first.',
    intro:
      'New subdivisions keep going up along Narcoossee Road and the east side of St. Cloud, and every new household is looking for a plumber, a dentist, a lawn crew, and a place to eat. They start with Google.',
    market: [
      ['New residents, no loyalty yet', 'People who just moved in have not picked their providers. Showing up in local results the week they arrive is how you earn them for years.'],
      ['Small-town trust', 'St. Cloud still feels like a small town. Reviews that mention neighborhoods and real jobs build the trust that turns a search into a call.'],
      ['Commuters search after hours', 'Many residents commute to Orlando and search at night. Automated replies mean their evening inquiry gets an answer in minutes, not tomorrow.'],
    ],
    industries: ['Lawn care & landscaping', 'Pest control', 'Home builders & remodelers', 'Family dentists & pediatrics', 'Local restaurants'],
    searches: ['lawn service st cloud fl', 'pest control st cloud', 'dentist st cloud fl', 'pressure washing st cloud'],
    areas: ['Downtown & lakefront', 'Narcoossee Road', 'Harmony', 'East Lake Toho', 'Canoe Creek Road', 'Kissimmee Park Road'],
    nearby: ['kissimmee', 'celebration', 'oviedo'],
    playbook: [
      [
        "Weeks 1-2: findable by new neighbors",
        "A Google Business Profile whose service area covers Narcoossee Road, Harmony and the east side, with services and photos that match what new homeowners search for first."
      ],
      [
        "Weeks 3-6: reviews that name real places",
        "A review request after every job that invites customers to mention their neighborhood and the work you did, and a reply to every review. Specific reviews build small-town trust faster than generic ones."
      ],
      [
        "Weeks 7-12: answer in the evening",
        "Missed-call text-back and instant form replies tuned for evening hours, when commuters get home and search, plus a welcome message for new-construction neighborhoods."
      ]
    ],
    faq: [
      [
        "Is St. Cloud worth targeting separately from Kissimmee?",
        "Yes. People here search for St. Cloud businesses by name, and the new neighborhoods on the east side are still choosing their providers. A profile built only for Kissimmee will not automatically show up in St. Cloud results."
      ],
      [
        "When do St. Cloud customers search?",
        "Many residents commute toward Orlando, so a lot of inquiries come in the evening. If your reply waits until morning, a competitor usually gets there first. Automated replies close that gap."
      ],
      [
        "How do I reach families moving into new subdivisions?",
        "Show up in local results the week they arrive: a complete profile, neighborhood-specific reviews and posts, and quick replies. New residents tend to stay with the first good provider they find."
      ]
    ],
  },
  {
    slug: 'clermont',
    name: 'Clermont',
    county: 'Lake County',
    headline: 'Clermont businesses: be the local name people trust in South Lake.',
    intro:
      'Clermont has grown from a citrus town into one of the fastest-growing places in Central Florida, with an active, outdoorsy population drawn to its hills and chain of lakes. Residents shop local — when they can find you.',
    market: [
      ['Growth along US-27', 'New neighborhoods south toward Four Corners and along US-27 keep adding households that need every kind of service.'],
      ['Active lifestyle market', 'Clermont is known as a training ground for cyclists and triathletes. Fitness, sports medicine, and wellness businesses have a real audience here.'],
      ['Less competition than Orlando', 'Local search is still less crowded than the metro core. A well-built profile and review system can put you on top faster.'],
    ],
    industries: ['Fitness, sports medicine & PT', 'Home services', 'Landscaping & irrigation', 'Real estate', 'Restaurants on the waterfront'],
    searches: ['physical therapy clermont fl', 'irrigation repair clermont', 'roofer clermont fl', 'gym clermont'],
    areas: ['Downtown & Waterfront Park', 'Lake Minneola', 'US-27 corridor', 'Kings Ridge', 'Minneola', 'South Lake'],
    nearby: ['celebration', 'kissimmee'],
    playbook: [
      [
        "Weeks 1-2: claim South Lake",
        "A Google Business Profile and service area built for Clermont, Minneola and the US-27 corridor, so you show up for South Lake searches instead of competing in Orlando results."
      ],
      [
        "Weeks 3-6: reviews and local posts",
        "Review requests after every job, plus profile posts and photos tied to places people here know, like the downtown waterfront and Lake Minneola, so your listing looks local, not generic."
      ],
      [
        "Weeks 7-12: follow-up for growth areas",
        "Instant replies and estimate follow-up for the newer neighborhoods along US-27 toward Four Corners, where new homeowners are still picking their providers."
      ]
    ],
    faq: [
      [
        "Is local SEO easier in Clermont than in Orlando?",
        "Usually. Fewer businesses compete for Clermont searches than for Orlando ones, so a well-built profile and steady reviews can move you up faster. You still need to keep the reviews coming, because the market is growing."
      ],
      [
        "Do you work with fitness, wellness and sports businesses?",
        "Yes. Clermont's hills and chain of lakes draw cyclists, runners and triathletes, which makes it a real market for gyms, physical therapy and sports medicine. We build reviews and follow-up that speak to that audience."
      ],
      [
        "Do you cover Minneola and the US-27 corridor too?",
        "Yes. We set your service area to the places you actually work, including Minneola and the newer neighborhoods along US-27, so you show up there and not only near downtown Clermont."
      ]
    ],
  },
  {
    slug: 'oviedo',
    name: 'Oviedo',
    county: 'Seminole County',
    headline: 'Oviedo families do their homework. Make sure they find you.',
    intro:
      'Oviedo is a family-focused suburb next to UCF, with highly rated schools and neighborhoods full of homeowners who research before they hire. Reviews and responsiveness carry a lot of weight here.',
    market: [
      ['Family decision-makers', 'Parents compare reviews carefully for pediatricians, tutors, and contractors. A steady flow of fresh reviews keeps you on their shortlist.'],
      ['The UCF effect', 'The university brings students, staff, and a rental market that needs fast-turnaround services, especially at move-in and move-out.'],
      ['Neighborhood referrals, online', 'Neighbors recommend businesses in community groups. A strong Google profile backs up every recommendation.'],
    ],
    industries: ['Pediatrics & family dentistry', 'Tutoring & enrichment', 'Home services', 'Fitness & youth sports', 'Property management'],
    searches: ['pediatric dentist oviedo', 'tutoring oviedo fl', 'hvac oviedo', 'property management near ucf'],
    areas: ['Oviedo on the Park', 'Alafaya corridor', 'Live Oak Reserve', 'Twin Rivers', 'Chuluota', 'UCF area'],
    nearby: ['st-cloud', 'kissimmee'],
    playbook: [
      [
        "Weeks 1-2: a profile families trust",
        "A complete Google Business Profile with real photos, clear services and accurate hours. Oviedo families research before they call, so gaps and stale photos cost you the shortlist."
      ],
      [
        "Weeks 3-6: a steady stream of fresh reviews",
        "Automatic review requests after every job and a reply to each one. Parents compare recent reviews closely for dentists, tutors and contractors, and a steady flow keeps you in the running."
      ],
      [
        "Weeks 7-12: plan around the UCF calendar",
        "Campaigns and reminders timed to move-in, move-out and semester starts, for property management, cleaning, repairs, moving and tutoring businesses near the Alafaya corridor."
      ]
    ],
    faq: [
      [
        "How does UCF affect marketing in Oviedo?",
        "It adds a second rhythm to the year. Move-in and move-out bring demand for cleaning, repairs, moving and property management, and semester starts bring demand for tutoring. We time campaigns and reminders to that calendar."
      ],
      [
        "Why do reviews matter so much in Oviedo?",
        "Families here research before they hire and compare reviews closely. A business with recent reviews and thoughtful replies stays on the shortlist; one with a few old reviews gets skipped."
      ],
      [
        "Do neighborhood Facebook groups still matter if I invest in SEO?",
        "Yes, they work together. Neighbors recommend businesses in community groups, and the next thing people do is look you up on Google. A strong profile backs up every recommendation."
      ]
    ],
  },
];

// City pages folded back into the hub on Nov 8, 2026. They sat at positions
// 57-99 in Search Console with no clicks, and 48 thin city pages read as a
// doorway pattern. Each slug 301s to /grow and /ai-voice (EN and /es), written
// into _redirects by scripts/generate-seo-assets.mjs. To bring a city back, add
// a full entry above (with genuinely local copy) and remove it from this list.
export const RETIRED_CITY_SLUGS = ['orlando', 'winter-garden', 'winter-park', 'lake-mary', 'sanford', 'altamonte-springs', 'apopka'];

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export const cityPath = (slug) => `${CFL_BASE}/${slug}`;

// App.jsx switches on a page key; each city gets its own so it has its own URL
// in the route table and its own pre-rendered HTML file.
export const cityPageKey = (slug) => `City:${slug}`;
export const citySlugFromPage = (page) =>
  typeof page === 'string' && page.startsWith('City:') ? page.slice(5) : null;
