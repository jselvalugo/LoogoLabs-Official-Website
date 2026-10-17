import React from 'react';
import { Compass, Robot, ChartLineUp, UsersThree } from '@phosphor-icons/react';
import ScrollFunnel from '../components/funnel/ScrollFunnel';

const content = {
  source: 'consulting',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  // Empty shows the founder photo.
  videoUrl: '',
  badge: 'Strategy & AI Consulting',
  h1: <>A Clear Plan For Growth, <em>And AI That Actually Saves You Time.</em></>,
  lede: 'Marketing strategy and AI consulting for owners who are done guessing. We find where your next customers come from and where AI can take work off your plate, then help you put it in place.',
  videoCaption: 'Watch: David, founder of Loogo Labs, on how we plan your growth',
  problemsEyebrow: 'Why growth stalls',
  problemsTitle: 'Most businesses are busy, not growing.',
  problems: [
    ['Marketing without a plan', "You're spending on ads, posts and tools, but nobody can say which ones bring in customers, so the budget leaks."],
    ['AI feels like hype', "Everyone says you should be using AI. Nobody shows you where it fits in your business or what it's worth."],
    ['Your team is stuck on busywork', 'Follow-ups, data entry and repeat questions eat hours every week that should go to customers and sales.'],
  ],
  deliverablesTitle: 'Strategy, AI and marketing, in one partner.',
  deliverables: [
    ['Business & Marketing Strategy', 'An audit of your channels, funnel and messaging, plus sharper positioning and a refined offer.', Compass],
    ['AI Consulting', 'An operations and workflow assessment and an AI opportunity map ranked by return, with the tools to use.', Robot],
    ['Marketing Plan & Roadmap', 'A channel plan with budget and targets, and a 90-day roadmap your team can actually run.', ChartLineUp],
    ['Implementation & Training', 'Custom AI agents and automations built for you, team training, and monthly strategy sessions to keep it on track.', UsersThree],
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
    ['Who is this for?', 'Owners and teams that want to grow on purpose: you have customers and a working business, and you want a plan and better tools to scale it.'],
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
