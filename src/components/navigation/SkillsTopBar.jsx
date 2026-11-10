import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { pathForPage } from '../../lib/seo';

// Thin bar above the nav that points to the Claude Skills Marketplace.
// It sits in normal flow, so it scrolls away and the sticky nav takes the top.
function SkillsTopBar({ es, onNavigate }) {
  return (
    <aside aria-label={es ? 'Anuncio' : 'Announcement'}>
    <a href={pathForPage('Marketplace')} className="ll-topbar"
      onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('Marketplace'); } }}>
      <span className="ll-topbar__inner">
        <span className="ll-topbar__tag">{es ? 'Nuevo' : 'New'}</span>
        <span className="ll-topbar__sep" aria-hidden="true" />
        <span>{es ? 'Entra a nuestro Claude Skills Marketplace' : 'Enter our Claude Skills Marketplace'}</span>
        <span className="ll-topbar__go" aria-hidden="true"><ArrowRight size={14} weight="light" /></span>
      </span>
    </a>
    </aside>
  );
}

export default SkillsTopBar;
