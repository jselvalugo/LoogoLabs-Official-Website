import React from 'react';
import { Compass, Megaphone, ChartLineUp, Target, ArrowDown } from '@phosphor-icons/react';
import { FounderVideo, SignupForm, fire, fireCustom, pickVariant } from '../components/funnel/ScrollFunnel';
import { openBooking } from '../lib/booking';
import { useHref } from '../lib/i18n';
import { REFERENCES, CLIENT_LOGOS, CLIENT_WORDMARKS } from '../lib/references';
import '../styles/pages/landing.css';
import '../styles/pages/brand-design.css';
import '../styles/pages/consulting.css';

const logos = REFERENCES.filter((n) => CLIENT_LOGOS[n]);
const wordmarks = [...CLIENT_WORDMARKS];
// The looping band under the nav: logos only.
const beltItems = logos.map((name) => ({ name, ...CLIENT_LOGOS[name] }));
// The mobile collage under the video: logos, then the script name.
const proofItems = [
  ...beltItems,
  ...wordmarks.map((name) => ({ name, wordmark: name.split(' - ')[0], caption: name.split(' - ')[1] })),
];

const content = {
  source: 'consulting',
  // Founder intro video: a YouTube/Vimeo link, or an .mp4 path in /public.
  // Empty shows a "Video coming soon" placeholder until the new video is ready.
  videoUrl: '',
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
  // Meta ads only. Describes what we do, not guaranteed results (no promised ROAS or CAC).
  services: [
    ['Offer & Audience', 'We sharpen your offer and pick the audiences most likely to buy, before a dollar is spent.', Compass],
    ['Creative Testing', 'Scroll-stopping video and image ads, tested in batches so the winners are clear fast.', Megaphone],
    ['Lower CAC Campaigns', 'Meta campaigns structured to bring your cost per customer down, with budgets set from your numbers.', Target],
    ['Tracking & Scaling', 'Pixel and Conversions API set up so you see your real CAC, then we scale only what pays back.', ChartLineUp],
  ],
  signup: {
    title: "Let's map your growth strategy.",
    lede: 'Free 20-minute strategy call. Only 2 new clients a month.',
    button: 'See If We’re a Fit',
    doneTitle: "You're in. Pick a time.",
    doneLede: "Choose a 20-minute slot and we'll come prepared with first ideas for your brand.",
    bookLabel: 'Book My Free Strategy Call',
    companyPlaceholder: 'Your SaaS or brand',
    // Sign-ups here join the newsletter (NEWSLETTER_SOURCES in create-lead.js).
    fine: 'You’ll also get our newsletter. Unsubscribe anytime.',
  },
};

const Link = () => <div className="cs-link" aria-hidden="true"><span /></div>;

// Illustrative 30-day Meta Ads funnel for a SaaS or creator offer. Each figure follows
// from the one before: $3,000 / 250,000 impressions = $12 CPM, 1.5% CTR = 3,750 clicks
// ($0.80 each), 8% landing-page conversion = 300 leads ($10 each), 15% book a call = 45,
// about 27% of calls close = 12 customers ($250 each).
const results = [
  ['Ad spend', '$3,000', 'Meta Ads · 30 days'],
  ['Impressions', '250,000', '$12 CPM'],
  ['Link clicks', '3,750', '1.5% CTR · $0.80 per click'],
  ['Leads', '300', '8% page conversion · $10 per lead'],
  ['Calls booked', '45', '15% of leads'],
  ['New customers', '12', '$250 per customer'],
];

const reviews = [
  { src: '/testimonial-kristin-pitts.png', w: 1390, h: 458, alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
  { src: '/testimonial-sally-butler.png', w: 1388, h: 576, alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
];

export default function Consulting() {
  const c = content;
  // Great Vibes for the script client name. Added here, not in the CSS, so the build keeps it.
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
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

      <section className="cs-loop" aria-label="Selected clients">
        <div className="cs-loop__track">
          {[0, 1].map((copy) => beltItems.map((item) => (
            <div key={`${copy}-${item.name}`} className={`cs-loop__item${item.dark ? ' cs-loop__item--dark' : ''}${item.chip ? ' cs-loop__item--chip' : ''}${item.fill ? ' cs-loop__item--fill' : ''}`} aria-hidden={copy === 1 || undefined}>
              {item.wordmark ? <span className="cs-script cs-loop__script">{item.wordmark}</span> : <img src={item.src} width={item.w} height={item.h} alt={copy === 0 ? item.name : ''} />}
            </div>
          )))}
        </div>
      </section>

      <section className="cs-hero">
        <h1>{hero.h1}</h1>
        <p className="cs-lede">{hero.lede}</p>
        <div className="cs-video">
          {c.videoUrl
            ? <FounderVideo url={c.videoUrl} poster={c.videoPoster} funnel={c.source} />
            : <div className="bd-video cs-video-soon" role="img" aria-label="Video coming soon"><span className="cs-video-soon__label">Video coming soon</span></div>}
        </div>
        <div className="cs-proof" aria-label="Selected clients">
          <p className="cs-proof__eyebrow">In good company</p>
          <div className="cs-proof__cols">
            {[0, 1].map((col) => (
              <div key={col} className={`cs-proof__col${col ? ' cs-proof__col--down' : ''}`}>
                {proofItems.filter((item, i) => (item.wordmark ? 1 : i % 2) === col).map((item) => (
                  <div key={item.name} className={`cs-proof__tile${item.dark || item.wordmark ? ' cs-proof__tile--dark' : ''}${item.chip ? ' cs-proof__tile--chip' : ''}${item.fill ? ' cs-proof__tile--fill' : ''}`}>
                    {item.wordmark
                      ? <span className="cs-script cs-proof__script">{item.wordmark}</span>
                      : <img src={item.src} width={item.w} height={item.h} alt={item.name} />}
                    {item.caption && <span className="cs-proof__caption">{item.caption}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
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
        <p className="cs-roas"><span className="cs-roas__tag">ROAS</span><span>We measure your return on ad spend <strong>to the last cent.</strong></span></p>
        {/* Reviews block: hidden on phones (see consulting.css). */}
        <div className="cs-reviews-block">
          <Link />
          <h2>and <em>clients who say it best.</em></h2>
          <div className="cs-reviews" aria-label="Client reviews">
            <div className="cs-reviews__deck" aria-hidden="true"><span /><span /></div>
            {reviews.map((r) => <img key={r.src} src={r.src} alt={r.alt} width={r.w} height={r.h} onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
          </div>
        </div>
      </section>

      <section className="cs-results" aria-labelledby="cs-results-title">
        <p className="cs-results__eyebrow">Example campaign</p>
        <h2 id="cs-results-title">Where every ad dollar <em>goes.</em></h2>
        <ol className="cs-results__grid">
          {results.map(([label, value, note], i) => (
            <li key={label} className="cs-result">
              <div className="cs-result__top"><span>{label}</span><span>0{i + 1}</span></div>
              <div className="cs-result__value">{value}</div>
              <div className="cs-result__note">{note}</div>
            </li>
          ))}
        </ol>
        <p className="cs-results__fine">Illustrative numbers for a SaaS or creator offer, not a client result. Your numbers depend on your offer, price and audience.</p>
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
