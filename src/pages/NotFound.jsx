import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import '../styles/pages/quiz.css';

// Real 404 content. Netlify rewrites every unmatched path to the SPA shell, so
// without this every typo'd URL rendered the homepage and returned 200 (a soft
// 404, which search engines treat as a duplicate of the homepage).
export default function NotFound({ onNavigate }) {
  return (
    <main className="nf-page">
      <div className="nf-panel ll-glass">
        <div className="nf-code">404</div>
        <h1 className="nf-title">That page isn’t here.</h1>
        <p className="nf-text">
          The link may be out of date, or the page may have moved. Everything we publish is still
          one click away.
        </p>
        <div className="nf-actions">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }} className="nf-btn nf-btn--solid">
            Go to the homepage <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </a>
          <a href="/loogonews" onClick={(e) => { e.preventDefault(); onNavigate('LoogoNews'); }} className="nf-btn nf-btn--glass">
            Read Industry LoogoBlog
          </a>
        </div>
      </div>
    </main>
  );
}
