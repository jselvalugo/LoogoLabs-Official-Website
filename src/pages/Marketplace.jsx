import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight, Bell, Brain, Browser, CalendarBlank, ChartLineUp, ChatsCircle, Check, ClipboardText,
  Crosshair, DownloadSimple, EnvelopeSimple, Eye, FileText, FilmSlate, LinkSimple, LockSimple,
  MagnifyingGlass, Megaphone, PenNib, RocketLaunch, Star, X,
} from '@phosphor-icons/react';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { CATEGORIES, SKILLS, isPreviewHost, skillDownloadHref } from '../lib/marketplace';

const ICONS = {
  Megaphone, ClipboardText, LinkSimple, EnvelopeSimple, RocketLaunch, MagnifyingGlass, Brain, CalendarBlank,
  FilmSlate, PenNib, ChartLineUp, Browser, ChatsCircle, Star, Crosshair, FileText,
};
const EASE = [0.32, 0.72, 0, 1];
const TIERS = [['all', 'All skills'], ['free', 'Free'], ['paid', 'Paid'], ['soon', 'Coming soon']];
const inTier = (s, tier) => tier === 'all' || (tier === 'soon' ? !!s.soon : tier === 'paid' ? s.tier === 'paid' && !s.soon : s.tier === tier);

// Unlocked lead magnets are remembered in this browser so returning visitors skip the form.
const unlockKey = (slug) => `ll_unlock_${slug}`;
function isUnlocked(slug) {
  try { return window.localStorage.getItem(unlockKey(slug)) === '1'; } catch { return false; }
}
function startDownload(slug) {
  const a = document.createElement('a');
  a.href = skillDownloadHref(slug); a.download = `${slug}.zip`;
  document.body.appendChild(a); a.click(); a.remove();
}

// Email form shared by lead magnets ("unlock") and coming-soon skills ("waitlist").
// Posts to the existing newsletter sign-up, tagged so each list can be emailed later.
function EmailForm({ skill, mode }) {
  const magnet = mode === 'unlock';
  const [email, setEmail] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [state, setState] = React.useState('idle');
  const [unlocked, setUnlocked] = React.useState(false);
  React.useEffect(() => { if (magnet) setUnlocked(isUnlocked(skill.slug)); }, [magnet, skill.slug]);

  async function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setState('invalid'); return; }
    setState('sending');
    try {
      const res = await fetch('/.netlify/functions/email-subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), tag: magnet ? skill.slug : `waitlist-${skill.slug}`, website: hp }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('done');
      if (magnet) {
        try { window.localStorage.setItem(unlockKey(skill.slug), '1'); } catch { /* storage blocked */ }
        setUnlocked(true);
        startDownload(skill.slug);
      }
    } catch { setState('error'); }
  }

  if (magnet && unlocked) {
    return (
      <div className="mk-gate mk-gate--done">
        <p className="mk-gate__msg"><Check size={15} weight="bold" aria-hidden="true" />Unlocked. Your download should start on its own.</p>
        <a className="ll-btn ll-btn--primary ll-btn--md" href={skillDownloadHref(skill.slug)} download>
          Download skill (.zip)<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={15} weight="bold" /></span>
        </a>
      </div>
    );
  }
  if (!magnet && state === 'done') {
    return (
      <div className="mk-gate mk-gate--done">
        <p className="mk-gate__msg"><Check size={15} weight="bold" aria-hidden="true" />You’re on the list. We’ll email you the day {skill.name} goes live, with early-bird pricing.</p>
      </div>
    );
  }
  return (
    <form className="mk-gate" onSubmit={submit} noValidate>
      <label className="mk-gate__label" htmlFor={`mk-email-${skill.slug}`}>
        {magnet ? 'Enter your email to unlock the free download' : 'Get notified when it unlocks'}
      </label>
      <div className="mk-gate__row">
        <input id={`mk-email-${skill.slug}`} className="mk-gate__input" type="email" autoComplete="email" inputMode="email"
          placeholder="you@business.com" value={email} onChange={(e) => { setEmail(e.target.value); if (state !== 'sending') setState('idle'); }} />
        <input className="mk-gate__hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
        <button type="submit" className="ll-btn ll-btn--primary ll-btn--md" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : magnet ? 'Unlock free' : 'Notify me'}
          <span aria-hidden="true" className="ll-btn__arrow">{magnet ? <DownloadSimple size={15} weight="bold" /> : <Bell size={15} weight="bold" />}</span>
        </button>
      </div>
      {state === 'invalid' ? <p className="mk-gate__err" role="alert">Please enter a valid email address.</p> : null}
      {state === 'error' ? <p className="mk-gate__err" role="alert">That didn’t go through. Try again, or email <a href="mailto:david@loogolabs.com">david@loogolabs.com</a>.</p> : null}
      <p className="mk-gate__fine">{magnet ? 'Free. You’ll also get occasional marketing tips from Loogo Labs. Unsubscribe anytime.' : 'One email when it launches, plus early-bird pricing. Unsubscribe anytime.'}</p>
    </form>
  );
}

