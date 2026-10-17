import React from 'react';
import { ArrowRight, ArrowDown, X, Check, Play, ThumbsUp } from '@phosphor-icons/react';
import Badge from '../feedback/Badge';
import Button from '../core/Button';
import { openBooking } from '../../lib/booking';
import Input from '../forms/Input';
import { getSessionId } from '../../lib/sessionTracker';
import { useHref } from '../../lib/i18n';
import '../../styles/pages/landing.css';
import '../../styles/pages/brand-design.css';

// Long-form scrolling ad funnel: hero + founder video, problem, deliverables,
// process, optional pricing, reviews, FAQ, and a closing lead form that unlocks
// booking. Each page passes its copy in `c`; see pages/BrandDesign.jsx.
const fire = (event, params) => { if (window.fbq) window.fbq('track', event, params); };
const fireCustom = (event, params) => { if (window.fbq) window.fbq('trackCustom', event, params); };
const scrollToSignup = () => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ad traffic arrives with utm_* tags; keep them with the lead.
const utmNotes = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .filter((k) => params.get(k)).map((k) => `${k}=${params.get(k)}`).join('\n');
  } catch { return ''; }
};

const embedUrl = (url) => {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
};

function FounderVideo({ url, funnel }) {
  if (!url) {
    return (
      <div className="bd-video bd-video--poster">
        <img src="/founder-david-selva.jpg" alt="David Selva, founder of Loogo Labs" />
        <span className="bd-video__play" aria-hidden="true"><Play size={26} weight="fill" /></span>
      </div>
    );
  }
  const embed = embedUrl(url);
  return (
    <div className="bd-video">
      {embed
        ? <iframe src={embed} title="Meet David, founder of Loogo Labs" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
        : <video src={url} poster="/founder-david-selva.jpg" controls playsInline preload="metadata" onPlay={() => fireCustom('VideoPlay', { funnel })} />}
    </div>
  );
}

const CTA = ({ onClick, label = 'Get Started' }) => (
  <div className="bd-cta">
    <Button variant="primary" size="lg" iconRight={<ArrowDown size={16} weight="bold" />} onClick={onClick} fullWidth>{label}</Button>
  </div>
);

const testimonialImages = [
  { src: '/testimonial-sally-butler.png', alt: '5-star Facebook recommendation from Sally Butler for Loogo Labs' },
  { src: '/testimonial-kristin-pitts.png', alt: '5-star Facebook recommendation from Kristin Pitts for Loogo Labs' },
];

function SignupForm({ c, onBook }) {
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
        company: form.company.trim(), source: c.source, session_id: getSessionId(), notes: utmNotes(),
      }),
    }).catch(() => {
      // Non-blocking: the visitor still reaches the booking step if the write fails.
    });
    fire('Lead', { content_name: c.source });
    setDone(true);
  };

  if (done) {
    return (
      <div className="lp-card lp-card--forest lp-card--wide">
        <div className="lp-result-icon"><ThumbsUp size={26} weight="duotone" /></div>
        <h2 className="lp-h2">{c.signup.doneTitle}</h2>
        <p className="lp-lede">{c.signup.doneLede}</p>
        <div className="bd-cta">
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={onBook} fullWidth>{c.signup.bookLabel}</Button>
        </div>
      </div>
    );
  }

  return (
    <form className="lp-card lp-card--forest lp-card--wide" onSubmit={submit} noValidate>
      <div className="lp-eyebrow">Get started</div>
      <h2 className="lp-h2">{c.signup.title}</h2>
      <p className="lp-lede">{c.signup.lede}</p>
      <div className="lp-fields bd-fields">
        <Input label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@yourbusiness.com" />
        <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="(407) 555-0123" />
        <Input label="Business name (optional)" value={form.company} onChange={set('company')} placeholder={c.signup.companyPlaceholder || 'Smith Plumbing'} error={error} />
      </div>
      <div className="bd-cta">
        <Button type="submit" variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} fullWidth>{c.signup.button}</Button>
      </div>
    </form>
  );
}

export default function ScrollFunnel({ c }) {
  const toHref = useHref();
  const onBook = () => { fire('Schedule', { content_name: c.source }); openBooking(); };
  const toSignup = () => { fireCustom('FunnelScrollToForm', { funnel: c.source }); scrollToSignup(); };
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
          <div className="lp-center lp-hero__badge"><Badge tone="accent">{c.badge}</Badge></div>
          <h1 className="lp-h1">{c.h1}</h1>
          <p className="lp-lede">{c.lede}</p>
          <FounderVideo url={c.videoUrl} funnel={c.source} />
          <p className="lp-fine">{c.videoCaption}</p>
          <CTA onClick={toSignup} />
        </div>
      </section>

      {/* Problem */}
      <section className="bd-section">
        <div className="lp-card lp-card--forest lp-card--wide">
          <div className="lp-eyebrow">{c.problemsEyebrow}</div>
          <h2 className="lp-h2">{c.problemsTitle}</h2>
          <div className="lp-problems">
            {c.problems.map(([title, desc]) => (
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
          <h2 className="lp-h2">{c.deliverablesTitle}</h2>
          <div className="lp-caps bd-caps">
            {c.deliverables.map(([title, desc, Icon]) => (
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
          <h2 className="lp-h2">{c.stepsTitle}</h2>
          <ol className="bd-steps">
            {c.steps.map(([title, desc], i) => (
              <li key={title}>
                <span className="bd-steps__n" aria-hidden="true">{i === c.steps.length - 1 ? <Check size={14} weight="bold" /> : i + 1}</span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </li>
            ))}
          </ol>
          <CTA onClick={toSignup} />
        </div>
      </section>

      {/* Pricing */}
      {c.packages?.length > 0 && (
        <section className="bd-section">
          <div className="lp-card lp-card--glass lp-card--wide">
            <div className="lp-eyebrow">Packages &amp; pricing</div>
            <h2 className="lp-h2">Clear packages. No surprises.</h2>
            <div className="bd-pricing">
              {c.packages.map(([name, price, tagline, includes, featured]) => (
                <div key={name} className={`bd-plan${featured ? ' bd-plan--featured' : ''}`}>
                  {featured && <Badge tone="accent">Most popular</Badge>}
                  <h3>{name}</h3>
                  <div className="bd-plan__price">{price}</div>
                  <p className="bd-plan__tag">{tagline}</p>
                  <ul>{includes.map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" /> {x}</li>)}</ul>
                </div>
              ))}
            </div>
            <CTA onClick={toSignup} label="Choose My Package" />
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
            {c.faqs.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up */}
      <section className="bd-section" id="get-started">
        <SignupForm c={c} onBook={onBook} />
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
