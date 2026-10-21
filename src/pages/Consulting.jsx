import React from 'react';
import { Compass, Robot, ChartLineUp, UsersThree } from '@phosphor-icons/react';
import ScrollFunnel from '../components/funnel/ScrollFunnel';

const content = {
  source: 'consulting',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  // Empty shows the founder photo.
  videoUrl: '/brand-intro.mp4',
  videoPoster: '/brand-intro-poster.jpg',
  minimal: true,
  badge: 'Strategy & AI Consulting',
  h1: <>Grow on purpose. <em>Let AI do the busywork.</em></>,
  lede: 'Marketing strategy and AI for Central Florida small businesses.',
  heroVariants: {
    ai: { h1: <>Win back <em>hours every week</em> with AI.</>, lede: 'We find where AI fits, build it, and train your team.' },
    strategy: { h1: <>Know which marketing <em>brings in customers.</em></>, lede: 'A clear plan, a budget, and a 90-day roadmap.' },
    marketing: { h1: <>Marketing that brings in <em>customers, not likes.</em></>, lede: 'Clear plan, sharper message, numbers you can track.' },
  },
  scarcity: 'Only 2 new clients a month.',
  stickyLabel: 'Book a free call',
  deliverablesTitle: 'What we do.',
  deliverables: [
    ['Strategy', 'Audit, messaging and offer.', Compass],
    ['AI', 'Where AI saves you time, ranked by return.', Robot],
    ['Roadmap', 'Budget, targets and a 90-day plan.', ChartLineUp],
    ['Implementation', 'We build it and train your team.', UsersThree],
  ],
  stepsTitle: 'How it works.',
  steps: [
    ['Free call', '20 minutes on your goals.'],
    ['Plan', 'Audit and a clear roadmap.'],
    ['Build', 'We put it in place with you.'],
  ],
  packages: [],
  faqs: [
    ['Who is this for?', 'Established local businesses ready to grow on purpose.'],
    ['Do I need to know AI?', 'No. We keep it plain and practical.'],
    ['How much does it cost?', 'Depends on scope. You get a clear price before anything starts.'],
  ],
  signup: {
    title: "Let's talk.",
    lede: 'Free 20-minute call. No obligation.',
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