const focusForm = (slug) => {
  const el = document.getElementById(`mk-email-${slug}`);
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }); }
};

function SkillIcon({ name, size = 22 }) {
  const Icon = ICONS[name] || Megaphone;
  return <Icon size={size} weight="light" aria-hidden="true" />;
}

function TierTag({ skill }) {
  if (skill.leadMagnet) return <span className="mk-tag mk-tag--free">Free · Email unlock</span>;
  if (skill.tier === 'free') return <span className="mk-tag mk-tag--free">Free</span>;
  if (skill.soon) return <span className="mk-tag mk-tag--paid"><LockSimple size={11} weight="bold" aria-hidden="true" />${skill.price} · Soon</span>;
  if (skill.buyUrl) return <span className="mk-tag mk-tag--price">${skill.price}</span>;
  return <span className="mk-tag mk-tag--paid"><LockSimple size={11} weight="bold" aria-hidden="true" />Paid · Soon</span>;
}

function BuyLink({ skill, size = 'sm', className = '', label }) {
  return (
    <a className={`ll-btn ll-btn--primary ll-btn--${size} ${className}`} href={skill.buyUrl}
      onClick={(e) => e.stopPropagation()}>
      {label || `Buy · $${skill.price}`}<span aria-hidden="true" className="ll-btn__arrow"><ArrowRight size={14} weight="bold" /></span>
    </a>
  );
}

const SkillCard = React.forwardRef(function SkillCard({ skill, onOpen, index }, ref) {
  const free = skill.tier === 'free';
  return (
    <motion.article ref={ref} layout className={`mk-card${free ? '' : skill.buyUrl ? ' mk-card--buy' : ' mk-card--paid'}`}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.05 }}>
      <button type="button" className="mk-card__hit" onClick={() => onOpen(skill)} aria-label={`Preview ${skill.name}`} />
      <div className="mk-card__top">
        <span className="mk-card__icon"><SkillIcon name={skill.icon} /></span>
        <TierTag skill={skill} />
      </div>
      <span className="mk-card__cat">{skill.category}</span>
      <h3 className="mk-card__name">{skill.name}</h3>
      <p className="mk-card__tag">{skill.tagline}</p>
      <ul className="mk-card__outs">
        {skill.outputs.slice(0, 3).map((o) => (
          <li key={o}><Check size={13} weight="bold" aria-hidden="true" />{o}</li>
        ))}
      </ul>
      <div className="mk-card__foot">
        {skill.leadMagnet ? (
          <button type="button" className="ll-btn ll-btn--primary ll-btn--sm mk-card__dl"
            onClick={(e) => { e.stopPropagation(); onOpen(skill); }}>
            Get it free<span aria-hidden="true" className="ll-btn__arrow"><ArrowRight size={14} weight="bold" /></span>
          </button>
        ) : free ? (
          <a className="ll-btn ll-btn--primary ll-btn--sm mk-card__dl" href={skillDownloadHref(skill.slug)} download
            onClick={(e) => e.stopPropagation()}>
            Download<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={14} weight="bold" /></span>
          </a>
        ) : skill.buyUrl ? (
          <BuyLink skill={skill} className="mk-card__dl" />
        ) : (
          <span className="mk-card__soon">{skill.eta ? `Soon · ${skill.eta.slice(0, 3)} ${skill.eta.split(' ')[1]}` : 'Coming soon'}</span>
        )}
        <span className="mk-card__peek"><Eye size={14} aria-hidden="true" />{free ? 'Preview' : 'Details'}</span>
      </div>
    </motion.article>
  );
});

