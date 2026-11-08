import React from 'react';
import { useLang } from '../../lib/i18n';
import { TOOL_BY_PAGE } from '../../lib/tools';
import { CopyButton, FaqList, MoreTools, QrBlock, ServiceBand, TipsSignup, ToolFrame, slugValue } from './shared';

const tool = TOOL_BY_PAGE.get('ToolUtm');
const HISTORY_KEY = 'll-utm-history';

// Presets fill source + medium (and a campaign hint). Values follow GA4's
// default channel grouping, so each lands in the expected channel.
const PRESETS = [
  { id: 'gbp', en: 'Google Business Profile', es: 'Perfil de Empresa en Google', source: 'google', medium: 'organic', campaign: 'gbp-listing' },
  { id: 'meta', en: 'Facebook / Instagram ads', es: 'Anuncios de Facebook / Instagram', source: 'facebook', medium: 'paid_social', campaign: '' },
  { id: 'ig', en: 'Instagram bio', es: 'Bio de Instagram', source: 'instagram', medium: 'social', campaign: 'bio-link' },
  { id: 'gads', en: 'Google Ads', es: 'Google Ads', source: 'google', medium: 'cpc', campaign: '' },
  { id: 'email', en: 'Email newsletter', es: 'Newsletter por email', source: 'newsletter', medium: 'email', campaign: '' },
  { id: 'qr', en: 'Printed QR code', es: 'Código QR impreso', source: 'qr', medium: 'offline', campaign: 'flyer' },
];

const FIELDS = ['source', 'medium', 'campaign', 'term', 'content'];

/** Build the tagged URL. Keeps existing query params and the #fragment. */
export function buildUtm(base, values, { clean = true } = {}) {
  const raw = base.trim();
  if (!raw) return { url: '', error: null };
  let u;
  try {
    u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { url: '', error: 'url' };
  }
  if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return { url: '', error: 'url' };
  FIELDS.forEach((f) => {
    const v = clean ? slugValue(values[f] || '') : (values[f] || '').trim();
    if (v) u.searchParams.set(`utm_${f}`, v); else u.searchParams.delete(`utm_${f}`);
  });
  const missing = ['source', 'medium', 'campaign'].filter((f) => !(values[f] || '').trim());
  return { url: u.toString(), error: null, missing };
}

const readHistory = () => {
  try { return JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]').slice(0, 5); } catch { return []; }
};

const LABELS = {
  en: {
    url: 'Website URL', urlPh: 'https://www.yourbusiness.com/page',
    source: 'Source', sourceHint: 'Where the click comes from: google, facebook, newsletter',
    medium: 'Medium', mediumHint: 'The type of channel: cpc, paid_social, email, social',
    campaign: 'Campaign', campaignHint: 'Name the offer or push: spring-tune-up',
    term: 'Term (optional)', termHint: 'Paid search keyword',
    content: 'Content (optional)', contentHint: 'Which ad or link: video-a, header-button',
    preset: 'Start from a preset', clean: 'Lowercase and swap spaces for hyphens (recommended)',
    out: 'Your tracking link', empty: 'Enter a URL and a source, medium and campaign. Your link appears here as you type.',
    errUrl: 'That doesn’t look like a web address. Try something like https://www.yourbusiness.com',
    missing: (f) => `Add ${f.join(', ')} so Analytics can group this traffic.`,
    qr: 'QR code for this link', recent: 'Recent links on this device', clear: 'Clear',
  },
  es: {
    url: 'URL del sitio', urlPh: 'https://www.tunegocio.com/pagina',
    source: 'Origen (source)', sourceHint: 'De dónde viene el clic: google, facebook, newsletter',
    medium: 'Medio (medium)', mediumHint: 'El tipo de canal: cpc, paid_social, email, social',
    campaign: 'Campaña (campaign)', campaignHint: 'Nombra la oferta o promoción: limpieza-primavera',
    term: 'Término (opcional)', termHint: 'Palabra clave de búsqueda pagada',
    content: 'Contenido (opcional)', contentHint: 'Qué anuncio o enlace: video-a, boton-encabezado',
    preset: 'Empieza con una opción lista', clean: 'Minúsculas y guiones en vez de espacios (recomendado)',
    out: 'Tu enlace de seguimiento', empty: 'Ingresa una URL y un origen, medio y campaña. Tu enlace aparece aquí mientras escribes.',
    errUrl: 'Eso no parece una dirección web. Prueba algo como https://www.tunegocio.com',
    missing: (f) => `Agrega ${f.join(', ')} para que Analytics agrupe este tráfico.`,
    qr: 'Código QR de este enlace', recent: 'Enlaces recientes en este dispositivo', clear: 'Borrar',
  },
};

