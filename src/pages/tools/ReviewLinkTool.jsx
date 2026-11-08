import React from 'react';
import { ArrowSquareOut, Printer } from '@phosphor-icons/react';
import { useLang } from '../../lib/i18n';
import { TOOL_BY_PAGE } from '../../lib/tools';
import { CopyButton, FaqList, MoreTools, QrBlock, ServiceBand, TipsSignup, ToolFrame, qrMatrix, qrSvgString } from './shared';

const tool = TOOL_BY_PAGE.get('ToolReviewLink');
const PLACE_ID_FINDER = 'https://developers.google.com/maps/documentation/places/web-service/place-id';
const writeReview = (id) => `https://search.google.com/local/writereview?placeid=${encodeURIComponent(id)}`;

/**
 * Read whatever the owner pasted and return { url } or { error }.
 * Accepts the "Ask for reviews" share link (g.page/r/…), a Place ID, or any
 * Google link that carries one (placeid=, place_id=, place_id:). A plain Maps
 * link has no Place ID in it, so it gets a pointer to the two ways that work.
 */
export function parseReviewInput(raw) {
  const s = raw.trim();
  if (!s) return null;
  let m = s.match(/g\.page\/r\/([A-Za-z0-9_-]+)/i);
  if (m) return { url: `https://g.page/r/${m[1]}/review` };
  m = s.match(/[?&](?:placeid|place_id)=([A-Za-z0-9_-]{10,})/i) || s.match(/place_id:([A-Za-z0-9_-]{10,})/i);
  if (m) return { url: writeReview(m[1]) };
  if (/^[A-Za-z0-9_-]{20,}$/.test(s)) return { url: writeReview(s) };
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\./i.test(s)) return { error: 'maps' };
  return { error: 'unknown' };
}

const COPY = {
  en: {
    title: <>Google review link &amp; <em>QR code generator</em></>,
    lede: 'Paste your Google review link or Place ID and get a clean one-tap link, a QR code for your counter or invoices, a printable card, and messages you can send today.',
    input: 'Your review link or Place ID',
    placeholder: 'https://g.page/r/… or ChIJ…',
    hint: <>In Google, search your business while signed in, open your Business Profile, choose <strong>Ask for reviews</strong> and copy the link. Or find your Place ID with <a href={PLACE_ID_FINDER} target="_blank" rel="noopener noreferrer">Google’s Place ID Finder</a>.</>,
    name: 'Business name (for the card and messages)',
    namePh: 'Sunshine Lawn Care',
    errMaps: 'That looks like a regular Google Maps link, which doesn’t include the ID Google needs for a review link. Copy the “Ask for reviews” link from your Business Profile, or paste your Place ID instead.',
    errUnknown: 'We couldn’t find a review link or Place ID in that. Paste the “Ask for reviews” link from your Business Profile, or a Place ID that starts with “ChIJ”.',
    empty: 'Your review link, QR code and ready-to-send messages will appear here.',
    linkLabel: 'Your review link',
    test: 'Test link', print: 'Print counter card',
    qrLabel: 'QR code',
    msgs: 'Ready-to-send messages',
    card: ['Loved your visit?', 'Scan to leave us a Google review', 'It takes 30 seconds and helps us a lot.'],
    sms: (n, u) => `Hi! Thanks for choosing ${n || 'us'}. If you have 30 seconds, a quick Google review would mean a lot to our team: ${u}`,
    email: (n, u) => `Subject: How did we do?\n\nHi,\n\nThank you for choosing ${n || 'us'}. If you were happy with the work, would you share a quick Google review? It helps neighbors find a business they can trust.\n\n${u}\n\nThank you,\n${n || 'The team'}`,
    smsL: 'Text message', emailL: 'Email',
  },
  es: {
    title: <>Generador de enlace y <em>código QR para reseñas de Google</em></>,
    lede: 'Pega tu enlace de reseñas de Google o tu Place ID y obtén un enlace directo, un código QR para tu mostrador o tus facturas, una tarjeta para imprimir y mensajes listos para enviar hoy.',
    input: 'Tu enlace de reseñas o Place ID',
    placeholder: 'https://g.page/r/… o ChIJ…',
    hint: <>En Google, busca tu negocio con tu sesión iniciada, abre tu Perfil de Empresa, elige <strong>Pedir reseñas</strong> y copia el enlace. O busca tu Place ID con el <a href={PLACE_ID_FINDER} target="_blank" rel="noopener noreferrer">buscador de Place ID de Google</a>.</>,
    name: 'Nombre del negocio (para la tarjeta y los mensajes)',
    namePh: 'Jardinería Sol',
    errMaps: 'Eso parece un enlace normal de Google Maps, que no incluye el ID que Google necesita para un enlace de reseñas. Copia el enlace "Pedir reseñas" de tu Perfil de Empresa o pega tu Place ID.',
    errUnknown: 'No encontramos un enlace de reseñas ni un Place ID. Pega el enlace "Pedir reseñas" de tu Perfil de Empresa o un Place ID que empiece con "ChIJ".',
    empty: 'Aquí aparecerán tu enlace de reseñas, tu código QR y los mensajes listos para enviar.',
    linkLabel: 'Tu enlace de reseñas',
    test: 'Probar enlace', print: 'Imprimir tarjeta',
    qrLabel: 'Código QR',
    msgs: 'Mensajes listos para enviar',
    card: ['¿Te gustó tu visita?', 'Escanea para dejarnos una reseña en Google', 'Toma 30 segundos y nos ayuda mucho.'],
    sms: (n, u) => `¡Hola! Gracias por elegir a ${n || 'nuestro equipo'}. Si tienes 30 segundos, una reseña rápida en Google significaría mucho para nosotros: ${u}`,
    email: (n, u) => `Asunto: ¿Cómo lo hicimos?\n\nHola:\n\nGracias por elegir a ${n || 'nuestro equipo'}. Si quedaste contento con el trabajo, ¿nos dejarías una reseña rápida en Google? Ayuda a tus vecinos a encontrar un negocio de confianza.\n\n${u}\n\nGracias,\n${n || 'El equipo'}`,
    smsL: 'Mensaje de texto', emailL: 'Email',
  },
};

