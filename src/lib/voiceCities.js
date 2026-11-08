// AI voice agent city pages (/ai-voice/<city>). Each entry reuses the city's
// name, county, and neighborhoods from lib/cfl.js and adds copy written for how
// that city's businesses actually get phone calls. One entry drives the page,
// the route table in lib/seo.js, the sitemap, and the Service schema.
//
// Same rule as the /grow pages: every city carries its own copy. A page that is
// the /ai-voice page with the city name swapped in is a doorway page in Google's
// eyes, so keep each entry genuinely specific to that market.

import { CITY_BY_SLUG } from './cfl.js';

export const VOICE_BASE = '/ai-voice';

const VOICE_COPY = [
  {
    slug: 'celebration',
    headline: 'An AI voice agent that answers Celebration calls the way your best front desk would.',
    intro:
      'In a town that runs on word of mouth, the way your phone gets answered is part of your reputation. Residents expect a polished reply, and visitors staying near the Disney corridor call whoever picks up first.',
    moments: [
      ['Visitors call on vacation time', 'Guests in nearby rentals call for pool repairs, cleanings, and urgent fixes at night and on weekends. The agent answers, books, and texts a confirmation while you are off the clock.'],
      ['A missed call becomes a story', 'In a small town, "they never called me back" spreads fast. Every caller gets a warm answer on the first ring, every time.'],
      ['Front desks stretched thin', 'Med spas and family practices on Market Street lose calls while staff check patients in. The agent takes the overflow so nobody waits on hold.'],
    ],
    calls: ['Pool service request', 'New patient booking', 'Vacation rental repair', 'Reschedule an appointment'],
    sample: [
      ['caller', 'Hi, we are staying in a rental in Celebration and the pool heater stopped working.'],
      ['agent', 'Sorry to hear that, especially on vacation. I can get a technician out. Is tomorrow morning okay, or do you need someone this evening?'],
      ['caller', 'Tomorrow morning is fine.'],
      ['agent', 'Done. You are booked for 9 to 11 A.M., and you will get a text with the technician\'s name.'],
    ],
    faq: [
      [
        "Will an AI agent sound right for Celebration customers?",
        "That is the point of setting it up carefully. We script the greeting and tone to match how your best front-desk person talks, and we review real calls in the first 30 days to fix anything that sounds off."
      ],
      [
        "Can it handle calls from vacation-rental guests?",
        "Yes. It can confirm the property address, take down the issue, book a visit and text a confirmation, so guests staying near the Disney corridor get an answer at night and on weekends."
      ]
    ],
  },
  {
    slug: 'kissimmee',
    headline: 'Kissimmee callers speak English and Spanish. Your AI voice agent should too.',
    intro:
      'Kissimmee has one of the largest bilingual communities in Central Florida and a vacation-rental economy that calls around the clock. The business that answers in the caller\'s language, at 11 P.M., gets the job.',
    moments: [
      ['Spanish-speaking callers hang up on English voicemail', 'A large share of Kissimmee calls start in Spanish. The agent greets, qualifies, and books in English or Spanish so no lead is lost to a language gap.'],
      ['Property managers need answers at night', 'AC failures and lockouts in rentals along US-192 do not wait for business hours. The agent captures the job and alerts your on-call tech.'],
      ['Ten calls at once in the summer', 'When the heat spikes, HVAC and plumbing lines flood. The agent answers every call at the same time, with no hold music.'],
    ],
    calls: ['AC no-cool emergency', 'Llamada en español', 'Rental turnover cleaning', 'Roof leak after a storm'],
    sampleLang: 'es',
    sample: [
      ['caller', 'Hola, el aire acondicionado de mi casa no está enfriando.'],
      ['agent', 'Lo siento mucho, con este calor. Le puedo agendar un técnico. ¿Le sirve mañana entre 8 y 11 de la mañana?'],
      ['caller', 'Sí, perfecto.'],
      ['agent', 'Listo. Queda agendado para mañana de 8 a 11. Le enviaré un mensaje de texto con la confirmación.'],
    ],
    faq: [
      [
        "Does the agent switch to Spanish on its own?",
        "Yes. If the caller speaks Spanish, the agent continues in Spanish, books the appointment and sends the confirmation in the same language."
      ],
      [
        "Can it keep up with a summer rush of AC calls?",
        "Yes. It answers every call at the same time, so ten callers during a heat wave all get a reply instead of a busy signal or voicemail. Urgent no-cool calls can be flagged to your on-call tech."
      ]
    ],
  },
  {
    slug: 'st-cloud',
    headline: 'St. Cloud is growing faster than your phone can keep up. Let AI answer.',
    intro:
      'New neighborhoods along Narcoossee Road mean a constant stream of first-time calls from homeowners who have not picked their providers yet. Many of them commute and call after work, when small offices are closed.',
    moments: [
      ['New homeowners call after 6 P.M.', 'Commuters get home and start calling for lawn care, pest control, and repairs. The agent answers in the evening and books the first open slot.'],
      ['Small teams on job sites', 'When the owner is on a roof or under a sink, the phone goes unanswered. The agent covers every call so you can finish the job.'],
      ['First call wins the customer', 'A new resident who reaches you first often stays for years. Answering on the first ring is the cheapest marketing you can buy.'],
    ],
    calls: ['Lawn service estimate', 'Pest control booking', 'Warranty repair question', 'Pressure washing quote'],
    sample: [
      ['caller', 'Hi, we just moved into a new house off Narcoossee and need lawn service.'],
      ['agent', 'Welcome to the neighborhood! I can set up a free estimate. Would Saturday morning work?'],
      ['caller', 'Saturday is great.'],
      ['agent', 'You are booked for Saturday at 10. I will text you a reminder Friday evening.'],
    ],
    faq: [
      [
        "Is an AI voice agent worth it for a small St. Cloud crew?",
        "It is often most useful for small teams. When the owner is on a job site, calls go unanswered. The agent covers those calls and books the work so you do not have to stop what you are doing."
      ],
      [
        "Will it answer evening calls from commuters?",
        "Yes. It works around the clock, so a homeowner calling at 7 P.M. after the drive home can book an estimate on the spot."
      ]
    ],
  },
  {
    slug: 'clermont',
    headline: 'Clermont businesses: answer every call without hiring another receptionist.',
    intro:
      'Clermont\'s growth along US-27 and its active, outdoorsy population keep phones busy for clinics, trades, and fitness businesses. Many are small teams where the owner answers the phone between jobs or sessions.',
    moments: [
      ['PT and sports medicine front desks', 'Clinics serving cyclists and athletes juggle check-ins and calls. The agent books evaluations and handles insurance questions it has been trained on.'],
      ['Irrigation and landscape season', 'Spring and summer bring a wave of calls for sprinkler repairs and yard work. The agent qualifies the job and books it while crews are out.'],
      ['Callers from Four Corners to Minneola', 'The agent confirms whether you serve the caller\'s area before booking, so your team never drives to a job outside your range.'],
    ],
    calls: ['Physical therapy evaluation', 'Sprinkler repair', 'Roof inspection', 'Gym membership question'],
    sample: [
      ['caller', 'Hi, I hurt my knee training for a triathlon and want to get it looked at.'],
      ['agent', 'Sorry to hear that. I can book a physical therapy evaluation. Do you prefer early morning or after work?'],
      ['caller', 'Early morning.'],
      ['agent', 'You are set for Tuesday at 7 A.M. I will text you the intake form now.'],
    ],
    faq: [
      [
        "Can the agent book estimates for new homes along US-27?",
        "Yes. It asks for the address and the job, checks your calendar and books the visit, so new homeowners in growing areas get a time before they call the next company."
      ],
      [
        "Does it work for clinics and fitness studios?",
        "Yes. For clinics it can book and reschedule appointments and take new-patient details; for studios it can answer schedule questions and book intro sessions. Anything medical or sensitive goes to your staff."
      ]
    ],
  },
  {
    slug: 'oviedo',
    headline: 'Oviedo parents call during pickup and practice. Answer every one.',
    intro:
      'Oviedo is a family-focused suburb next to UCF where parents call between school runs, practices, and work. They research carefully and remember which business picked up and which one sent them to voicemail.',
    moments: [
      ['Calls from the car line', 'Parents call pediatricians and tutors from the school pickup line. The agent books quickly so the call fits in a few minutes.'],
      ['UCF move-in and move-out rush', 'Property managers and service businesses near campus get a flood of calls in August and May. The agent handles the spike without extra staff.'],
      ['Youth sports and enrichment sign-ups', 'Registration questions pile up at the start of each season. The agent answers common questions and takes sign-ups around the clock.'],
    ],
    calls: ['Pediatric dental visit', 'Tutoring sign-up', 'Student rental maintenance', 'HVAC tune-up'],
    sample: [
      ['caller', 'Hi, I am looking for a math tutor for my son, he is in eighth grade.'],
      ['agent', 'Happy to help. Do you prefer sessions at your home in Oviedo or at our center, and which afternoons work best?'],
      ['caller', 'At the center, Tuesdays and Thursdays.'],
      ['agent', 'I have booked a free assessment for this Tuesday at 4:30. I will text you the details now.'],
    ],
    faq: [
      [
        "Can the agent answer the questions parents ask?",
        "Yes. We train it on your hours, services and the questions families ask most, so it can answer the common ones and book the visit. Anything it is not sure about goes to your team."
      ],
      [
        "Does it help during UCF move-in and move-out?",
        "Yes. Those weeks bring a spike of calls for cleaning, repairs and moving. The agent answers all of them at once and books what fits your calendar."
      ]
    ],
  },
];

export const VOICE_CITIES = VOICE_COPY.map((v) => {
  const base = CITY_BY_SLUG.get(v.slug);
  if (!base) throw new Error(`voiceCities: unknown city slug "${v.slug}"`);
  return { ...v, name: base.name, county: base.county, areas: base.areas, nearby: base.nearby };
});

export const VOICE_CITY_BY_SLUG = new Map(VOICE_CITIES.map((c) => [c.slug, c]));

export const voiceCityPath = (slug) => `${VOICE_BASE}/${slug}`;

// App.jsx switches on a page key; each voice city gets its own so it has its
// own URL in the route table and its own pre-rendered HTML file.
export const voiceCityPageKey = (slug) => `VoiceCity:${slug}`;
export const voiceCitySlugFromPage = (page) =>
  typeof page === 'string' && page.startsWith('VoiceCity:') ? page.slice(10) : null;