function Explainer({ es }) {
  if (es) {
    return (
      <section className="tl-section tl-prose">
        <h2 className="tl-h2">Cómo usar enlaces UTM sin ensuciar tus reportes</h2>
        <p>Sin UTM, Google Analytics junta mucho de tu tráfico como "directo" o "referido" y no puedes saber qué publicación, anuncio o email trajo al cliente. Con UTM, cada enlace dice de dónde vino la visita.</p>
        <h3>Los tres que siempre debes llenar</h3>
        <ul>
          <li><code>utm_source</code>: el sitio o la lista (google, facebook, newsletter).</li>
          <li><code>utm_medium</code>: el tipo de canal (cpc, paid_social, email, social). Usa los mismos valores siempre para que Analytics los ponga en el canal correcto.</li>
          <li><code>utm_campaign</code>: la oferta o promoción (black-friday, limpieza-primavera).</li>
        </ul>
        <h3>Reglas que evitan reportes desordenados</h3>
        <ul>
          <li>Todo en minúsculas y con guiones. "Facebook" y "facebook" cuentan como dos orígenes.</li>
          <li>Nunca pongas UTM en enlaces internos de tu propio sitio.</li>
          <li>Si Google Ads está conectado a Analytics con etiquetado automático, no necesitas UTM en esos anuncios.</li>
          <li>Guarda tus enlaces en una hoja de cálculo para reutilizar los mismos nombres de campaña.</li>
        </ul>
        <h3>Ejemplo</h3>
        <p>Un estudio de yoga pone un código QR en un volante: origen <code>qr</code>, medio <code>offline</code>, campaña <code>volante-enero</code>. Un mes después, Analytics muestra cuántas visitas y reservas vinieron de ese volante.</p>
      </section>
    );
  }
  return (
    <section className="tl-section tl-prose">
      <h2 className="tl-h2">How to use UTM links without messing up your reports</h2>
      <p>Without UTMs, Google Analytics lumps a lot of your traffic into “direct” or “referral,” and you can’t tell which post, ad or email brought the customer in. With UTMs, every link says where the visit came from.</p>
      <h3>The three you should always fill in</h3>
      <ul>
        <li><code>utm_source</code>: the site or list (google, facebook, newsletter).</li>
        <li><code>utm_medium</code>: the type of channel (cpc, paid_social, email, social). Use the same values every time so Analytics puts them in the right channel.</li>
        <li><code>utm_campaign</code>: the offer or push (black-friday, spring-tune-up).</li>
      </ul>
      <h3>Rules that keep reports clean</h3>
      <ul>
        <li>Lowercase with hyphens. “Facebook” and “facebook” count as two sources.</li>
        <li>Never put UTMs on internal links inside your own site.</li>
        <li>If Google Ads is linked to Analytics with auto-tagging on, you don’t need UTMs on those ads.</li>
        <li>Keep your links in a spreadsheet so campaign names stay consistent.</li>
      </ul>
      <h3>Example</h3>
      <p>A yoga studio puts a QR code on a flyer: source <code>qr</code>, medium <code>offline</code>, campaign <code>january-flyer</code>. A month later, Analytics shows how many visits and bookings came from that flyer.</p>
    </section>
  );
}

