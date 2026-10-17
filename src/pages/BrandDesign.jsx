import React from 'react';
import { ArrowRight, ArrowDown, X, Check, PenNib, Palette, BookOpen, Storefront, Play, ThumbsUp } from '@phosphor-icons/react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import Input from '../components/forms/Input';
import { getSessionId } from '../lib/sessionTracker';
import { useHref } from '../lib/i18n';
import '../styles/pages/landing.css';
import '../styles/pages/brand-design.css';

// The founder intro video. Paste a YouTube or Vimeo link, or drop an .mp4 in
// /public and put its path here (e.g. '/branding-intro.mp4'). Until then the
// founder photo stands in.
const VIDEO_URL = '';

const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const trackBook = () => { fire('Schedule', { content_name: 'brand_design' }); openBooking(); };
const toSignup = () => {
  fireCustom('FunnelScrollToForm', { funnel: 'brand_design' });
  document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ad traffic arrives with utm_* tags; keep them with the lead.
const utmNotes = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .filter((k) => params.get(k)).map((k) => `${k}=${params.get(k)}`).join('\n');
  } catch { return ''; }
};

// Branding packages from the service catalog: [name, price, tagline, [includes...], featured?].
// The pricing section stays hidden until this has entries.
const PACKAGES = [];

const embedUrl = (url) => {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
};

function FounderVideo() {
  if (!VIDEO_URL) {
    return (
      <div className="bd-video bd-video--poster">
        <img src="/founder-david-selva.jpg" alt="David Selva, founder of Loogo Labs" />
        <span className="bd-video__play" aria-hidden="true"><Play size={26} weight="fill" /></span>
      </div>
    );
  }
  const embed = embedUrl(VIDEO_URL);
  return (
    <div className="bd-video">
      {embed
        ? <iframe src={embed} title="Meet David, founder of Loogo Labs" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
        : <video src={VIDEO_URL} poster="/founder-david-selva.jpg" controls playsInline preload="metadata" onPlay={() => fireCustom('VideoPlay', { funnel: 'brand_design' })} />}
    </div>
  );
}

const CTA = ({ variant = 'primary', label = 'Get Started' }) => (
  <div className="bd-cta">
    <Button variant={variant} size="lg" iconRight={<ArrowDown size={16} weight="bold" />} onClick={toSignup} fullWidth>{label}</Button>
  </div>
);

const problems = [
  ['You look smaller than you are', 'A homemade logo and mismatched colors make customers assume you charge less, so you end up competing on price.'],
  ['Nothing matches', "Your truck, website, Facebook page and business cards look like four different companies. People don't remember what they can't recognize."],
  ['Every design starts from zero', 'Without a brand guide, every flyer and post means guessing at fonts and colors again, and it shows.'],
];

const deliverables = [
  ['Custom Logo', 'A primary logo plus simplified versions that work on a truck wrap, a favicon and everything in between.', PenNib],
  ['Visual Identity', 'A color palette and typography chosen to fit your market and stand apart from local competitors.', Palette],
  ['Brand Guidelines', 'One reference so your printer, web developer or new hire gets it right every time.', BookOpen],
  ['Ready-To-Use Files', 'Print and digital formats for signage, social profiles, uniforms and your website.', Storefront],
];

const steps = [
  ['Discovery call', 'We learn your business, your customers and who you are up against.'],
  ['Concepts', 'You see distinct logo directions built around that brief.'],
  ['Refine', 'We sharpen the direction you pick until it feels right.'],
  ['Deliver', 'Final files and your brand guide, ready to use everywhere.'],
];

const faqs = [
  ['How much does it cost?', 'Every package and its price is listed above. On the call we confirm which one fits, so you know the exact price before anything starts.'],
  ['Do I own the final logo?', 'Yes. Once the project is paid, the logo and brand files are yours to use anywhere.'],
  ['What if I already have a logo?', "We can refresh what you have or build brand guidelines around it. We'll tell you honestly on the call which makes more sense."],
  ['What do I need to get started?', 'Fill out the short form below and book a 20-minute call. Bring anything you like or dislike, and we handle the rest.'],
];

const testimonialImages = [
  { src: '/testimonial-sally-butler.png', alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
  { src: '/testimonial-kristin-pitts.png', alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
];

function SignupForm() {
  const [form, setForm] = React.useState({ fullName: '', email: '', phone: '', company: '' });
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !EMAIL_RE.test(form.email.trim()) || !form.phone.trim()) {
      setError('Enter your name, a valid email and your phone number.');
      return;
    }
    setError('');
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(),
        company: form.company.trim(), source: 'brand_design', session_id: getSessionId(), notes: utmNotes(),
      }),
    }).catch(() => {
      // Non-blocking: the visitor still reaches the booking step if the write fails.
    });
    fire('Lead', { content_name: 'brand_design' });
    setDone(true);
  };

  if (done) {
    return (
      <div className="lp-card lp-card--forest lp-card--wide">
        <div className="lp-result-icon"><ThumbsUp size={26} weight="duotone" /></div>
        <h2 className="lp-h2">You're in. Pick a time for your brand call.</h2>
        <p className="lp-lede">Choose a 20-minute slot and we'll come prepared with ideas for your business.</p>
        <div className="bd-cta">
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook} fullWidth>Book My Free Brand Call</Button>
        </div>
      </div>
    );
  }

  return (
    <form className="lp-card lp-card--forest lp-card--wide" onSubmit={submit} noValidate>
      <div className="lp-eyebrow">Get started</div>
      <h2 className="lp-h2">Let's build a brand that looks as good as your work.</h2>
      <p className="lp-lede">Tell us where to reach you, then book your free 20-minute brand call. No obligation.</p>
      <div className="lp-fields bd-fields">
        <Input label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@yourbusiness.com" />
        <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="(407) 555-0123" />
        <Input label="Business name (optional)" value={form.company} onChange={set('company')} placeholder="Smith Plumbing" error={error} />
      </div>
      <div className="bd-cta">
        <Button type="submit" variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} fullWidth>Get My Free Brand Call</Button>
      </div>
    </form>
  );
}

