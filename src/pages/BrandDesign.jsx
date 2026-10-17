import React from 'react';
import { PenNib, Palette, BookOpen, Storefront } from '@phosphor-icons/react';
import ScrollFunnel from '../components/funnel/ScrollFunnel';

const content = {
  source: 'brand_design',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  // Empty shows the founder photo.
  videoUrl: '',
  badge: 'Branding Design',
  callout: 'Central Florida business owners:',
  h1: <>A Brand That Makes You Look Like <em>The Obvious Choice.</em></>,
  lede: <><strong>Custom logo design, visual identity and brand guidelines</strong> for your business, ready to use on <strong>everything from your truck to your website.</strong></>,
  // Ad-matched headlines: tag the ad's utm_content with one of these keys.
  heroVariants: {
    logo: {
      h1: <>Your Logo Is Costing You Customers. <em>Let's Fix That.</em></>,
      lede: <><strong>Professional logo design for Central Florida businesses</strong>, plus the colors, fonts and files to <strong>use it everywhere.</strong></>,
    },
    rebrand: {
      h1: <>Your Business Grew Up. <em>Your Brand Didn't.</em></>,
      lede: <><strong>A rebrand that matches the business you've become</strong>: new logo, visual identity and brand guidelines, ready to roll out.</>,
    },
  },
  scarcity: 'We take on only 2 new clients a month in Central Florida.',
  stickyLabel: 'Get my free brand call',
  hooks: {
    problems: 'Customers size you up before they read a word.',
    checklist: 'Quick gut check.',
    deliverables: "A brand isn't just a logo.",
    compare: "Here's the difference a real brand makes.",
    steps: 'No endless back-and-forth.',
    proof: "Don't take our word for it.",
  },
  checklist: {
    title: 'Does this sound like you?',
    items: [
      'I made my logo myself, or a friend did.',
      "My truck, website and social pages don't look like the same company.",
      "I'm a little embarrassed to hand out my business card.",
      'Customers compare me with competitors who look more professional.',
      'Every flyer or post starts with guessing fonts and colors again.',
    ],
    footer: 'If you nodded at 2 or more, your brand is holding you back.',
  },
  compare: {
    title: 'DIY brand vs. a Loogo Labs brand.',
    cols: ['DIY brand', 'Loogo Labs brand'],
    rows: [
      ['First impression', 'Looks small or dated', 'Looks established and trusted'],
      ['Consistency', 'Different look everywhere', 'One look on every touchpoint'],
      ['Pricing power', 'Competing on price', 'Easier to charge what you are worth'],
      ['New designs', 'Start from zero each time', 'Brand guide makes it fast'],
    ],
  },
  videoCaption: 'Watch: David, founder of Loogo Labs, on how we build your brand',
  problemsEyebrow: 'What a weak brand costs you',
  problemsTitle: 'Customers judge your business before they ever call.',
  problems: [
    ['You look smaller than you are', <>A homemade logo and mismatched colors make customers assume you charge less, so <strong>you end up competing on price.</strong></>],
    ['Nothing matches', <>Your truck, website, Facebook page and business cards look like four different companies. <strong>People don't remember what they can't recognize.</strong></>],
    ['Every design starts from zero', <>Without a brand guide, every flyer and post means <strong>guessing at fonts and colors again</strong>, and it shows.</>],
  ],
  deliverablesTitle: 'Everything you need to look consistent everywhere.',
  deliverables: [
    ['Custom Logo', 'A primary logo plus simplified versions that work on a truck wrap, a favicon and everything in between.', PenNib],
    ['Visual Identity', 'A color palette and typography chosen to fit your market and stand apart from local competitors.', Palette],
    ['Brand Guidelines', 'One reference so your printer, web developer or new hire gets it right every time.', BookOpen],
    ['Ready-To-Use Files', 'Print and digital formats for signage, social profiles, uniforms and your website.', Storefront],
  ],
  stepsTitle: 'Four steps. You approve every one.',
  steps: [
    ['Discovery call', 'We learn your business, your customers and who you are up against.'],
    ['Concepts', 'You see distinct logo directions built around that brief.'],
    ['Refine', 'We sharpen the direction you pick until it feels right.'],
    ['Deliver', 'Final files and your brand guide, ready to use everywhere.'],
  ],
  // Branding packages from the service catalog: [name, price, tagline, [includes...], featured?].
  // The pricing section stays hidden until this has entries.
  packages: [],
  faqs: [
    ['How much does it cost?', 'Every package and its price is listed above. On the call we confirm which one fits, so you know the exact price before anything starts.'],
    ['Do I own the final logo?', 'Yes. Once the project is paid, the logo and brand files are yours to use anywhere.'],
    ['What if I already have a logo?', "We can refresh what you have or build brand guidelines around it. We'll tell you honestly on the call which makes more sense."],
    ['What do I need to get started?', 'Fill out the short form below and book a 20-minute call. Bring anything you like or dislike, and we handle the rest.'],
  ],
  signup: {
    title: "Let's build a brand that looks as good as your work.",
    lede: 'Tell us where to reach you, then book your free 20-minute brand call. No obligation.',
    button: 'Get My Free Brand Call',
    doneTitle: "You're in. Pick a time for your brand call.",
    doneLede: "Choose a 20-minute slot and we'll come prepared with ideas for your business.",
    bookLabel: 'Book My Free Brand Call',
  },
};

export default function BrandDesign() {
  return <ScrollFunnel c={content} />;
}
