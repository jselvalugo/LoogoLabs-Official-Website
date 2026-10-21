import React from 'react';
import { Compass, Megaphone, ChartLineUp, Target, ArrowDown } from '@phosphor-icons/react';
import { FounderVideo, SignupForm, fire, fireCustom, pickVariant } from '../components/funnel/ScrollFunnel';
import { openBooking } from '../lib/booking';
import { useHref } from '../lib/i18n';
import { REFERENCES, CLIENT_LOGOS } from '../lib/references';
import '../styles/pages/landing.css';
import '../styles/pages/brand-design.css';
import '../styles/pages/consulting.css';

const content = {
  source: 'consulting',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  videoUrl: '/brand-intro.mp4',
  videoPoster: '/brand-intro-poster.jpg',
  h1: <>Marketing strategy that grows <em>your SaaS or creator <span className="cs-stamped">brand.<span className="cs-stamp" aria-hidden="true">Growth Approved</span></span></em></>,
  lede: 'Marketing and ads strategy for SaaS brands and creators. We find where your next users, subscribers and buyers come from, then build the plan and the campaigns to get them.',
  // Ad-matched headlines: tag the ad's utm_content with one of these keys.
  heroVariants: {
    saas: { h1: <>Turn trials into <em>paying customers.</em></>, lede: 'Positioning, acquisition channels and a 90-day growth plan built for SaaS.' },
    creator: { h1: <>Turn your audience <em>into a business.</em></>, lede: 'A content, launch and monetization strategy that grows revenue, not just followers.' },
    ads: { h1: <>Ads that pay for themselves, <em>not just your ad platform.</em></>, lede: 'Paid ads strategy for SaaS and creators: targeting, creative, budgets and tracking tied to real revenue.' },
    strategy: { h1: <>Know which marketing <em>actually drives growth.</em></>, lede: 'An audit, a channel plan with budget and targets, and a 90-day roadmap you can run.' },
  },
  services: [
    ['Positioning', 'Audience, messaging and offer that convert.', Compass],
    ['Go-to-Market', 'Channels, content and launches, ranked by return.', Megaphone],
    ['Ads Strategy', 'Meta, Google and YouTube ads with creative, targeting and budgets that pay back.', Target],
    ['Growth Plan', 'A 90-day roadmap with targets you can track.', ChartLineUp],
  ],
  signup: {
    title: "Let's map your growth strategy.",
    lede: 'Free 20-minute strategy call. Only 2 new clients a month.',
    button: 'See If We’re a Fit',
    doneTitle: "You're in. Pick a time.",
    doneLede: "Choose a 20-minute slot and we'll come prepared with first ideas for your brand.",
    bookLabel: 'Book My Free Strategy Call',
    companyPlaceholder: 'Your SaaS or brand',
  },
};

const Link = () => <div className="cs-link" aria-hidden="true"><span /></div>;

const reviews = [
  { src: '/testimonial-kristin-pitts.png', alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
  { src: '/testimonial-sally-butler.png', alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
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
        <h2>We help <em>SaaS brands and creators</em></h2>
        <Link />
        <h2>grow with <em>a real marketing and ads strategy,</em></h2>
        <div className="cs-cards">
          {c.services.map(([title, desc, Icon], i) => (
            <div key={title} className="cs-card">
              <span className="cs-card__num" aria-hidden="true">0{i + 1}</span>
              <Icon size={30} weight="duotone" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <Link />
        <h2>and <em>clients who say it best.</em></h2>
        <div className="cs-reviews" aria-label="Client reviews">
          <div className="cs-reviews__deck" aria-hidden="true"><span /><span /></div>
          {reviews.map((r) => <img key={r.src} {...r} onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
        </div>
        <ul className="cs-clients" aria-label="Selected clients">
          {[...REFERENCES.filter((n) => CLIENT_LOGOS[n]), ...REFERENCES.filter((n) => !CLIENT_LOGOS[n])].map((name, i, all) => (
            CLIENT_LOGOS[name] ? (
              <li key={name} className={`cs-client cs-client--logo${CLIENT_LOGOS[name].dark ? ' cs-client--dark' : ''}${CLIENT_LOGOS[name].chip ? ' cs-client--chip' : ''}`}>
                <img src={CLIENT_LOGOS[name].src} alt={name} />
              </li>
            ) : (
              <li key={name} className={`cs-client${!CLIENT_LOGOS[name] && i === all.length - 1 && REFERENCES.filter((n) => !CLIENT_LOGOS[n]).length % 2 === 1 ? ' cs-client--wide' : ''}`}>
                <span className="cs-client__mark" aria-hidden="true">{name.replace(/[^A-Za-z ]/g, '').split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('')}</span>
                <span className="cs-client__name">{name}</span>
              </li>
            )
          ))}
        </ul>
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
