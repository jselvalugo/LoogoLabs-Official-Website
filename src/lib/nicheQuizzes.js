// The five niche fit checks. Each one is plain data rendered by
// pages/NicheQuiz.jsx, routed via lib/seo.js, listed on /quizzes, and labelled
// in the admin Leads and Analytics views — add a quiz here and it shows up in
// all of those places.
//
// Answers map onto the existing leads columns so admin reporting works
// unchanged: `business_type`, `missed_calls` (volume), `pain_point` and
// `decision_maker`. Anything else a quiz asks lands in the lead's notes.

export const DECISION_YES = "Yes, that's me";
export const DECISION_NO = "No, I'd need to check with someone";

const decision = {
  key: 'decision_maker',
  question: 'Are you the owner, or the person who decides on tools like this?',
  options: [DECISION_YES, DECISION_NO],
};

export const NICHE_QUIZZES = [
  {
    page: 'QuizHomeServices',
    source: 'quiz_home_services',
    path: '/quizzes/home-services',
    label: 'Home Services Missed-Call Check',
    product: 'Missed-call text-back',
    headline: 'Every missed call is a job your competitor books.',
    lede: 'For HVAC, plumbing, electrical, roofing and pool pros. Find out how many jobs slip away while your crew is on a ladder.',
    description: 'For HVAC, plumbing, roofing and pool pros: find out how many jobs you lose to missed calls and slow call-backs.',
    questions: [
      { key: 'business_type', question: 'What kind of home service do you run?',
        options: ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Pool & landscaping', 'Something else'] },
      { key: 'missed_calls', question: 'Roughly how many calls go unanswered in a typical week?',
        options: ['0–5', '6–15', '16–30', '30+', 'No idea, honestly'] },
      { key: 'pain_point', question: 'What happens to a missed call today?',
        options: ['We call back when we can', 'It goes to voicemail and usually dies', 'Someone in the office handles it', 'We have no system'] },
      decision,
    ],
    result: 'Missed-call text-back replies within seconds, so the customer waits for you instead of calling the next company.',
  },
  {
    page: 'QuizDental',
    source: 'quiz_dental',
    path: '/quizzes/dental',
    label: 'Dental & Med Spa No-Show Check',
    product: 'Appointment reminders & recall',
    headline: 'Empty chairs are the most expensive thing in your practice.',
    lede: 'For dental offices, med spas and clinics. See how much no-shows and overdue recalls are really costing you.',
    description: 'For dental offices, med spas and clinics: see how much no-shows and overdue recall patients are costing you.',
    questions: [
      { key: 'business_type', question: 'What type of practice do you run?',
        options: ['General dentistry', 'Orthodontics / specialty dental', 'Med spa', 'Chiropractic / physical therapy', 'Something else'] },
      { key: 'missed_calls', question: 'How many no-shows or late cancels in a typical week?',
        options: ['0–2', '3–5', '6–10', '10+'] },
      { key: 'pain_point', question: "What's hurting the schedule most?",
        options: ['No-shows and last-minute cancels', 'Patients overdue for recall', 'Front desk too busy to confirm', 'New patient inquiries going cold'] },
      decision,
    ],
    result: 'Automated confirmations, reminders and recall texts keep the schedule full without adding work to the front desk.',
  },
  {
    page: 'QuizSalon',
    source: 'quiz_salon',
    path: '/quizzes/salon-spa',
    label: 'Salon & Spa Rebooking Check',
    product: 'Rebooking & win-back automation',
    headline: 'Your best clients are one forgotten rebook away from someone else.',
    lede: 'For salons, barbershops, nail studios and spas. Find out how many regulars quietly drift away each month.',
    description: 'For salons, barbershops, nail studios and spas: find out how many regulars drift away without a rebooking system.',
    questions: [
      { key: 'business_type', question: 'What kind of studio do you run?',
        options: ['Hair salon', 'Barbershop', 'Nail studio', 'Day spa / massage', 'Lashes, brows & esthetics'] },
      { key: 'missed_calls', question: 'How many appointments do you book in a typical week?',
        options: ['Under 25', '25–60', '61–120', '120+'] },
      { key: 'pain_point', question: "What's the biggest gap right now?",
        options: ["Clients don't rebook before leaving", 'Gaps and last-minute openings', 'Regulars going quiet', 'Not enough reviews or referrals'] },
      decision,
    ],
    result: 'Rebooking nudges, gap-filling texts and win-back messages bring regulars back on schedule automatically.',
  },
  {
    page: 'QuizRealEstate',
    source: 'quiz_real_estate',
    path: '/quizzes/real-estate',
    label: 'Real Estate Lead Response Check',
    product: 'Speed-to-lead follow-up',
    headline: 'The agent who answers first usually gets the listing.',
    lede: 'For agents, teams and brokerages. See how fast your leads actually hear back, and how many never do.',
    description: 'For agents, teams and brokerages: see how fast your leads hear back and how many fall through without follow-up.',
    questions: [
      { key: 'business_type', question: 'Which best describes you?',
        options: ['Solo agent', 'Team lead', 'Brokerage', 'Property management', 'Mortgage / title'] },
      { key: 'missed_calls', question: 'How many new leads come in per week?',
        options: ['Under 5', '5–15', '16–40', '40+'] },
      { key: 'pain_point', question: 'Where do leads fall through?',
        options: ['Slow first response', 'No long-term nurture', 'Leads spread across too many apps', 'Past clients never hear from us'] },
      decision,
    ],
    result: 'Instant first replies and long-term nurture texts keep every lead warm until they are ready to move.',
  },
  {
    page: 'QuizVacationRental',
    source: 'quiz_vacation_rental',
    path: '/quizzes/vacation-rental',
    label: 'Vacation Rental Direct Booking Check',
    product: 'Guest messaging & direct bookings',
    headline: 'Stop paying platform fees on guests who already love you.',
    lede: 'For short-term rental hosts and managers around Orlando, Kissimmee and Celebration. See how many repeat guests you could book direct.',
    description: 'For short-term rental hosts and managers in Central Florida: see how many repeat guests you could book direct.',
    questions: [
      { key: 'business_type', question: 'How many properties do you manage?',
        options: ['1 property', '2–5 properties', '6–20 properties', '20+ properties'] },
      { key: 'missed_calls', question: 'How many guest check-ins in a typical month?',
        options: ['Under 5', '5–15', '16–40', '40+'] },
      { key: 'pain_point', question: "What's eating the most time or money?",
        options: ['Platform fees on every booking', 'Answering the same guest questions', 'Past guests never rebook direct', 'Getting enough 5-star reviews'] },
      decision,
    ],
    result: 'Automated guest messaging handles the questions, collects reviews and invites past guests to book direct next time.',
  },
];

export const NICHE_BY_PAGE = Object.fromEntries(NICHE_QUIZZES.map((q) => [q.page, q]));
export const NICHE_SOURCE_PAGES = Object.fromEntries(NICHE_QUIZZES.map((q) => [q.source, q.page]));
export const NICHE_SOURCE_LABELS = Object.fromEntries(NICHE_QUIZZES.map((q) => [q.source, q.label]));