export default function BrandDesign() {
  const toHref = useHref();
  return (
    <main className="ll-shell lp bd">
      <div className="ll-nav lp-nav">
        <div className="ll-nav__bar ll-glass--dark lp-nav__bar">
          <div className="lp-nav__side" />
          <span className="ll-nav__logo lp-nav__logo"><img src="/logo.png" alt="Loogo Labs" /></span>
          <div className="lp-nav__side lp-nav__side--end">
            <button className="bd-nav__cta" onClick={toSignup}>Get started</button>
          </div>
        </div>
      </div>

      {/* Hero + video */}
      <section className="bd-section">
        <div className="lp-card lp-card--glass lp-card--wide lp-hero">
          <div className="lp-center lp-hero__badge"><Badge tone="accent">Branding Design</Badge></div>
          <h1 className="lp-h1">A Brand That Makes You Look Like <em>The Obvious Choice.</em></h1>
          <p className="lp-lede">Custom logo, visual identity and brand guidelines for your business, ready to use on everything from your truck to your website.</p>
          <FounderVideo />
          <p className="lp-fine">Watch: David, founder of Loogo Labs, on how we build your brand</p>
          <CTA />
        </div>
      </section>

      {/* Problem */}
      <section className="bd-section">
        <div className="lp-card lp-card--forest lp-card--wide">
          <div className="lp-eyebrow">What a weak brand costs you</div>
          <h2 className="lp-h2">Customers judge your business before they ever call.</h2>
          <div className="lp-problems">
            {problems.map(([title, desc]) => (
              <div key={title} className="lp-problem">
                <div className="lp-problem__x" aria-hidden="true"><X size={14} weight="bold" /></div>
                <h3>{title}</h3><p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bd-section">
        <div className="lp-card lp-card--glass lp-card--wide">
          <div className="lp-eyebrow">What you get</div>
          <h2 className="lp-h2">Everything you need to look consistent everywhere.</h2>
          <div className="lp-caps bd-caps">
            {deliverables.map(([title, desc, Icon]) => (
              <div key={title} className="lp-cap">
                <span className="lp-cap__icon" aria-hidden="true"><Icon size={22} weight="duotone" /></span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bd-section">
        <div className="lp-card lp-card--glass lp-card--wide">
          <div className="lp-eyebrow">How it works</div>
          <h2 className="lp-h2">Four steps. You approve every one.</h2>
          <ol className="bd-steps">
            {steps.map(([title, desc], i) => (
              <li key={title}>
                <span className="bd-steps__n" aria-hidden="true">{i === steps.length - 1 ? <Check size={14} weight="bold" /> : i + 1}</span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </li>
            ))}
          </ol>
          <CTA />
        </div>
      </section>

      {/* Pricing */}
      {PACKAGES.length > 0 && (
        <section className="bd-section">
          <div className="lp-card lp-card--glass lp-card--wide">
            <div className="lp-eyebrow">Packages &amp; pricing</div>
            <h2 className="lp-h2">Clear packages. No surprises.</h2>
            <div className="bd-pricing">
              {PACKAGES.map(([name, price, tagline, includes, featured]) => (
                <div key={name} className={`bd-plan${featured ? ' bd-plan--featured' : ''}`}>
                  {featured && <Badge tone="accent">Most popular</Badge>}
                  <h3>{name}</h3>
                  <div className="bd-plan__price">{price}</div>
                  <p className="bd-plan__tag">{tagline}</p>
                  <ul>{includes.map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" /> {x}</li>)}</ul>
                </div>
              ))}
            </div>
            <CTA label="Choose My Package" />
          </div>
        </section>
      )}

      {/* Proof */}
      <section className="bd-section">
        <div className="lp-card lp-card--sage lp-card--wide">
          <div className="lp-eyebrow">What clients say</div>
          <h2 className="lp-h2">Real reviews from real Loogo Labs clients.</h2>
          <div className="lp-proof">
            {testimonialImages.map((t) => <img key={t.src} {...t} className="lp-proof__img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bd-section">
        <div className="lp-card lp-card--glass lp-card--wide">
          <div className="lp-eyebrow">Questions</div>
          <h2 className="lp-h2">Before you book.</h2>
          <div className="bd-faq">
            {faqs.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up */}
      <section className="bd-section" id="get-started">
        <SignupForm />
      </section>

      <footer className="lp-footer">
        <div className="lp-footer__pill ll-glass">
          <span>© {new Date().getFullYear()} Loogo Labs</span>
          <a href={toHref('/privacy')}>Privacy</a>
          <a href={toHref('/terms')}>Terms</a>
        </div>
      </footer>
    </main>
  );
}