function printCard() {
  document.body.classList.add('tl-printing');
  const done = () => { document.body.classList.remove('tl-printing'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(done, 1500);
}

function Explainer({ es }) {
  if (es) {
    return (
      <section className="tl-section tl-prose">
        <h2 className="tl-h2">Cómo conseguir más reseñas de Google con este enlace</h2>
        <p>La mayoría de los clientes contentos sí dejarían una reseña. Lo que falta casi siempre es que alguien se la pida en el momento correcto y con un enlace que funcione en un solo toque. Un enlace directo abre el formulario de reseñas de tu negocio sin que el cliente tenga que buscarte en Google.</p>
        <h3>1. Pide la reseña cuando el trabajo acaba de terminar</h3>
        <p>El mejor momento es el mismo día, cuando el cliente todavía tiene presente lo bien que salió. Envía el mensaje de texto de arriba al cerrar el trabajo, o deja la tarjeta con el código QR en el mostrador, en la factura o en el camión.</p>
        <h3>2. Pídela a todos, de la misma forma</h3>
        <p>Google no permite filtrar a quién se le pide la reseña ni ofrecer descuentos o regalos a cambio. Pídela a todos tus clientes con el mismo mensaje. Las reseñas reales y constantes pesan más que un montón de reseñas en una sola semana.</p>
        <h3>3. Contesta cada reseña</h3>
        <p>Responder a las reseñas, buenas y malas, muestra a los próximos clientes que hay una persona real detrás del negocio. Una respuesta corta y específica funciona mejor que una plantilla repetida.</p>
        <h3>Ejemplo</h3>
        <p>Una empresa de jardinería termina 25 trabajos al mes. Si envía el mensaje de texto después de cada uno y uno de cada cinco clientes deja reseña, son unas cinco reseñas nuevas al mes, unas 60 al año, sin tener que acordarse de pedirlas una por una si lo automatiza.</p>
      </section>
    );
  }
  return (
    <section className="tl-section tl-prose">
      <h2 className="tl-h2">How to get more Google reviews with this link</h2>
      <p>Most happy customers would leave a review. What is usually missing is someone asking at the right moment, with a link that works in one tap. A direct review link opens your business’s review form without the customer having to search for you on Google.</p>
      <h3>1. Ask right after the job is done</h3>
      <p>The best time is the same day, while the customer still remembers how well it went. Send the text message above when you close out the job, or leave the QR card on the counter, on the invoice or in the truck.</p>
      <h3>2. Ask everyone, the same way</h3>
      <p>Google doesn’t allow filtering who gets asked, and it doesn’t allow discounts or gifts in exchange for reviews. Ask every customer with the same message. A steady stream of real reviews counts for more than a burst in one week.</p>
      <h3>3. Reply to every review</h3>
      <p>Replying to reviews, good and bad, shows the next customer that a real person runs the business. A short, specific reply works better than the same template every time.</p>
      <h3>Example</h3>
      <p>A lawn care company finishes 25 jobs a month. If it sends the text after every job and one in five customers leaves a review, that is about five new reviews a month, around 60 a year, without anyone having to remember to ask once it is automated.</p>
    </section>
  );
}

function ReviewLinkTool() {
  const es = useLang() === 'es';
  const c = es ? COPY.es : COPY.en;
  const [raw, setRaw] = React.useState('');
  const [name, setName] = React.useState('');
  const parsed = parseReviewInput(raw);
  const link = parsed?.url || '';
  const printSvg = React.useMemo(() => { const m = link && qrMatrix(link); return m ? qrSvgString(m) : ''; }, [link]);
  const fileStem = `${(name.trim() || 'google').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'google'}-review-qr`;

  return (
    <ToolFrame tool={tool} title={c.title} lede={c.lede}>
      <div className="tl-panel tl-grid">
        <div>
          <div className="tl-field">
            <label htmlFor="rl-input">{c.input}</label>
            <input id="rl-input" className="tl-input" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={c.placeholder} autoComplete="off" spellCheck="false" />
            <p className="tl-hint">{c.hint}</p>
          </div>
          <div className="tl-field">
            <label htmlFor="rl-name">{c.name}</label>
            <input id="rl-name" className="tl-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={c.namePh} />
          </div>
          {parsed?.error && <p className="tl-alert" role="alert">{parsed.error === 'maps' ? c.errMaps : c.errUnknown}</p>}
        </div>
        <div className="tl-out" aria-live="polite">
          {!link ? <div className="tl-empty">{c.empty}</div> : (
            <>
              <div>
                <p className="tl-label">{c.linkLabel}</p>
                <div className="tl-outbox">{link}</div>
                <div className="tl-btns">
                  <CopyButton text={link} />
                  <a className="tl-btn tl-btn--ghost" href={link} target="_blank" rel="noopener noreferrer"><ArrowSquareOut size={16} aria-hidden="true" />{c.test}</a>
                  <button type="button" className="tl-btn tl-btn--ghost" onClick={printCard}><Printer size={16} aria-hidden="true" />{c.print}</button>
                </div>
              </div>
              <div>
                <p className="tl-label">{c.qrLabel}</p>
                <QrBlock text={link} name={fileStem} />
              </div>
            </>
          )}
        </div>
      </div>

      {link && (
        <section className="tl-section">
          <h2 className="tl-h2">{c.msgs}</h2>
          <div className="tl-grid">
            {[[c.smsL, c.sms(name.trim(), link)], [c.emailL, c.email(name.trim(), link)]].map(([label, text]) => (
              <div key={label} className="tl-panel tl-msg">
                <div className="tl-msg__head"><span className="tl-label">{label}</span><CopyButton text={text} ghost /></div>
                <div className="tl-outbox tl-msg__text">{text}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Only shown on paper, via the print button. */}
      {printSvg && (
        <div className="tl-print-card" aria-hidden="true">
          <p className="tl-print-card__title">{c.card[0]}</p>
          <p className="tl-print-card__sub">{c.card[1]}</p>
          <span dangerouslySetInnerHTML={{ __html: printSvg }} />
          {name.trim() && <p className="tl-print-card__name">{name.trim()}</p>}
          <p className="tl-print-card__sub">{c.card[2]}</p>
        </div>
      )}

      <Explainer es={es} />
      <FaqList items={es ? tool.faqEs : tool.faq} heading={es ? 'Preguntas frecuentes' : 'Questions'} />
      <ServiceBand
        title={es ? '¿Prefieres que las reseñas se pidan solas?' : 'Rather have reviews ask for themselves?'}
        text={es
          ? 'Reputation Autopilot envía la solicitud de reseña después de cada trabajo terminado, en inglés o español, y te avisa cuando llega una reseña para que la contestes.'
          : 'Reputation Autopilot sends the review request after every completed job, in English or Spanish, and alerts you when a review comes in so you can reply.'}
        servicePage={tool.service}
        serviceLabel={es ? 'Ver Reputation Autopilot' : 'See Reputation Autopilot'}
      />
      <TipsSignup tool={tool} />
      <MoreTools current={tool.page} />
    </ToolFrame>
  );
}

export default ReviewLinkTool;
