import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import '../styles/pages/quiz.css';
import { useLang } from '../lib/i18n';

// Real 404 content. Netlify rewrites every unmatched path to the SPA shell, so
// without this every typo'd URL rendered the homepage and returned 200 (a soft
// 404, which search engines treat as a duplicate of the homepage).
export default function NotFound({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <main className="nf-page">
      <div className="nf-panel ll-glass">
        <div className="nf-code">404</div>
        <h1 className="nf-title">{es ? 'Esa página no está aquí.' : 'That page isn’t here.'}</h1>
        {es ? (
        <p className="nf-text">
          Es posible que el enlace esté desactualizado o que la página se haya movido. Todo lo que publicamos
          sigue a un clic de distancia.
        </p>
        ) : (
        <p className="nf-text">
          The link may be out of date, or the page may have moved. Everything we publish is still
          one click away.
        </p>
        )}
        <div className="nf-actions">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }} className="nf-btn nf-btn--solid">
            {es ? 'Ir a la página de inicio' : 'Go to the homepage'} <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </a>
          <a href="/loogonews" onClick={(e) => { e.preventDefault(); onNavigate('LoogoNews'); }} className="nf-btn nf-btn--glass">
            {es ? 'Leer Industry LoogoBlog' : 'Read Industry LoogoBlog'}
          </a>
        </div>
      </div>
    </main>
  );
}
