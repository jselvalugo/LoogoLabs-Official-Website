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
  },
  {
    slug: 'orlando',
    headline: 'Orlando leads cost too much to send to voicemail. Answer every one.',
    intro:
      'Clicks in Orlando cost more than almost anywhere else in the region. When a paid lead calls and hits voicemail, you paid for a competitor\'s customer. An AI voice agent makes sure every call you pay for gets answered.',
    moments: [
      ['Paid calls going unanswered', 'Google Ads and Local Services calls come in all day. The agent picks up in under a second and books the job before the caller tries the next ad.'],
      ['Law firms and clinics after hours', 'Injury and urgent-care calls happen at night. The agent gathers the details, books a consult, and flags anything urgent to your team.'],
      ['Neighborhood-level callers', 'A caller from Lake Nona or Dr. Phillips wants to know you serve their area. The agent confirms coverage by neighborhood and books on the spot.'],
    ],
    calls: ['Free consultation request', 'Same-day service call', 'Insurance question', 'Quote request'],
    sample: [
      ['caller', 'Hi, I was in a car accident on I-4 yesterday and I need to talk to someone.'],
      ['agent', 'I am sorry that happened. First, are you safe and have you been seen by a doctor? I can set up a free consultation with an attorney today.'],
      ['caller', 'I am okay. Today would be great.'],
      ['agent', 'I have you down for 4 P.M. today. You will get a text with the address and what to bring.'],
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
  },
  {
    slug: 'winter-garden',
    headline: 'Winter Garden families research carefully. Make the first call feel premium.',
    intro:
      'Between Horizon West and historic Plant Street, Winter Garden homeowners compare providers closely and judge a business by how its phone is answered. An AI voice agent gives every caller a calm, professional first impression.',
    moments: [
      ['High-value project calls', 'Pool builds and outdoor living projects start with a phone call. The agent asks the right questions and books a design consult instead of a callback.'],
      ['Busy pediatric and family offices', 'Parents call during school pickup and lunch breaks. The agent books, reschedules, and answers common questions without a hold queue.'],
      ['Weekend restaurant reservations', 'Plant Street restaurants get slammed on Friday nights. The agent takes reservation and catering calls while staff focus on the dining room.'],
    ],
    calls: ['Pool design consultation', 'Pediatric appointment', 'Catering inquiry', 'HVAC maintenance plan'],
    sample: [
      ['caller', 'Hi, we are in Horizon West and want to talk about building a pool.'],
      ['agent', 'Wonderful. Do you already have a design in mind, or would you like a designer to come out and walk the yard with you?'],
      ['caller', 'A designer would be great.'],
      ['agent', 'I have Thursday at 5:30 open. I will send a text with the designer\'s name and a short questionnaire.'],
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
  },
  {
    slug: 'winter-park',
    headline: 'Winter Park clients expect a polished answer. Your AI voice agent delivers one.',
    intro:
      'Winter Park is an established, affluent market where clients choose on reputation and notice every detail, starting with how the phone is answered. A well-trained AI voice agent sounds composed, never rushed, and never puts a client on hold.',
    moments: [
      ['Boutique studios mid-service', 'Salon and spa staff cannot step away from a client to answer. The agent books appointments and answers service questions in your tone.'],
      ['Professional services after hours', 'Prospective clients of law and financial firms often call in the evening. The agent captures the details and books a consultation.'],
      ['Specialist home projects', 'Owners of historic and lakefront homes call with detailed questions. The agent gathers the specifics so your specialist calls back prepared.'],
    ],
    calls: ['Spa or salon booking', 'Estate planning consultation', 'Interior design inquiry', 'Restaurant reservation'],
    sample: [
      ['caller', 'Good evening, I would like to book a facial for Saturday if you have anything.'],
      ['agent', 'Of course. I have 11 A.M. or 2:30 P.M. with Maria. Which do you prefer?'],
      ['caller', '2:30, please.'],
      ['agent', 'Lovely. You are confirmed for Saturday at 2:30, and I will send a reminder the day before.'],
    ],
  },
  {
    slug: 'lake-mary',
    headline: 'Lake Mary professionals do not leave voicemails. They book whoever answers.',
    intro:
      'Lake Mary is full of high-income, time-starved households and office parks along I-4. Callers here want an answer and a booked time in one short call. An AI voice agent gives them exactly that, at any hour.',
    moments: [
      ['Calls squeezed between meetings', 'Professionals call on a five-minute break. The agent answers instantly and books before they get pulled back into work.'],
      ['B2B buyers along I-4', 'Office managers calling for IT support, cleaning, or catering expect a business-grade response. The agent qualifies the request and routes it to the right person.'],
      ['Med spa and clinic overflow', 'Aesthetic and specialty clinics compete hard here. The agent books consultations even when the front desk is full.'],
    ],
    calls: ['Botox consultation', 'IT support request', 'New client tax appointment', 'Cosmetic dental consult'],
    sample: [
      ['caller', 'Hi, our office in Lake Mary needs IT help, our network has been down since this morning.'],
      ['agent', 'Understood, that is urgent. How many people are affected, and is anyone able to work right now?'],
      ['caller', 'About twenty people, nobody can work.'],
      ['agent', 'I am flagging this as urgent and alerting a technician now. You will get a call back within fifteen minutes.'],
    ],
  },
  {
    slug: 'sanford',
    headline: 'Sanford businesses: catch every call from downtown to the airport.',
    intro:
      'Sanford pairs a revived historic downtown with steady home-service demand and an airport that brings in visitors every day. Many local businesses still rely on a single phone line, which means busy hours become missed calls.',
    moments: [
      ['Water damage calls at 2 A.M.', 'Restoration emergencies in older downtown homes do not wait until morning. The agent answers, gathers details, and pages your on-call crew.'],
      ['Airport travelers looking for service', 'Visitors flying into Sanford call for car repairs, rides, and quick services. The agent answers and books while they are still on the curb.'],
      ['First Street events and private parties', 'Venues and breweries get event calls during their busiest hours. The agent captures dates, guest counts, and contact details.'],
    ],
    calls: ['Water damage emergency', 'Auto repair appointment', 'Private event booking', 'Plumbing estimate'],
    sample: [
      ['caller', 'Hi, a pipe burst in our kitchen and there is water everywhere.'],
      ['agent', 'I am sorry. First, if you can, turn off the main water valve. I am alerting our on-call crew now. What is the address?'],
      ['caller', 'It is near downtown Sanford, off First Street.'],
      ['agent', 'Got it. A technician is being dispatched, and you will get a text with their arrival time.'],
    ],
  },
  {
    slug: 'altamonte-springs',
    headline: 'Altamonte Springs practices lose patients on hold. An AI voice agent ends the wait.',
    intro:
      'Altamonte Springs is a dense medical and retail hub along SR-436, where patients and customers come from across the north side of the metro. When a caller waits on hold, the practice a mile away is one tap away.',
    moments: [
      ['Medical offices with full phone queues', 'Patients calling to book or reschedule sit on hold while staff handle check-ins. The agent answers every call at once and cuts the queue to zero.'],
      ['No-shows and reschedules', 'The agent handles reschedule calls on the spot so open slots get filled instead of wasted.'],
      ['Competitors one exit away', 'With similar businesses packed along SR-436, the first business to answer wins. The agent makes sure that is you.'],
    ],
    calls: ['New patient appointment', 'Reschedule a visit', 'Barbershop walk-in check', 'Auto service quote'],
    sample: [
      ['caller', 'Hi, I need to move my dental cleaning on Thursday.'],
      ['agent', 'No problem. I can offer next Monday at 10 or Tuesday at 3. Which works better?'],
      ['caller', 'Tuesday at 3.'],
      ['agent', 'Done. Your cleaning is now Tuesday at 3 P.M., and I will text you a reminder the day before.'],
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
  },
  {
    slug: 'apopka',
    headline: 'Apopka trades are too busy to answer the phone. Let an AI voice agent take it.',
    intro:
      'Apopka\'s new neighborhoods along the Wekiva Parkway keep generating calls for landscaping, pest control, and roofing, while many established local businesses still run with a small crew and one phone.',
    moments: [
      ['Crews in the field all day', 'Landscape and roofing teams cannot answer from a ladder. The agent books estimates so the crew never loses a job to a missed call.'],
      ['New homeowners shopping around', 'Families in new developments call several companies in a row. The one that answers and books first usually wins.'],
      ['Nursery and B2B orders', 'Nurseries and suppliers get order and availability calls from contractors. The agent captures the order details and routes them to your team.'],
    ],
    calls: ['Landscape estimate', 'Pest control service', 'Roof repair', 'Wholesale plant order'],
    sample: [
      ['caller', 'Hi, we just moved near Wekiva and need someone to redo our landscaping.'],
      ['agent', 'Congratulations on the new home. I can schedule a free estimate. Is there a day this week that works?'],
      ['caller', 'Wednesday afternoon.'],
      ['agent', 'You are set for Wednesday at 3. I will text you a confirmation and our estimator\'s name.'],
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
