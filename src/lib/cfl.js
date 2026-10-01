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
    nearby: ['kissimmee', 'orlando', 'st-cloud'],
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
    nearby: ['celebration', 'st-cloud', 'orlando'],
  },
  {
    slug: 'orlando',
    name: 'Orlando',
    county: 'Orange County',
    headline: 'Orlando is crowded. Own your neighborhood instead of chasing the whole city.',
    intro:
      'Ranking for "Orlando" alone is a fight with national brands and big-budget agencies. Local businesses win by owning their part of town — Lake Nona, Dr. Phillips, Baldwin Park, College Park — and by following up with every lead faster than anyone else.',
    market: [
      ['Neighborhood-level SEO', 'Buyers search by area. We build service-area pages and profile signals around the neighborhoods you actually serve, so you show up where you can win.'],
      ['Ad spend gets expensive fast', 'Clicks in Orlando cost more than in the suburbs. Every paid lead needs an instant reply and a follow-up sequence, or you are paying for leads you never talk to.'],
      ['Fast-growing south and east', 'Lake Nona and the east side keep adding households. Being visible early, before the market fills up, is the cheapest it will ever be.'],
    ],
    industries: ['Law firms & professional services', 'Dentists, chiropractors & clinics', 'Home services', 'Fitness studios & gyms', 'Salons & barbershops'],
    searches: ['personal injury lawyer orlando', 'dentist lake nona', 'electrician dr phillips', 'gym college park orlando'],
    areas: ['Downtown', 'Lake Nona', 'Dr. Phillips', 'Baldwin Park', 'College Park', 'Conway & MetroWest'],
    nearby: ['winter-park', 'kissimmee', 'winter-garden'],
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
    nearby: ['kissimmee', 'celebration', 'orlando'],
  },
  {
    slug: 'winter-garden',
    name: 'Winter Garden',
    county: 'Orange County',
    headline: 'Winter Garden businesses: turn West Orange growth into booked work.',
    intro:
      'Between historic Plant Street and the new communities of Horizon West, Winter Garden has become one of the most sought-after places to live in the region. Families here research carefully, read reviews, and expect a fast, professional reply.',
    market: [
      ['Horizon West is still filling in', 'Thousands of new homes mean a steady stream of first-time searches for services. Map-pack visibility in these communities pays off for years.'],
      ['Downtown draws the weekend crowd', 'Plant Street restaurants and shops compete for visitors from across West Orange. Email and SMS campaigns bring past customers back between visits.'],
      ['Premium, review-driven buyers', 'Homeowners here pay for quality and choose based on reviews. A steady review engine is the best marketing you can buy.'],
    ],
    industries: ['Pool builders & outdoor living', 'Pediatric & family health', 'Restaurants & breweries', 'Home services', 'Boutique fitness'],
    searches: ['pool builder winter garden', 'pediatric dentist horizon west', 'restaurants plant street', 'hvac winter garden fl'],
    areas: ['Historic Downtown & Plant Street', 'Horizon West', 'Hamlin', 'Oakland', 'Lake Apopka shore', 'West Orange Trail'],
    nearby: ['clermont', 'orlando', 'apopka'],
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
    nearby: ['winter-garden', 'orlando', 'kissimmee'],
  },
  {
    slug: 'winter-park',
    name: 'Winter Park',
    county: 'Orange County',
    headline: 'Winter Park buyers expect polish. Your marketing should deliver it.',
    intro:
      'Winter Park is an established, affluent market anchored by Park Avenue and Rollins College. Clients here compare carefully, value reputation over price, and notice when a business responds quickly and professionally.',
    market: [
      ['Reputation over price', 'Winter Park clients pay for the provider they trust. A strong, current review profile is what earns the premium.'],
      ['Boutique competition', 'Park Avenue and Hannibal Square are full of independent boutiques, salons, and studios. Email and SMS keep your regulars coming back instead of trying someone new.'],
      ['Older homes, specialized work', 'Historic and lakefront homes need specialists. We target the specific searches homeowners use for that kind of work.'],
    ],
    industries: ['Boutiques & retail', 'Salons, spas & aesthetics', 'Financial & legal services', 'Interior design & remodeling', 'Fine dining'],
    searches: ['med spa winter park', 'interior designer winter park fl', 'estate planning attorney winter park', 'salon park avenue'],
    areas: ['Park Avenue', 'Hannibal Square', 'Winter Park Village', 'Aloma', 'Lakes Virginia, Osceola & Maitland', 'Maitland'],
    nearby: ['orlando', 'altamonte-springs', 'oviedo'],
  },
  {
    slug: 'lake-mary',
    name: 'Lake Mary',
    county: 'Seminole County',
    headline: 'Lake Mary businesses: reach busy professionals the moment they search.',
    intro:
      'Lake Mary is Central Florida\'s corporate suburb — regional offices along I-4, established neighborhoods like Heathrow, and households with high incomes and very little free time. They book online, and they book whoever answers first.',
    market: [
      ['Time-starved, high-value clients', 'Professionals here want to book without a phone call. Online booking, instant replies, and reminders make you the easy choice.'],
      ['B2B is local too', 'The office parks along I-4 need IT, cleaning, catering, and professional services. We build follow-up that works for business buyers, not just homeowners.'],
      ['Health and wellness demand', 'Med spas, dentists, and specialty clinics compete hard here. Reviews and fast follow-up decide who fills the calendar.'],
    ],
    industries: ['Med spas & aesthetics', 'Dentists & specialty clinics', 'IT & B2B services', 'Financial advisors & CPAs', 'Home services'],
    searches: ['med spa lake mary', 'cosmetic dentist lake mary fl', 'it support lake mary', 'cpa lake mary'],
    areas: ['Colonial TownPark', 'Heathrow', 'Timacuan', 'Lake Mary Blvd', 'Primera', 'I-4 office corridor'],
    nearby: ['sanford', 'altamonte-springs', 'oviedo'],
  },
  {
    slug: 'sanford',
    name: 'Sanford',
    county: 'Seminole County',
    headline: 'Sanford is on the rise. Make sure customers can find you on the way.',
    intro:
      'Sanford pairs a revitalized historic downtown on Lake Monroe with steady residential growth and an airport that brings in visitors every day. It is a market where local businesses can still claim the top spot in search.',
    market: [
      ['Downtown revival', 'First Street and the riverfront draw a growing crowd to restaurants, breweries, and shops. Campaigns that bring locals back are worth more than one-time foot traffic.'],
      ['Room to rank', 'Compared with Orlando, fewer local businesses here have a fully built-out Google profile. That is an opening.'],
      ['Steady home-service demand', 'Older housing stock near downtown and newer subdivisions to the west both need constant repair and upgrade work.'],
    ],
    industries: ['Restaurants & breweries', 'Home services & restoration', 'Auto repair', 'Contractors & trades', 'Event venues'],
    searches: ['restaurants downtown sanford', 'water damage restoration sanford fl', 'auto repair sanford', 'plumber sanford fl'],
    areas: ['Historic Downtown & First Street', 'Lake Monroe riverfront', 'Midway', 'Lake Forest', 'Sanford airport area', 'West Sanford'],
    nearby: ['lake-mary', 'oviedo', 'altamonte-springs'],
  },
  {
    slug: 'altamonte-springs',
    name: 'Altamonte Springs',
    county: 'Seminole County',
    headline: 'Altamonte Springs: win the searches happening all along SR-436.',
    intro:
      'Altamonte Springs is a dense retail and medical hub where shoppers and patients come from all over the north side of the metro. Plenty of businesses compete for the same customers — the ones with a system win.',
    market: [
      ['Medical hub', 'Hospitals and medical offices cluster here, and patients pick providers by reviews and availability. Online booking and reminders cut no-shows.'],
      ['Retail traffic, not loyalty', 'People pass through for shopping and dining. Capturing their contact info and following up turns a one-time visit into a regular.'],
      ['Dense competition', 'Many similar businesses sit within a mile of each other. The map pack, not the sign out front, decides who gets the call.'],
    ],
    industries: ['Medical & dental practices', 'Retail & dining', 'Salons & barbers', 'Auto services', 'Professional services'],
    searches: ['urgent care altamonte springs', 'dentist altamonte springs', 'barber altamonte', 'auto repair sr 436'],
    areas: ['Cranes Roost & Uptown Altamonte', 'SR-436 corridor', 'Spring Valley', 'Forest City', 'Longwood', 'Casselberry'],
    nearby: ['winter-park', 'lake-mary', 'apopka'],
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
    nearby: ['winter-park', 'sanford', 'orlando'],
  },
  {
    slug: 'apopka',
    name: 'Apopka',
    county: 'Orange County',
    headline: 'Apopka is booming. Capture the new homeowners before anyone else does.',
    intro:
      'Once known as the Indoor Foliage Capital of the World, Apopka is now one of the fastest-growing cities in Orange County. New neighborhoods along the Wekiva Parkway mean new homeowners searching for every service.',
    market: [
      ['New homes, new searches', 'Families moving into new developments need landscapers, pest control, and home services right away — and they search for them by city.'],
      ['Nursery and trades roots', 'Apopka has deep roots in nurseries and trades. Local B2B and contractor businesses benefit from a professional online presence that matches their experience.'],
      ['Under-served local search', 'Many established Apopka businesses still rely on word of mouth alone. A modern system puts you ahead quickly.'],
    ],
    industries: ['Landscaping & nurseries', 'Pest control & lawn care', 'Contractors & trades', 'Auto repair', 'Family health'],
    searches: ['landscaping apopka', 'pest control apopka fl', 'roofing apopka', 'dentist apopka'],
    areas: ['Downtown Apopka', 'Wekiva Springs', 'Errol Estate', 'Rock Springs', 'Kelly Park area', 'Wekiva Parkway'],
    nearby: ['winter-garden', 'altamonte-springs', 'orlando'],
  },
];

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export const cityPath = (slug) => `${CFL_BASE}/${slug}`;

// App.jsx switches on a page key; each city gets its own so it has its own URL
// in the route table and its own pre-rendered HTML file.
export const cityPageKey = (slug) => `City:${slug}`;
export const citySlugFromPage = (page) =>
  typeof page === 'string' && page.startsWith('City:') ? page.slice(5) : null;