function UtmTool() {
  const es = useLang() === 'es';
  const L = es ? LABELS.es : LABELS.en;
  const [base, setBase] = React.useState('');
  const [values, setValues] = React.useState({ source: '', medium: '', campaign: '', term: '', content: '' });
  const [preset, setPreset] = React.useState(null);
  const [clean, setClean] = React.useState(true);
  const [history, setHistory] = React.useState([]);
  React.useEffect(() => { setHistory(readHistory()); }, []);

  const set = (f) => (e) => { setValues((v) => ({ ...v, [f]: e.target.value })); };
  const applyPreset = (p) => {
    setPreset(p.id);
    setValues((v) => ({ ...v, source: p.source, medium: p.medium, campaign: p.campaign || v.campaign }));
  };
  const r = buildUtm(base, values, { clean });
  const ready = r.url && !r.missing?.length;

  // Remember the last few finished links on this device only.
  const remember = () => {
    if (!ready) return;
    const next = [r.url, ...history.filter((h) => h !== r.url)].slice(0, 5);
    setHistory(next);
    try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
  };
  const clearHistory = () => {
    setHistory([]);
    try { window.localStorage.removeItem(HISTORY_KEY); } catch { /* storage blocked */ }
  };

  return (
    <ToolFrame tool={tool}
      title={es ? <>Generador de <em>enlaces UTM</em></> : <>UTM <em>link builder</em></>}
      lede={es
        ? 'Crea enlaces de seguimiento limpios para que Google Analytics te diga qué publicación, anuncio, email o volante trajo a cada cliente. Todo se hace en tu navegador.'
        : 'Build clean tracking links so Google Analytics tells you which post, ad, email or flyer brought in each customer. Everything runs in your browser.'}>
      <div className="tl-panel tl-grid">
        <div>
          <p className="tl-label" style={{ margin: '0 0 8px' }}>{L.preset}</p>
          <div className="tl-chips">
            {PRESETS.map((p) => (
              <button key={p.id} type="button" className="tl-chip" aria-pressed={preset === p.id} onClick={() => applyPreset(p)}>{es ? p.es : p.en}</button>
            ))}
          </div>
          <div className="tl-field">
            <label htmlFor="utm-url">{L.url}</label>
            <input id="utm-url" className="tl-input" type="url" inputMode="url" value={base} onChange={(e) => setBase(e.target.value)} placeholder={L.urlPh} autoComplete="off" spellCheck="false" />
          </div>
          <div className="tl-row2">
            {['source', 'medium'].map((f) => (
              <div className="tl-field" key={f}>
                <label htmlFor={`utm-${f}`}>{L[f]}</label>
                <input id={`utm-${f}`} className="tl-input" value={values[f]} onChange={set(f)} autoComplete="off" spellCheck="false" />
                <p className="tl-hint">{L[`${f}Hint`]}</p>
              </div>
            ))}
          </div>
          <div className="tl-field">
            <label htmlFor="utm-campaign">{L.campaign}</label>
            <input id="utm-campaign" className="tl-input" value={values.campaign} onChange={set('campaign')} autoComplete="off" spellCheck="false" />
            <p className="tl-hint">{L.campaignHint}</p>
          </div>
          <div className="tl-row2">
            {['term', 'content'].map((f) => (
              <div className="tl-field" key={f}>
                <label htmlFor={`utm-${f}`}>{L[f]}</label>
                <input id={`utm-${f}`} className="tl-input" value={values[f]} onChange={set(f)} autoComplete="off" spellCheck="false" />
                <p className="tl-hint">{L[`${f}Hint`]}</p>
              </div>
            ))}
          </div>
          <label className="tl-check"><input type="checkbox" checked={clean} onChange={(e) => setClean(e.target.checked)} />{L.clean}</label>
        </div>
        <div className="tl-out" aria-live="polite">
          {r.error === 'url' && <p className="tl-alert" role="alert">{L.errUrl}</p>}
          {!r.url ? (!r.error && <div className="tl-empty">{L.empty}</div>) : (
            <>
              <div>
                <p className="tl-label">{L.out}</p>
                <div className="tl-outbox">{r.url}</div>
                {r.missing?.length > 0 && <p className="tl-alert" style={{ marginTop: 12 }}>{L.missing(r.missing.map((f) => `utm_${f}`))}</p>}
                <div className="tl-btns" onClick={remember}>
                  <CopyButton text={r.url} disabled={!ready} />
                </div>
              </div>
              {ready && (
                <div>
                  <p className="tl-label">{L.qr}</p>
                  <QrBlock text={r.url} name={`qr-${slugValue(values.campaign || 'utm') || 'utm'}`} />
                </div>
              )}
            </>
          )}
          {history.length > 0 && (
            <div>
              <div className="tl-msg__head"><p className="tl-label">{L.recent}</p><button type="button" className="tl-chip" onClick={clearHistory}>{L.clear}</button></div>
              <div className="tl-msg">
                {history.map((h) => (
                  <div key={h} className="tl-outbox" style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ minWidth: 0 }}>{h}</span><CopyButton text={h} ghost />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Explainer es={es} />
      <FaqList items={es ? tool.faqEs : tool.faq} heading={es ? 'Preguntas frecuentes' : 'Questions'} />
      <ServiceBand
        title={es ? '¿Quieres un plan de seguimiento completo?' : 'Want a full tracking plan?'}
        text={es
          ? 'Nuestra habilidad gratuita UTM & Tracking Plan arma las convenciones de nombres, los eventos de conversión y la hoja para todos tus canales. O agenda una llamada y lo configuramos contigo.'
          : 'Our free UTM & Tracking Plan skill builds the naming rules, conversion events and link sheet for every channel. Or book a call and we will set it up with you.'}
        servicePage={tool.service}
        serviceLabel={es ? 'Ver el marketplace' : 'See the marketplace'}
      />
      <TipsSignup tool={tool} />
      <MoreTools current={tool.page} />
    </ToolFrame>
  );
}

export default UtmTool;
