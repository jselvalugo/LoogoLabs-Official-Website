import React from 'react';
import { ArrowRight, Check } from '@phosphor-icons/react';
import { useLang } from '../../lib/i18n';
import '../../styles/components/newsletter.css';

// Sign-up for the Loogo Labs Letter, the monthly newsletter. Posts to the
// existing email-subscribe function with the `newsletter` tag, so every sign-up
// lands in the CRM email list ready for the monthly send. Opt-in only: nobody
// is added without filling this in themselves.
//
// variant: 'band'   section block (Home, /newsletter page)
//          'footer' compact row on the dark footer, on every main page
// source:  where the sign-up came from, for the Meta custom event.
const fireCustom = (event, params) => { if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', event, params); };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  en: {
    kicker: 'The Loogo Labs Letter',
    title: ['Posting more isn’t a plan.', 'Get one, once a month.'],
    lede: 'Most owners post, boost and hope. Once a month we send what’s working in marketing right now, an AI tool that saves you hours, and one thing to fix this week. Free.',
    footerTitle: 'The Loogo Labs Letter',
    footerLede: 'Marketing ideas that bring in customers. One email a month.',
    name: 'First name', email: 'Your business email',
    button: 'Send me the Letter', busy: 'Subscribing…',
    fine: 'One email a month. No spam. Unsubscribe anytime.',
    done: 'You’re in. Look for the next Letter in your inbox.',
    invalid: 'Enter a valid email.', error: 'That didn’t go through. Try again.',
  },
  es: {
    kicker: 'La carta de Loogo Labs',
    title: ['Publicar más no es un plan.', 'Recibe uno cada mes.'],
    lede: 'La mayoría publica, promociona y espera. Una vez al mes te enviamos lo que está funcionando en marketing, una herramienta de IA que te ahorra horas y una cosa para mejorar esta semana. Gratis.',
    footerTitle: 'La carta de Loogo Labs',
    footerLede: 'Ideas de marketing que traen clientes. Un email al mes.',
    name: 'Nombre', email: 'Tu email de negocio',
    button: 'Envíame la carta', busy: 'Suscribiendo…',
    fine: 'Un email al mes. Sin spam. Cancela cuando quieras.',
    done: 'Listo. Busca la próxima carta en tu bandeja de entrada.',
    invalid: 'Escribe un email válido.', error: 'No se pudo enviar. Inténtalo de nuevo.',
  },
};

export default function NewsletterSignup({ variant = 'band', source = 'website', heading: Heading = 'h2' }) {
  const c = COPY[useLang() === 'es' ? 'es' : 'en'];
  const footer = variant === 'footer';
  const id = React.useId();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle | busy | done
  const [error, setError] = React.useState('');

  async function submit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) { setError(c.invalid); return; }
    setError(''); setState('busy');
    try {
      const res = await fetch('/.netlify/functions/email-subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined, tag: 'newsletter', website: hp }),
      });
      if (!res.ok) throw new Error('failed');
      fireCustom('NewsletterSignup', { funnel: source });
      setState('done');
    } catch { setError(c.error); setState('idle'); }
  }

  return (
    <section className={`nl nl--${variant}`} aria-labelledby={`${id}-t`}>
      <div className="nl__copy">
        {footer ? (
          <>
            <p className="nl__kicker" id={`${id}-t`}>{c.footerTitle}</p>
            <p className="nl__lede">{c.footerLede}</p>
          </>
        ) : (
          <>
            <p className="nl__kicker">{c.kicker}</p>
            <Heading className="nl__title" id={`${id}-t`}>{c.title[0]} <em>{c.title[1]}</em></Heading>
            <p className="nl__lede">{c.lede}</p>
          </>
        )}
      </div>
      <div className="nl__action">
        {state === 'done' ? (
          <p className="nl__done" role="status"><Check size={18} weight="bold" aria-hidden="true" /> {c.done}</p>
        ) : (
          <form className="nl__form" onSubmit={submit} noValidate>
            {!footer && (
              <input className="nl__input nl__input--name" type="text" autoComplete="given-name" aria-label={c.name}
                placeholder={c.name} value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className="nl__input" type="email" autoComplete="email" inputMode="email" aria-label={c.email}
              placeholder={c.email} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
            <input className="nl__hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={hp} onChange={(e) => setHp(e.target.value)} />
            <button type="submit" className="nl__btn" disabled={state === 'busy'}>
              {state === 'busy' ? c.busy : c.button}<ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </form>
        )}
        {error && <p className="nl__err" role="alert">{error}</p>}
        {state !== 'done' && <p className="nl__fine">{c.fine}</p>}
      </div>
    </section>
  );
}
