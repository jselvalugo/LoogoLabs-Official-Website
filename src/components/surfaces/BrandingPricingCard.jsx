import React from 'react';
import { FileArrowDown } from '@phosphor-icons/react';

// Shared Drive folder holding the branding design services pricing (public link).
export const BRANDING_PRICING_URL = 'https://drive.google.com/drive/folders/1AXIj-llGRsfnO5gFHRteLK7_gCdfhMJs';

// Download card for the branding design pricing. `wide` lays it out as a row
// for full-width spots like the Packages page.
export default function BrandingPricingCard({ es, wide = false, className }) {
  return (
    <a
      className={['ll-pricing', 'll-glass', wide && 'll-pricing--wide', className].filter(Boolean).join(' ')}
      href={BRANDING_PRICING_URL} target="_blank" rel="noopener noreferrer"
    >
      <span className="ll-pricing__icon" aria-hidden="true"><FileArrowDown size={28} weight="bold" /></span>
      <span className="ll-pricing__body">
        <span className="ll-pricing__eyebrow">{es ? 'Diseño de marca' : 'Branding design'}</span>
        <strong className="ll-pricing__title">{es ? 'Precios de diseño de marca' : 'Branding design pricing'}</strong>
        <span className="ll-pricing__text">
          {es
            ? 'Logotipos, identidad visual y guías de marca: lo que incluye cada paquete de diseño y su precio.'
            : 'Logos, visual identity and brand guidelines: what each design package includes and what it costs.'}
        </span>
      </span>
      <span className="ll-pricing__btn">{es ? 'Descargar precios' : 'Download pricing'}<span aria-hidden="true">↓</span></span>
    </a>
  );
}
