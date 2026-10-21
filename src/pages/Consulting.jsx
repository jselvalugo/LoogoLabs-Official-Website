import React from 'react';
import { Compass, Robot, UsersThree, ArrowDown } from '@phosphor-icons/react';
import { FounderVideo, SignupForm, fire, fireCustom, pickVariant } from '../components/funnel/ScrollFunnel';
import { openBooking } from '../lib/booking';
import { useHref } from '../lib/i18n';
import '../styles/pages/landing.css';
import '../styles/pages/brand-design.css';
import '../styles/pages/consulting.css';

const content = {
  source: 'consulting',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  videoUrl: '/brand-intro.mp4',
  videoPoster: '/brand-intro-poster.jpg',
  h1: <>A clear plan for growth, <em>and AI that saves you time.</em></>,
  lede: 'Marketing strategy and AI consulting for Central Florida small businesses. We find where your next customers come from, then help you put it in place.',
  // Ad-matched headlines: tag the ad's utm_content with one of these keys.
  heroVariants: {
    ai: { h1: <>Win back hours every week <em>with AI that actually works.</em></>, lede: 'We find where AI fits in your business, build it, and train your team to use it.' },
    strategy: { h1: <>Know which marketing <em>actually brings in customers.</em></>, lede: 'An audit, a channel plan with budget and targets, and a 90-day roadmap your team can run.' },
    marketing: { h1: <>Marketing that brings in customers, <em>not just likes.</em></>, lede: 'A clear plan, sharper messaging and numbers you can track.' },
  },
  services: [
    ['Strategy', 'Audit, messaging and a 90-day roadmap.', Compass],
    ['AI', 'Where AI saves time, ranked by return.', Robot],
    ['Implementation', 'We build it and train your team.', UsersThree],
  ],
  signup: {
    title: "Let's talk about your growth.",
    lede: 'Free 20-minute strategy call. Only 2 new clients a month.',
    button: 'See If We’re a Fit',
    doneTitle: "You're in. Pick a time.",
    doneLede: "Choose a 20-minute slot and we'll come prepared with first ideas for your business.",
    bookLabel: 'Book My Free Strategy Call',
    companyPlaceholder: 'Smith & Co.',
  },
};

const Link = () => <div className="cs-link" aria-hidden="true"><span /></div>;

const reviews = [
  { src: '/testimonial-sally-butler.png', alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
  { src: '/testimonial-kristin-pitts.png', alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
];

export default function Consulting() {
  const c = content;
  const toHref = useHref();
  // Swapped in after mount so the pre-rendered HTML always hydrates cleanly.
  const [variant, setVariant] = React.useState(null);
  React.useEffect(() => { setVariant(pickVariant(c.heroVariants)); }, [c.heroVariants]);
  const hero = { h1: c.h1, lede: c.lede, ...variant };
  const toForm = () => {
    fireCustom('FunnelScrollToForm', { funnel: c.source });
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onBook = () => { fire('Schedule', { content_name: c.source }); openBooking(); };

  return (
    <main className="cs">
      <header className="cs-nav">
        <img src="/logo.png" alt="Loogo Labs" className="cs-nav__logo" />
        <button type="button" className="cs-pill" onClick={toForm}>Apply</button>
      </header>

      <section className="cs-hero">
        <h1>{hero.h1}</h1>
        <p className="cs-lede">{hero.lede}</p>
        <div className="cs-video"><FounderVideo url={c.videoUrl} poster={c.videoPoster} funnel={c.source} /></div>
        <button type="button" className="cs-textcta" onClick={toForm}>See if you qualify <ArrowDown size={18} weight="bold" /></button>
      </section>

      <section className="cs-light">
        <h2>We help <em>Central Florida</em> businesses</h2>
        <Link />
        <h2>grow with <em>a real plan,</em></h2>
        <div className="cs-cards">
          {c.services.map(([title, desc, Icon]) => (
            <div key={title} className="cs-card">
              <Icon size={30} weight="duotone" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <Link />
        <h2>and <em>clients who say it best.</em></h2>
        <div className="cs-reviews">
          {reviews.map((r) => <img key={r.src} {...r} onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
        </div>
      </section>

      <section className="cs-form bd" id="get-started">
        <SignupForm c={c} onBook={onBook} />
      </section>

      <footer className="cs-footer">
        <span>© {new Date().getFullYear()} Loogo Labs</span>
        <a href={toHref('/privacy')}>Privacy</a>
        <a href={toHref('/terms')}>Terms</a>
      </footer>
    </main>
  );
}
