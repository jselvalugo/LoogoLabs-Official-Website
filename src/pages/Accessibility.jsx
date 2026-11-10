import React from 'react';
import { SITE } from '../lib/seo';
import { useLang } from '../lib/i18n';
import '../styles/pages/quiz.css';

const UPDATED_EN = 'November 10, 2026';
const UPDATED_ES = '10 de noviembre de 2026';

export default function Accessibility() {
  const es = useLang() === 'es';
  const mail = <a href={`mailto:${SITE.email}?subject=Accessibility`} style={linkStyle}>{SITE.email}</a>;
  const tel = <a href={`tel:${SITE.tel}`} style={linkStyle}>{SITE.phone}</a>;
  const address = <P><strong>Loogo Labs LLC</strong><br />{SITE.address.streetAddress}<br />{SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}<br />{SITE.address.countryName}</P>;

  if (es) {
    return (
      <div className="lg-page" role="main">
        <div className="lg-wrap">
          <div className="lg-head ll-forest ll-bezel--dark">
            <h1 className="lg-title">Declaración de accesibilidad</h1>
            <p className="lg-updated">Última actualización: {UPDATED_ES}</p>
          </div>
        </div>
        <div className="lg-wrap">
          <div className="lg-panel ll-glass">
            <Section title="Nuestro compromiso">
              <P>Loogo Labs LLC quiere que todas las personas, incluidas las personas con discapacidad, puedan usar loogolabs.com. Diseñamos y revisamos este sitio para cumplir con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, nivel AA, que es el estándar de referencia para la accesibilidad web bajo la Ley de Estadounidenses con Discapacidades (ADA).</P>
            </Section>
            <Section title="Lo que hemos hecho">
              <UL items={[
                'Contraste de color de al menos 4.5:1 para el texto en todo el sitio.',
                'Un enlace "Saltar al contenido principal" y navegación completa con teclado, con un indicador de foco visible.',
                'Ventanas emergentes y menús que mantienen el foco dentro, se cierran con Escape y devuelven el foco al botón que los abrió.',
                'Interruptores y casillas reales que funcionan con teclado y lectores de pantalla, incluidas las preferencias de cookies.',
                'Texto alternativo en las imágenes, encabezados ordenados, regiones identificadas y formularios con etiquetas.',
                'Respeto por la preferencia de "reducir movimiento" del sistema, y un botón para pausar los logotipos en movimiento.',
                'El sitio completo está disponible en inglés y español, con el idioma de cada página declarado.',
                'Revisión automatizada de todas las páginas en computadora y móvil, más pruebas manuales con teclado.',
              ]} />
            </Section>
            <Section title="Limitaciones conocidas">
              <P>Algunos videos de presentación aún no tienen subtítulos; estamos agregándolos. Algunos servicios de terceros que enlazamos, como el calendario para agendar llamadas, tienen su propia accesibilidad, que no controlamos. Si algo de esto te impide usar el sitio, contáctanos y te ayudaremos por otro medio.</P>
            </Section>
            <Section title="Cuéntanos si algo no funciona">
              <P>Si encuentras una barrera en este sitio o necesitas información en otro formato, escríbenos a {mail} o llama al {tel}. Responderemos en un plazo de dos días hábiles.</P>
              {address}
            </Section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg-page" role="main">
      <div className="lg-wrap">
        <div className="lg-head ll-forest ll-bezel--dark">
          <h1 className="lg-title">Accessibility Statement</h1>
          <p className="lg-updated">Last updated: {UPDATED_EN}</p>
        </div>
      </div>
      <div className="lg-wrap">
        <div className="lg-panel ll-glass">
          <Section title="Our commitment">
            <P>Loogo Labs LLC wants everyone, including people with disabilities, to be able to use loogolabs.com. We design and test this site to meet the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, the benchmark standard for web accessibility under the Americans with Disabilities Act (ADA).</P>
          </Section>
          <Section title="What we have done">
            <UL items={[
              'Text color contrast of at least 4.5:1 across the site.',
              'A "Skip to main content" link and full keyboard navigation with a visible focus indicator.',
              'Pop-ups and menus that keep focus inside, close with Escape, and return focus to the button that opened them.',
              'Real switches and checkboxes that work with keyboards and screen readers, including cookie preferences.',
              'Alternative text on images, ordered headings, labeled page regions, and labeled form fields.',
              'Respect for your device’s "reduce motion" setting, and a pause button for the moving client logos.',
              'The full site is available in English and Spanish, with each page’s language declared.',
              'Automated testing of every page on desktop and mobile, plus manual keyboard testing.',
            ]} />
          </Section>
          <Section title="Known limitations">
            <P>Some intro videos do not have captions yet; we are adding them. Some third-party services we link to, such as the calendar used to book a call, have their own accessibility that we do not control. If any of this keeps you from using the site, contact us and we will help you another way.</P>
          </Section>
          <Section title="Tell us if something doesn't work">
            <P>If you run into a barrier on this site or need information in another format, email {mail} or call {tel}. We will respond within two business days.</P>
            {address}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="lg-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return <p className="lg-p">{children}</p>;
}

function UL({ items }) {
  return (
    <ul className="lg-ul">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

const linkStyle = { color: 'var(--cyan-700)', textDecoration: 'underline' };
