import React from 'react';
import NewsletterSignup from '../components/funnel/NewsletterSignup';
import { useLang } from '../lib/i18n';

// /newsletter: a short, linkable sign-up page for the Loogo Labs Letter, for
// social bios, the email signature and the opt-in line in outreach emails.
const WHAT = {
  en: [
    ['What’s working now', 'The marketing moves bringing small businesses customers this month, in plain English.'],
    ['One AI tool that saves hours', 'A tool or automation worth trying, and exactly what to use it for.'],
    ['One thing to fix this week', 'A single, specific action you can finish before Friday.'],
  ],
  es: [
    ['Lo que funciona ahora', 'Las estrategias de marketing que le están trayendo clientes a los pequeños negocios este mes, en palabras simples.'],
    ['Una herramienta de IA que ahorra horas', 'Una herramienta o automatización que vale la pena probar, y para qué usarla.'],
    ['Una cosa para mejorar esta semana', 'Una sola acción concreta que puedes terminar antes del viernes.'],
  ],
};

export default function Newsletter() {
  const es = useLang() === 'es';
  return (
    <main className="nl-page">
      <NewsletterSignup variant="band" source="newsletter_page" heading="h1" />
      <ul className="nl-page__list" aria-label={es ? 'Qué incluye cada carta' : 'What every Letter includes'}>
        {WHAT[es ? 'es' : 'en'].map(([t, d]) => (
          <li key={t}><strong>{t}</strong><span>{d}</span></li>
        ))}
      </ul>
    </main>
  );
}
