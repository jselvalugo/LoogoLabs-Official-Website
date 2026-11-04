import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight, Check, ClipboardText, DownloadSimple, EnvelopeSimple, Eye, LinkSimple,
  LockSimple, MagnifyingGlass, Megaphone, RocketLaunch, X,
} from '@phosphor-icons/react';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { CATEGORIES, SKILLS, skillDownloadHref } from '../lib/marketplace';

const ICONS = { Megaphone, ClipboardText, LinkSimple, EnvelopeSimple, RocketLaunch, MagnifyingGlass };
const EASE = [0.32, 0.72, 0, 1];
const TIERS = [['all', 'All skills'], ['free', 'Free'], ['paid', 'Paid']];

function SkillIcon({ name, size = 22 }) {
  const Icon = ICONS[name] || Megaphone;
  return <Icon size={size} weight="light" aria-hidden="true" />;
}

function TierTag({ tier }) {
  return tier === 'free'
    ? <span className="mk-tag mk-tag--free">Free</span>
    : <span className="mk-tag mk-tag--paid"><LockSimple size={11} weight="bold" aria-hidden="true" />Paid · Soon</span>;
}

const SkillCard = React.forwardRef(function SkillCard({ skill, onOpen, index }, ref) {
  const free = skill.tier === 'free';
  return (
    <motion.article ref={ref} layout className={`mk-card${free ? '' : ' mk-card--paid'}`}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.05 }}>
      <button type="button" className="mk-card__hit" onClick={() => onOpen(skill)} aria-label={`Preview ${skill.name}`} />
      <div className="mk-card__top">
        <span className="mk-card__icon"><SkillIcon name={skill.icon} /></span>
        <TierTag tier={skill.tier} />
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
        {free ? (
          <a className="ll-btn ll-btn--primary ll-btn--sm mk-card__dl" href={skillDownloadHref(skill.slug)} download
            onClick={(e) => e.stopPropagation()}>
            Download<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={14} weight="bold" /></span>
          </a>
        ) : (
          <span className="mk-card__soon">Coming soon</span>
        )}
        <span className="mk-card__peek"><Eye size={14} aria-hidden="true" />{free ? 'Preview' : 'Details'}</span>
      </div>
    </motion.article>
  );
});

function Drawer({ skill, onClose }) {
  const reduce = useReducedMotion();
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
            initial={reduce ? { opacity: 0 } : { x: '100%' }} animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }} transition={{ duration: 0.45, ease: EASE }}>
            <div className="mk-drawer__head">
              <span className="mk-card__icon mk-card__icon--lg"><SkillIcon name={skill.icon} size={26} /></span>
              <button type="button" className="mk-drawer__close" onClick={onClose} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="mk-drawer__meta"><span className="mk-card__cat">{skill.category}</span><TierTag tier={skill.tier} /></div>
            <h2 className="mk-drawer__title">{skill.name}</h2>
            <p className="mk-drawer__desc">{skill.description}</p>

            {skill.tier === 'free' ? (
              <a className="ll-btn ll-btn--primary ll-btn--md mk-drawer__dl" href={skillDownloadHref(skill.slug)} download>
                Download skill (.zip)<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={15} weight="bold" /></span>
              </a>
            ) : (
              <Button variant="secondary" onClick={openBooking} iconRight={<ArrowRight size={14} weight="bold" />}>Ask about early access</Button>
            )}

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
                  <pre className="mk-source">{skill.source}</pre>
                </section>
              </>
            ) : null}
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

  const list = SKILLS.filter((s) => (tier === 'all' || s.tier === tier) && (cat === 'All' || s.category === cat));
  const freeCount = SKILLS.filter((s) => s.tier === 'free').length;

  return (
    <main className="mk">
      <div className="mk-preview"><span className="mk-preview__dot" />Private preview · this page isn’t public yet</div>

      <section className="mk-wrap mk-hero">
        <div className="mk-hero__copy">
          <span className="ll-eyebrow">Loogo Labs Marketplace</span>
          <h1 className="mk-hero__title">Claude skills that work like <em>your marketing team.</em></h1>
          <p className="mk-hero__lede">
            Download a skill, add it to Claude, and it follows our playbook every time: ad copy, campaign briefs,
            tracking plans and lifecycle email. Built from the work we do for SaaS brands and creators.
          </p>
          <div className="mk-hero__stats">
            <div><b>{freeCount}</b><span>Free skills</span></div>
            <div><b>{SKILLS.length - freeCount}</b><span>Paid, coming soon</span></div>
            <div><b>2</b><span>Claude &amp; Claude Code</span></div>
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
          <span className="ll-eyebrow mk-how__eyebrow">How it works</span>
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