function useIsPhone() {
  const [phone, setPhone] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const on = () => setPhone(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

function Drawer({ skill, onClose }) {
  const reduce = useReducedMotion();
  const phone = useIsPhone();
  // Side panel on desktop; a bottom sheet that slides up on phones.
  const off = reduce ? { opacity: 0 } : phone ? { y: '100%' } : { x: '100%' };
  const on = reduce ? { opacity: 1 } : phone ? { y: 0 } : { x: 0 };
  React.useEffect(() => {
    if (!skill) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [skill, onClose]);

  // Portal to <body>: the page sits inside a transformed motion.div, which would
  // otherwise trap this fixed overlay under the nav and stretch it to page height.
  const [host, setHost] = React.useState(null);
  React.useEffect(() => { setHost(document.body); }, []);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {skill ? (
        <motion.div key="scrim" className="mk-scrim" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <motion.aside className="mk-drawer" role="dialog" aria-modal="true" aria-label={skill.name}
            onClick={(e) => e.stopPropagation()}
            initial={off} animate={on}
            exit={off} transition={{ duration: 0.45, ease: EASE }}>
            <div className="mk-drawer__head">
              <span className="mk-card__icon mk-card__icon--lg"><SkillIcon name={skill.icon} size={26} /></span>
              <button type="button" className="mk-drawer__close" onClick={onClose} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="mk-drawer__meta"><span className="mk-card__cat">{skill.category}</span><TierTag skill={skill} /></div>
            <h2 className="mk-drawer__title">{skill.name}</h2>
            <p className="mk-drawer__desc">{skill.description}</p>

            {skill.leadMagnet ? (
              <EmailForm skill={skill} mode="unlock" />
            ) : skill.soon ? (
              <>
                <p className="mk-drawer__eta"><LockSimple size={13} weight="bold" aria-hidden="true" />Unlocks {skill.eta} · planned price ${skill.price} one-time</p>
                <EmailForm skill={skill} mode="waitlist" />
              </>
            ) : skill.tier === 'free' ? (
              <a className="ll-btn ll-btn--primary ll-btn--md mk-drawer__dl" href={skillDownloadHref(skill.slug)} download>
                Download skill (.zip)<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={15} weight="bold" /></span>
              </a>
            ) : skill.buyUrl ? (
              <BuyLink skill={skill} size="md" className="mk-drawer__dl" label={`Buy now · $${skill.price}`} />
            ) : (
              <Button variant="secondary" onClick={openBooking} iconRight={<ArrowRight size={14} weight="bold" />}>Ask about early access</Button>
            )}
            {skill.buyUrl ? <p className="mk-drawer__fine">One-time payment · instant download · secure checkout by Stripe</p> : null}

            <section className="mk-drawer__sec">
              <h4 className="ll-eyebrow">What you get</h4>
              <ul className="mk-card__outs mk-card__outs--lg">
                {skill.outputs.map((o) => <li key={o}><Check size={14} weight="bold" aria-hidden="true" />{o}</li>)}
              </ul>
            </section>

            {skill.prompt ? (
              <section className="mk-drawer__sec">
                <h4 className="ll-eyebrow">Try asking</h4>
                <p className="mk-drawer__prompt">“{skill.prompt}”</p>
              </section>
            ) : null}

            {skill.inside ? (
              <section className="mk-drawer__sec">
                <h4 className="ll-eyebrow">What's inside</h4>
                <ul className="mk-card__outs mk-card__outs--lg">
                  {skill.inside.map((o) => <li key={o}><Check size={14} weight="bold" aria-hidden="true" />{o}</li>)}
                </ul>
              </section>
            ) : null}

            {skill.buyUrl ? (
              <section className="mk-drawer__sec">
                <h4 className="ll-eyebrow">How you get it</h4>
                <ol className="mk-steps-sm">
                  <li>Pay securely through Stripe. You'll get a receipt by email.</li>
                  <li>You land on a download page right away. The link keeps working for 30 days.</li>
                  <li>Upload the .zip in Claude under Settings → Capabilities → Skills, or unzip it into <code>~/.claude/skills/</code> for Claude Code.</li>
                </ol>
              </section>
            ) : null}

            {skill.tier === 'free' ? (
              <>
                <section className="mk-drawer__sec">
                  <h4 className="ll-eyebrow">How to install</h4>
                  <ol className="mk-steps-sm">
                    <li><b>Claude (web & desktop):</b> Settings → Capabilities. Turn on code execution and file creation, then under Skills choose <i>Upload skill</i> and pick the .zip.</li>
                    <li><b>Claude Code:</b> unzip into <code>~/.claude/skills/</code> so you have <code>~/.claude/skills/{skill.slug}/SKILL.md</code>.</li>
                  </ol>
                </section>
                <section className="mk-drawer__sec">
                  <h4 className="ll-eyebrow">Inside SKILL.md</h4>
                  <pre className="mk-source">{skill.leadMagnet && !isUnlocked(skill.slug)
                    ? `${skill.source.split('\n').slice(0, 24).join('\n')}\n\n… unlock with your email to get the full skill.`
                    : skill.source}</pre>
                </section>
              </>
            ) : null}

            <div className="mk-drawer__bar">
              {skill.leadMagnet || skill.soon ? (
                <button type="button" className="ll-btn ll-btn--primary ll-btn--md" onClick={() => focusForm(skill.slug)}>
                  {skill.leadMagnet ? 'Unlock free' : 'Notify me'}<span aria-hidden="true" className="ll-btn__arrow"><ArrowRight size={15} weight="bold" /></span>
                </button>
              ) : skill.tier === 'free' ? (
                <a className="ll-btn ll-btn--primary ll-btn--md" href={skillDownloadHref(skill.slug)} download>
                  Download skill<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={15} weight="bold" /></span>
                </a>
              ) : skill.buyUrl ? (
                <BuyLink skill={skill} size="md" label={`Buy now · $${skill.price}`} />
              ) : (
                <Button variant="primary" onClick={openBooking} iconRight={<ArrowRight size={14} weight="bold" />}>Ask about early access</Button>
              )}
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    host,
  );
}

function HeroStack() {
  const reduce = useReducedMotion();
  const free = SKILLS.filter((s) => s.tier === 'free');
  return (
    <div className="mk-stack" aria-hidden="true">
      {free.slice(0, 3).map((s, i) => (
        <motion.div key={s.slug} className={`mk-stack__card mk-stack__card--${i}`}
          initial={reduce ? false : { opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: [-6, 3, -1.5][i] }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.12 }}>
          <div className="mk-stack__bar"><span /><span /><span /><em>{s.slug}/SKILL.md</em></div>
          <div className="mk-stack__body">
            <span className="mk-stack__k">name:</span> {s.slug}<br />
            <span className="mk-stack__k">description:</span> {s.tagline}
          </div>
          <div className="mk-stack__foot"><SkillIcon name={s.icon} size={18} />{s.name}</div>
        </motion.div>
      ))}
    </div>
  );
}

function Marketplace() {
  const [tier, setTier] = React.useState('all');
  const [cat, setCat] = React.useState('All');
  const [open, setOpen] = React.useState(null);
  const close = React.useCallback(() => setOpen(null), []);
  // If checkout couldn't start, the checkout function sends the buyer back with ?checkout_error.
  const [checkoutError, setCheckoutError] = React.useState(false);
  React.useEffect(() => { setCheckoutError(new URLSearchParams(window.location.search).has('checkout_error')); }, []);
  // Staff-only reminder strip: deploy previews and localhost, never production.
  const [preview, setPreview] = React.useState(false);
  React.useEffect(() => { setPreview(isPreviewHost()); }, []);

  const list = SKILLS.filter((s) => inTier(s, tier) && (cat === 'All' || s.category === cat));
  const freeCount = SKILLS.filter((s) => s.tier === 'free').length;
  const liveCount = SKILLS.filter((s) => s.tier === 'paid' && !s.soon).length;
  const soonCount = SKILLS.filter((s) => s.soon).length;

  return (
    <main className="mk">
      {preview ? <div className="mk-preview"><span className="mk-preview__dot" />Private preview · this page isn’t public yet</div> : null}

      {checkoutError ? (
        <div className="mk-alert" role="alert">
          Checkout couldn't start just now. Please try again in a minute, or email <a href="mailto:david@loogolabs.com">david@loogolabs.com</a> and we'll sort it out.
        </div>
      ) : null}

      <section className="mk-wrap mk-hero">
        <div className="mk-hero__copy">
          <h1 className="mk-hero__title">Claude skills that work like <em>your marketing team.</em></h1>
          <p className="mk-hero__lede">
            Download a skill, add it to Claude, and it follows our playbook every time: brand voice, ad copy,
            campaign briefs, tracking plans and lifecycle email, with more unlocking every month. Start free with Brand Brain.
          </p>
          <div className="mk-hero__stats">
            <div><b>{freeCount}</b><span>Free skills</span></div>
            <div><b>{liveCount}</b><span>Premium skills</span></div>
            <div><b>{soonCount}</b><span>Coming soon</span></div>
          </div>
        </div>
        <HeroStack />
      </section>

      <section className="mk-wrap">
        <div className="mk-bar">
          <div className="mk-seg" role="tablist" aria-label="Price">
            {TIERS.map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tier === k}
                className={`mk-seg__btn${tier === k ? ' is-on' : ''}`} onClick={() => setTier(k)}>
                {tier === k ? <motion.span layoutId="mk-seg" className="mk-seg__pill" transition={{ duration: 0.35, ease: EASE }} /> : null}
                <span className="mk-seg__label">{label}</span>
              </button>
            ))}
          </div>
          <div className="mk-chips">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className={`mk-chip${cat === c ? ' is-on' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </div>
        <p className="mk-count">{list.length} {list.length === 1 ? 'skill' : 'skills'}</p>

        <motion.div layout className="mk-grid">
          <AnimatePresence mode="popLayout">
            {list.map((s, i) => <SkillCard key={s.slug} skill={s} index={i} onOpen={setOpen} />)}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 ? <p className="mk-empty">Nothing here yet. More skills are on the way.</p> : null}
      </section>

      <section className="mk-how ll-forest">
        <div className="mk-wrap">
          <h2 className="mk-how__title">Three steps. No setup call.</h2>
          <ol className="mk-how__steps">
            <li><span>01</span><h3>Download</h3><p>Each skill is a small .zip with a SKILL.md inside: plain instructions you can read before you install.</p></li>
            <li><span>02</span><h3>Add it to Claude</h3><p>Upload it under Settings → Capabilities → Skills, or drop it into ~/.claude/skills for Claude Code.</p></li>
            <li><span>03</span><h3>Just ask</h3><p>Claude loads the skill when your request matches it, so “write ads for our trial” follows the playbook.</p></li>
          </ol>
        </div>
      </section>

      <section className="mk-wrap mk-cta">
        <div>
          <h2 className="mk-cta__title">Need a skill built around <em>your</em> process?</h2>
          <p className="mk-cta__lede">We turn your team’s playbooks into skills Claude follows the same way every time.</p>
        </div>
        <Button variant="primary" onClick={openBooking} iconRight={<ArrowRight size={14} weight="bold" />}>Book a call</Button>
      </section>

      <Drawer skill={open} onClose={close} />
    </main>
  );
}

export default Marketplace;
