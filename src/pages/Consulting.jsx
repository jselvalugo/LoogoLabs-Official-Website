import React from 'react';
import { Compass, Robot, ChartLineUp, UsersThree } from '@phosphor-icons/react';
import ScrollFunnel from '../components/funnel/ScrollFunnel';

const content = {
  source: 'consulting',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  // Empty shows the founder photo.
  videoUrl: '/brand-intro.mp4',
  videoPoster: '/brand-intro-poster.jpg',
  badge: 'Strategy & AI Consulting',
  callout: 'Central Florida business owners:',
  h1: <>A Clear Plan For Growth, <em>And AI That Actually Saves You Time.</em></>,
  lede: <><strong>Marketing strategy and AI consulting for small businesses</strong> that are done guessing. We find where your next customers come from and where AI can take work off your plate, <strong>then help you put it in place.</strong></>,
  // Ad-matched headlines: tag the ad's utm_content with one of these keys.
  heroVariants: {
    ai: {
      h1: <>Your Team Is Losing <em>Hours Every Week</em> To Work AI Could Do.</>,
      lede: <><strong>AI consulting for small businesses in Central Florida.</strong> We map where AI saves you time and money, build the automations, and <strong>train your team to use them.</strong></>,
    },
    strategy: {
      h1: <>Stop Guessing Which Marketing <em>Actually Brings In Customers.</em></>,
      lede: <><strong>Marketing strategy for Central Florida businesses:</strong> an audit of what's working, a channel plan with budget and targets, and <strong>a 90-day roadmap your team can run.</strong></>,
    },
    marketing: {
      h1: <>Your Marketing Should Bring In Customers, <em>Not Just Likes.</em></>,
      lede: <><strong>Marketing consulting for small businesses</strong> that want a clear plan, sharper messaging and <strong>numbers you can track.</strong></>,
    },
  },
  scarcity: 'We take on only 2 new clients a month in Central Florida.',
  stat: { value: '4 hrs 28 min', label: 'cut from one past client\'s lead response time. Faster replies mean more leads turn into customers.' },
  stickyLabel: 'Get my free strategy call',
  hooks: {
    problems: 'Be honest: do you know which marketing dollar actually brings in customers?',
    checklist: 'Quick gut check.',
    deliverables: "AI isn't hype. Using it in the wrong place is.",
    compare: "Here's what changes when there's a real plan.",
    steps: 'No 60-page report that sits in a drawer.',
    proof: "Don't take our word for it.",
  },
  checklist: {
    title: 'Does this sound like you?',
    items: [
      "I post on social media, but I don't know if it brings in customers.",
      'I spend money on ads without a clear budget or target.',
      'Leads sometimes wait hours, or days, for a reply.',
      "I know I should be using AI, but I don't know where to start.",
      'My team loses hours every week to follow-ups and data entry.',
    ],
    footer: 'If you nodded at 3 or more, a free strategy call is worth 20 minutes.',
  },
  compare: {
    title: 'Without a plan vs. with Loogo Labs.',
    cols: ['Without a plan', 'With Loogo Labs'],
    rows: [
      ['Marketing spend', 'Spread thin, results unclear', 'Budget per channel, with targets'],
      ['Lead follow-up', 'Whenever someone gets to it', 'Automated, in minutes'],
      ['AI', 'Random tools nobody uses', 'Ranked by ROI, built in, team trained'],
      ['Next 90 days', 'Reacting week to week', 'A roadmap your team runs'],
    ],
  },
  videoCaption: 'Watch: David, founder of Loogo Labs, on how we plan your growth',
  problemsEyebrow: 'Why growth stalls',
  problemsTitle: 'Most businesses are busy, not growing.',
  problems: [
    ['Marketing without a plan', <>You're spending on ads, posts and tools, but <strong>nobody can say which ones bring in customers</strong>, so the budget leaks.</>],
    ['AI feels like hype', <>Everyone says you should be using AI. <strong>Nobody shows you where it fits</strong> in your business or what it's worth.</>],
    ['Your team is stuck on busywork', <>Follow-ups, data entry and repeat questions <strong>eat hours every week</strong> that should go to customers and sales.</>],
  ],
  deliverablesTitle: 'Strategy, AI and marketing, in one partner.',
  deliverables: [
    ['Business & Marketing Strategy', <>An audit of your channels, funnel and messaging, plus <strong>clearer messaging and a stronger offer.</strong></>, Compass],
    ['AI Consulting', <>A review of how work gets done today and <strong>an AI opportunity map ranked by return</strong>, with the tools to use.</>, Robot],
    ['Marketing Plan & Roadmap', <>A channel plan with budget and targets, and <strong>a 90-day roadmap your team can actually run.</strong></>, ChartLineUp],
    ['Implementation & Training', <><strong>Custom AI agents and automations built for you</strong>, team training, and monthly strategy sessions to keep it on track.</>, UsersThree],
  ],
  stepsTitle: 'Four steps from guessing to a plan that runs.',
  steps: [
    ['Discovery call', 'We learn your business, your goals and where time and money are going today.'],
    ['Audit', 'We review your marketing, funnel and operations to find the biggest gaps and opportunities.'],
    ['Strategy & roadmap', 'You get a clear growth plan and an AI opportunity map, prioritized by impact.'],
    ['Implement', 'We help build it, train your team, and meet monthly to adjust as results come in.'],
  ],
  packages: [],
  faqs: [
    ['Who is this for?', 'Central Florida owners and teams that want to grow on purpose: you have customers and a working business, and you want a plan and better tools to scale it.'],
    ['Why only 2 clients a month?', 'Strategy work is hands-on. Capping new clients means every business gets real attention from David, not a junior account manager.'],
    ['Do I need to know anything about AI?', 'No. We explain everything in plain language and only recommend AI where it clearly saves time or money.'],
    ['Is it a one-time project or ongoing?', 'Either. Some clients want a strategy and roadmap; others keep us on monthly to implement and adjust. We scope it on the call.'],
    ['How much does it cost?', 'It depends on scope. On the call we agree what you need and give you a clear price before anything starts.'],
  ],
  signup: {
    title: "Let's map out your next stage of growth.",
    lede: 'Tell us where to reach you, then book your free 20-minute strategy call. No obligation.',
    button: 'Get My Free Strategy Call',
    doneTitle: "You're in. Pick a time for your strategy call.",
    doneLede: "Choose a 20-minute slot and we'll come prepared with first ideas for your business.",
    bookLabel: 'Book My Free Strategy Call',
    companyPlaceholder: 'Smith & Co.',
  },
};

export default function Consulting() {
  return <ScrollFunnel c={content} />;
}
