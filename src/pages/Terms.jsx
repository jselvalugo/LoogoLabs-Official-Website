import React from 'react';
import { BOOKING_URL } from '../lib/booking';
import { SITE } from '../lib/seo';
import { useLang } from '../lib/i18n';
import '../styles/pages/quiz.css';

export default function Terms({ onNavigate }) {
  const es = useLang() === 'es';
  if (es) return <TermsES onNavigate={onNavigate} />;
  return (
    <div className="lg-page">

      {/* Header */}
      <div className="lg-wrap">
        <div className="lg-head ll-forest ll-bezel--dark">
          <h1 className="lg-title">
            Terms of Service
          </h1>
          <p className="lg-updated">
            Last updated: September 1, 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="lg-wrap">
      <div className="lg-panel ll-glass">

        <Section title="1. Acceptance of Terms">
          <P>By accessing or using the website loogolabs.com or any services provided by David Selva, a sole proprietor doing business as Loogo Labs ("Loogo Labs," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our website or services.</P>
          <P>These terms apply to all visitors, leads, clients, and anyone who interacts with our website or engages with our services.</P>
        </Section>

        <Section title="2. Services">
          <P>Loogo Labs provides fully managed marketing automation and business platform services to small and mid-size businesses. This includes platform setup, ongoing management, automation builds, and related consulting services as described on our website and in any separate service agreement signed between Loogo Labs and the client.</P>
          <P>Details of the specific services, pricing, and deliverables for paying clients are governed by a separate written agreement. These Terms of Service govern general use of our website and any interaction prior to a signed service agreement.</P>
        </Section>

        <Section title="3. Website Use">
          <P>You may use our website for lawful purposes only. You agree not to:</P>
          <UL items={[
            'Use the site in any way that violates applicable laws or regulations',
            'Attempt to gain unauthorized access to any part of the website or its underlying infrastructure',
            'Transmit any unsolicited commercial communications through our contact forms',
            'Introduce malware, viruses, or any other harmful code',
            'Scrape, crawl, or copy content from the site without written permission',
            'Impersonate Loogo Labs or any of its team members',
          ]} />
        </Section>

        <Section title="4. Intellectual Property">
          <P>All original content published on loogolabs.com — including blog posts, copy, design, and branding — is created by Loogo Labs. While we do not restrict sharing or referencing our content, we ask that you credit us when quoting or linking to it.</P>
          <P>The Loogo Labs name, logo, and brand marks are owned by David Selva, doing business as Loogo Labs. You may not use them without prior written consent.</P>
          <P>We do not reproduce or distribute content owned by third parties without authorization. If you believe any content on our site infringes your intellectual property rights, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>book a call with us</a> and we will investigate promptly.</P>
        </Section>

        <Section title="5. Disclaimer of Warranties">
          <P>Our website and its content are provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</P>
          <P>Results described on our website — such as lead conversion improvements, no-show reductions, or time savings — reflect our experience with clients and are not guarantees. Individual results will vary based on your business, industry, market, and how you use the platform.</P>
        </Section>

        <Section title="6. Limitation of Liability">
          <P>To the fullest extent permitted by law, Loogo Labs and its owners, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, our website or services.</P>
          <P>Our total liability to you for any claim arising from use of our website or services shall not exceed the amount you paid to Loogo Labs in the 30 days preceding the claim, or $100, whichever is greater.</P>
        </Section>

        <Section title="7. Third-Party Links and Services">
          <P>Our website may contain links to third-party websites, booking tools, or services. We are not responsible for the content, privacy practices, or terms of those sites. Clicking a third-party link does not constitute an endorsement.</P>
          <P>We use third-party service providers to operate our platform (hosting, CRM, payment processing, calendar booking). Your use of those services is subject to their own terms and privacy policies.</P>
        </Section>

        <Section title="8. Payments and Refunds">
          <P>Pricing for our managed services is as listed on our website or as agreed in a signed service agreement. All fees are due as specified. We do not offer refunds for services already rendered.</P>
          <P>If you have a billing dispute, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>book a call with us</a> within 14 days of the charge and we will work to resolve it in good faith.</P>
        </Section>

        <Section title="9. Termination">
          <P>Either party may terminate a service engagement with 30 days written notice unless otherwise stated in a signed service agreement. Loogo Labs reserves the right to suspend or terminate access to our services immediately if a client violates these terms or engages in conduct that is harmful to our business or reputation.</P>
        </Section>

        <Section title="10. Governing Law">
          <P>These Terms of Service are governed by the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Miami-Dade County, Florida, and you consent to personal jurisdiction in that venue.</P>
        </Section>

        <Section title="11. Changes to These Terms">
          <P>We may update these Terms of Service at any time. When we do, we will update the "Last updated" date above. Material changes will be communicated where reasonably possible. Continued use of our website after changes are posted constitutes your acceptance of the updated terms.</P>
        </Section>

        <Section title="12. Contact">
          <P>For questions about these terms, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>book a call with us</a>.</P>
          <P><strong>David Selva, d/b/a Loogo Labs</strong><br />{SITE.address.streetAddress}<br />{SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}<br />{SITE.address.countryName}</P>
        </Section>

        <div className="lg-foot">
          <button onClick={() => onNavigate('Privacy')} className="lg-navbtn">← Read our Privacy Policy</button>
        </div>
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
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const linkStyle = { color: 'var(--cyan-700)', textDecoration: 'underline' };

const noteStyle = { fontSize: '0.85rem', opacity: 0.75, fontStyle: 'italic' };

function TermsES({ onNavigate }) {
  return (
    <div className="lg-page">

      {/* Header */}
      <div className="lg-wrap">
        <div className="lg-head ll-forest ll-bezel--dark">
          <h1 className="lg-title">
            Términos de Servicio
          </h1>
          <p className="lg-updated">
            Última actualización: 1 de septiembre de 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="lg-wrap">
      <div className="lg-panel ll-glass">

        <p className="lg-p" style={noteStyle}>Traducción de cortesía. En caso de discrepancia, prevalece la versión en inglés.</p>

        <Section title="1. Aceptación de los términos">
          <P>Al acceder o usar el sitio web loogolabs.com o cualquier servicio prestado por David Selva, propietario único que opera bajo el nombre comercial Loogo Labs ("Loogo Labs", "nosotros" o "nuestro"), aceptas quedar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, no uses nuestro sitio web ni nuestros servicios.</P>
          <P>Estos términos aplican a todos los visitantes, prospectos, clientes y a cualquier persona que interactúe con nuestro sitio web o contrate nuestros servicios.</P>
        </Section>

        <Section title="2. Servicios">
          <P>Loogo Labs ofrece servicios totalmente gestionados de automatización de marketing y plataformas de negocio a pequeñas y medianas empresas. Esto incluye la configuración de la plataforma, su administración continua, el desarrollo de automatizaciones y servicios de consultoría relacionados, según se describe en nuestro sitio web y en cualquier contrato de servicio por separado firmado entre Loogo Labs y el cliente.</P>
          <P>Los detalles de los servicios específicos, precios y entregables para clientes de pago se rigen por un contrato escrito por separado. Estos Términos de Servicio rigen el uso general de nuestro sitio web y cualquier interacción previa a la firma de un contrato de servicio.</P>
        </Section>

        <Section title="3. Uso del sitio web">
          <P>Puedes usar nuestro sitio web únicamente con fines lícitos. Te comprometes a no:</P>
          <UL items={[
            'Usar el sitio de cualquier forma que infrinja las leyes o regulaciones aplicables',
            'Intentar obtener acceso no autorizado a cualquier parte del sitio web o a su infraestructura',
            'Enviar comunicaciones comerciales no solicitadas a través de nuestros formularios de contacto',
            'Introducir malware, virus o cualquier otro código dañino',
            'Extraer, rastrear o copiar contenido del sitio sin permiso por escrito',
            'Hacerte pasar por Loogo Labs o por cualquier miembro de su equipo',
          ]} />
        </Section>

        <Section title="4. Propiedad intelectual">
          <P>Todo el contenido original publicado en loogolabs.com — incluyendo artículos del blog, textos, diseño y marca — es creado por Loogo Labs. Aunque no restringimos que compartas o cites nuestro contenido, te pedimos que nos des crédito cuando lo cites o enlaces.</P>
          <P>El nombre, el logotipo y las marcas de Loogo Labs son propiedad de David Selva, quien opera bajo el nombre comercial Loogo Labs. No puedes usarlos sin consentimiento previo por escrito.</P>
          <P>No reproducimos ni distribuimos contenido propiedad de terceros sin autorización. Si crees que algún contenido de nuestro sitio infringe tus derechos de propiedad intelectual, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>agenda una llamada con nosotros</a> y lo investigaremos de inmediato.</P>
        </Section>

        <Section title="5. Exclusión de garantías">
          <P>Nuestro sitio web y su contenido se ofrecen "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas. No garantizamos que el sitio web funcione sin interrupciones, sin errores o libre de virus u otros componentes dañinos.</P>
          <P>Los resultados descritos en nuestro sitio web — como mejoras en la conversión de prospectos, reducción de inasistencias o ahorro de tiempo — reflejan nuestra experiencia con clientes y no son garantías. Los resultados individuales variarán según tu negocio, industria, mercado y la forma en que uses la plataforma.</P>
        </Section>

        <Section title="6. Limitación de responsabilidad">
          <P>En la máxima medida permitida por la ley, Loogo Labs y sus propietarios, empleados y agentes no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos derivados de tu uso, o imposibilidad de uso, de nuestro sitio web o servicios.</P>
          <P>Nuestra responsabilidad total ante ti por cualquier reclamo derivado del uso de nuestro sitio web o servicios no excederá el monto que hayas pagado a Loogo Labs en los 30 días anteriores al reclamo, o $100, lo que sea mayor.</P>
        </Section>

        <Section title="7. Enlaces y servicios de terceros">
          <P>Nuestro sitio web puede contener enlaces a sitios web, herramientas de reserva o servicios de terceros. No somos responsables del contenido, las prácticas de privacidad ni los términos de esos sitios. Hacer clic en un enlace de terceros no constituye un respaldo.</P>
          <P>Usamos proveedores de servicios de terceros para operar nuestra plataforma (hospedaje, CRM, procesamiento de pagos, reserva de citas). Tu uso de esos servicios está sujeto a sus propios términos y políticas de privacidad.</P>
        </Section>

        <Section title="8. Pagos y reembolsos">
          <P>Los precios de nuestros servicios gestionados son los publicados en nuestro sitio web o los acordados en un contrato de servicio firmado. Todos los cargos vencen según lo especificado. No ofrecemos reembolsos por servicios ya prestados.</P>
          <P>Si tienes una disputa de facturación, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>agenda una llamada con nosotros</a> dentro de los 14 días posteriores al cargo y trabajaremos para resolverla de buena fe.</P>
        </Section>

        <Section title="9. Terminación">
          <P>Cualquiera de las partes puede terminar una relación de servicio con 30 días de aviso por escrito, salvo que se indique lo contrario en un contrato de servicio firmado. Loogo Labs se reserva el derecho de suspender o terminar el acceso a nuestros servicios de inmediato si un cliente infringe estos términos o incurre en conductas que perjudiquen nuestro negocio o reputación.</P>
        </Section>

        <Section title="10. Ley aplicable">
          <P>Estos Términos de Servicio se rigen por las leyes del Estado de Florida, sin tener en cuenta sus disposiciones sobre conflicto de leyes. Cualquier disputa derivada de estos términos se resolverá en los tribunales del Condado de Miami-Dade, Florida, y aceptas la jurisdicción personal de dicha sede.</P>
        </Section>

        <Section title="11. Cambios a estos términos">
          <P>Podemos actualizar estos Términos de Servicio en cualquier momento. Cuando lo hagamos, actualizaremos la fecha de "Última actualización" arriba. Los cambios importantes se comunicarán cuando sea razonablemente posible. El uso continuo de nuestro sitio web después de publicados los cambios constituye tu aceptación de los términos actualizados.</P>
        </Section>

        <Section title="12. Contacto">
          <P>Si tienes preguntas sobre estos términos, <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>agenda una llamada con nosotros</a>.</P>
          <P><strong>David Selva, d/b/a Loogo Labs</strong><br />{SITE.address.streetAddress}<br />{SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}<br />{SITE.address.countryName}</P>
        </Section>

        <div className="lg-foot">
          <button onClick={() => onNavigate('Privacy')} className="lg-navbtn">← Lee nuestra Política de Privacidad</button>
        </div>
      </div>
      </div>
    </div>
  );
}
