import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import Card from '../components/surfaces/Card';
import { EnvelopeSimple, ArrowsClockwise } from '@phosphor-icons/react';
import { openBooking } from '../lib/booking';
import { SITE, BLOG_BASE, pathForPage } from '../lib/seo';
import { useLang } from '../lib/i18n';

const Wrap = ({ children, style, className }) => (
  <div className={['hm-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

// Hero headline phrase that backspaces and retypes itself through our services. The first word is
// rendered in full on the server, so crawlers and no-JS visitors read a normal
// headline; screen readers get the stable phrase from the h1's aria-label.
const ROTATING_WORDS = ['Email Marketing', 'Text Messaging', 'AI Call Answering', 'Review Automation', 'Local SEO'];
const ROTATING_WORDS_ES = ['El email marketing', 'Los mensajes de texto', 'La atención de llamadas con IA', 'La automatización de reseñas', 'El SEO local'];

function TypedWord({ words }) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState(words[0]);
  const [phase, setPhase] = React.useState('hold'); // hold | delete | type

  React.useEffect(() => {
    // Reduce Motion (common on phones): still rotate, but swap whole words
    // instead of typing them out letter by letter.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => {
        const next = (index + 1) % words.length;
        setIndex(next);
        setText(words[next]);
      }, 3000);
      return () => clearTimeout(t);
    }
    const word = words[index];
    let t;
    if (phase === 'hold') t = setTimeout(() => setPhase('delete'), 2400);
    else if (phase === 'delete') {
      if (text.length) t = setTimeout(() => setText(text.slice(0, -1)), 55);
      else t = setTimeout(() => { setIndex((index + 1) % words.length); setPhase('type'); }, 280);
    } else if (text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length + 1)), 95);
    else setPhase('hold');
    return () => clearTimeout(t);
  }, [text, phase, index, words]);

  return <span className="hm-typed" aria-hidden="true">{text}<span className="hm-typed__caret" /></span>;
}

// Each tile names the tools it retires, straight from the section copy.
const features = [
  { title: 'CRM & Contacts', tone: 'inverse', retires: ['Spreadsheets', 'Scattered inboxes'],
    body: 'Manage every lead, client, and conversation in one place. Every contact and every pipeline stage, fully organized, with no more juggling disconnected tools.' },
  { title: 'Email & SMS Marketing', tone: 'paper', retires: ['Separate email tool', 'Manual follow-ups'],
    body: 'Send campaigns, automate follow-ups, and reach your audience where they are. Build sequences that run while you sleep and never miss a lead again.' },
  { title: 'Social Media & AI Content', tone: 'sage', retires: ['Social scheduler', 'Blank-page posts'],
    body: 'Schedule posts across every platform and generate content with 60+ AI-powered prompts. Stay consistent and visible without spending hours online every week.' },
  { title: 'Courses, Payments & Automation', tone: 'inverse', retires: ['Course platform', 'Payment links', 'A dozen apps'],
    body: 'Sell courses, build membership communities, collect payments, and automate your entire workflow, all without duct-taping a dozen apps together.' },
];

const features_ES = [
  { title: 'CRM y contactos', tone: 'inverse', retires: ['Hojas de cálculo', 'Bandejas de entrada dispersas'],
    body: 'Gestiona cada prospecto, cliente y conversación en un solo lugar. Cada contacto y cada etapa del embudo, todo organizado, sin malabares entre herramientas desconectadas.' },
  { title: 'Marketing por email y SMS', tone: 'paper', retires: ['Herramienta de email aparte', 'Seguimientos manuales'],
    body: 'Envía campañas, automatiza seguimientos y llega a tu audiencia donde está. Crea secuencias que trabajan mientras duermes y nunca vuelvas a perder un prospecto.' },
  { title: 'Redes sociales y contenido con IA', tone: 'sage', retires: ['Programador de redes', 'Publicaciones desde cero'],
    body: 'Programa publicaciones en todas las plataformas y genera contenido con más de 60 prompts de IA. Mantente constante y visible sin pasar horas en línea cada semana.' },
  { title: 'Cursos, pagos y automatización', tone: 'inverse', retires: ['Plataforma de cursos', 'Enlaces de pago', 'Una docena de apps'],
    body: 'Vende cursos, crea comunidades de membresía, cobra pagos y automatiza todo tu flujo de trabajo, sin tener que parchar una docena de apps.' },
];

const voiceBotFeatures_ES = [
  'Contesta cada llamada',
  'Agenda directo en tu calendario',
  'Califica y dirige prospectos',
  'Responde por texto las llamadas perdidas',
];

const voiceBotFeatures = [
  'Answers every call',
  'Books straight to your calendar',
  'Qualifies & routes leads',
  'Texts back missed calls',
];

function VoiceBotSection() {
  const es = useLang() === 'es';
  return (
    <Wrap className="hm-section ll-reveal">
      <Card tone="inverse" emphasis="strong" className="hm-voice">
        <div>
          <Badge tone="inverse">{es ? 'Bot de voz con IA. Pruébalo en vivo' : 'AI Voice Bot. Try it live'}</Badge>
          {es ? <h2>Contesta el teléfono <em>para que tú no tengas que hacerlo.</em></h2> : <h2>It answers the phone <em>so you don't have to.</em></h2>}
          <p>{es ? 'Contesta cada llamada, agenda la cita y le envía un texto a quien no alcance a atender. Las 24 horas, sin contratar a otro empleado.' : 'Picks up every call, books the appointment, and texts back anyone it misses. Around the clock, without hiring another employee.'}</p>
          <div className="hm-voice__cta">
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Prueba el bot de voz con IA' : 'Test the AI Voice Bot'}</Button>
            <small>{es ? 'Reserva un horario y prepararemos una llamada en vivo para que lo escuches.' : "Book a slot and we'll set up a live call so you can hear it."}</small>
          </div>
        </div>
        <ul>
          {(es ? voiceBotFeatures_ES : voiceBotFeatures).map(t => <li key={t}>{t}</li>)}
        </ul>
      </Card>
    </Wrap>
  );
}

const REFERENCES = ['Feche Consulting', 'DaLife, LLC', 'House of Cars', 'Reef Ntwrks', 'Lugo’s Craft Distillery'];

function ReferencesTicker() {
  const es = useLang() === 'es';
  const items = [...REFERENCES, ...REFERENCES];
  return (
    <div className="ll-ticker-bar" role="region" aria-label={es ? 'Clientes seleccionados' : 'Selected clients'}>
      <div className="ll-ticker-label"><span className="ll-ticker-live" aria-hidden="true" />{es ? 'En buena compañía' : 'In good company'}</div>
      <div className="ll-ticker-belt">
        <div className="ll-ticker-track">
          {items.map((name, i) => (
            <React.Fragment key={i}>
              <span className="ll-ticker-ref">{name}</span>
              <span className="ll-ticker-sep" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// A direct line to the founder, as a low-commitment counterpoint to the booking
// CTA that every other surface pushes. The mailto is a real link, so it also
// backs the email on the Organization entity.
function FounderNote() {
  const es = useLang() === 'es';
  return (
    <Wrap className="ll-reveal" style={{ paddingBottom: 48 }}>
      <div className="hm-note ll-glass">
        <p>{es ? '¿Prefieres escribir que hablar? Escríbeme directamente. Llega a mi bandeja de entrada, no a una cola de tickets, y lo respondo yo mismo.' : 'Rather write than talk? Email me directly. It lands in my inbox, not a ticket queue, and I answer it myself.'}</p>
        <a href={`mailto:${SITE.email}`}>{SITE.email}<span aria-hidden="true">→</span></a>
      </div>
    </Wrap>
  );
}

// The founder, front and center: a deliberate break from the product-only
// sections around it.
function FounderSpotlight() {
  const es = useLang() === 'es';
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <Wrap className="hm-section ll-reveal">
      <div className="hm-founder">
        <div className="hm-founder__photo">
          {imgOk ? (
            <img src="/founder-david-selva.jpg" alt={es ? 'David Selva, fundador de Loogo Labs' : 'David Selva, founder of Loogo Labs'} loading="lazy" onError={() => setImgOk(false)} />
          ) : (
            <div className="hm-founder__fallback">DS</div>
          )}
          <div className="hm-founder__name ll-glass">
            <strong>David Selva</strong>
            <span>{es ? 'Fundador' : 'Founder'}</span>
          </div>
        </div>
        <div>
          <span className="ll-eyebrow">{es ? 'Sobre el fundador' : 'About the founder'}</span>
          {es ? <h2 style={{ marginTop: 16 }}>De día gestiono contratos legales. <em>De noche, gestiono tu marketing.</em></h2> : <h2 style={{ marginTop: 16 }}>By day I run legal contracts. <em>By night, I run your marketing.</em></h2>}
          {es ? (<>
          <p>
            Soy David Selva. Mi trabajo de día es la Gestión del Ciclo de Vida de Contratos (CLM) en la
            industria de tecnología legal, construyendo los sistemas que mantienen en movimiento los
            contratos empresariales sin que una sola aprobación se quede en el camino.
          </p>
          <p>
            Loogo Labs es esa misma obsesión enfocada en otra cosa: marketing de rendimiento para
            negocios locales cansados de perder prospectos por seguimientos lentos y herramientas parchadas.
            Cada flujo de trabajo que funciona aquí por dentro lo diseñé y lo opero yo mismo.
          </p>
          </>) : (<>
          <p>
            I'm David Selva. My day job is Contract Lifecycle Management (CLM) inside the legal tech
            industry, building the systems that keep enterprise contracts moving without a single
            approval falling through the cracks.
          </p>
          <p>
            Loogo Labs is that same obsession pointed somewhere else: a performance-marketing
            build for local businesses tired of losing leads to slow follow-up and duct-taped tools.
            Every workflow running under the hood here, I designed and I run myself.
          </p>
          </>)}
        </div>
      </div>
    </Wrap>
  );
}

// Not ready to book a call? Point them at the free quizzes instead — and give
// the quiz hub a real internal link from the homepage while we're at it.
function QuizTeaser({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <Wrap className="ll-reveal" style={{ paddingBottom: 24 }}>
      <a href={pathForPage('Quizzes')} onClick={(e) => { e.preventDefault(); onNavigate('Quizzes'); }}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <Card tone="sage" className="hm-cta">
          <div>
            <h2>{es ? '¿Aún no quieres agendar una llamada? Haz una evaluación de 60 segundos.' : 'Not ready to book a call? Take a 60-second fit check.'}</h2>
            <p>{es ? 'Cuestionarios rápidos y gratis que te dicen al instante si alguno de nuestros sistemas le conviene a tu negocio.' : 'Quick, free quizzes that tell you straight away whether one of our systems fits your business.'}</p>
          </div>
          <Button variant="inverse" size="lg" iconRight={<span>→</span>} tabIndex={-1}>{es ? 'Ver los cuestionarios' : 'See the quizzes'}</Button>
        </Card>
      </a>
    </Wrap>
  );
}

// One quiet line under the hero pointing at the featured Industry LoogoBlog post. Renders
// nothing until the post list loads, or if no post is featured, so the hero
// never shifts for visitors when there is nothing to show.
function FeaturedPostLine({ onNavigate }) {
  const es = useLang() === 'es';
  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPost(data.find(p => p.featured) || null); })
      .catch(() => {});
  }, []);
  if (!post) return null;
  return (
    <Wrap>
      <a href={`${BLOG_BASE}/${post.slug}`} className="hm-featured ll-glass"
        onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }}>
        <span className="hm-featured__tag">{es ? 'Destacado en Industry LoogoBlog' : 'Featured on Industry LoogoBlog'}</span>
        <span className="hm-featured__title">{post.title}</span>
        <span className="hm-featured__go" aria-hidden="true">→</span>
      </a>
    </Wrap>
  );
}

const WHY_ES = [
  ['Marketing de rendimiento, con ingeniería', 'Manejamos la publicidad pagada como un problema de ingeniería: seguimiento limpio del lado del servidor, atribución real y ciclos de prueba ágiles. Cada dólar se mide contra ingresos, no contra clics o impresiones.'],
  ['Consultoría en IA que se pone en marcha', 'Nada de estrategias de IA en diapositivas. Encontramos dónde la IA realmente mueve tus números (calificación de prospectos, agentes de voz, contenido, reportes) y luego la construimos e integramos en tu flujo de trabajo.'],
  ['Experiencia en software y backend', 'APIs, flujos de datos, integraciones de CRM, automatizaciones a la medida. Cuando tu marketing choca con un muro técnico, no le pasamos el problema a otro. Escribimos el código nosotros mismos.'],
  ['Un socio, no un proveedor', 'Trabajas directamente con las personas que hacen el trabajo. Aprendemos tu negocio, revisamos tus números contigo y respondemos por los resultados: estrategia, ejecución y la tecnología detrás de todo.'],
];

function Home({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <main>
      <section className="hm-hero">
        <Wrap>
          <div className="hm-hero__grid">
            <div>
              <span className="hm-pill ll-glass"><span className="hm-pill__tag">Orlando</span>{es ? 'Conoce a David, tu socio de marketing' : 'Meet David, your marketing partner'}</span>
              {es ? (
              <h1 className="hm-hero__title" aria-label="El email marketing que hace volver a tus clientes. Nosotros lo manejamos por ti.">
                <TypedWord key="es" words={ROTATING_WORDS_ES} /><span aria-hidden="true"> que hace volver a tus clientes.</span> <em aria-hidden="true">Nosotros lo manejamos por ti.</em>
              </h1>
              ) : (
              <h1 className="hm-hero__title" aria-label="Email Marketing That Brings Customers Back. We Run It for You.">
                <TypedWord key="en" words={ROTATING_WORDS} /><span aria-hidden="true"> That Brings Customers Back.</span> <em aria-hidden="true">We Run It for You.</em>
              </h1>
              )}
              {es ? (
              <p className="hm-hero__lede">
                Un socio, no un proveedor. Aprendemos cómo funciona tu negocio, planeamos cada campaña
                contigo y nos quedamos a largo plazo, para que tus clientes sigan regresando.
              </p>
              ) : (
              <p className="hm-hero__lede">
                A partner, not a vendor. We learn your business, plan every campaign
                with you, and stay in it for the long run, so your customers keep coming back.
              </p>
              )}
              <div className="hm-hero__actions">
                <Button variant="inverse" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Quiero mi plan de email' : 'Get my email plan'}</Button>
                <Button variant="secondary" size="lg" onClick={() => onNavigate('Mission')}>{es ? 'Ver qué incluye' : "See what's included"}</Button>
              </div>
            </div>
            <div className="hm-hero__art">
              <img src="/hero-blocks.webp" width="1200" height="921" alt="" aria-hidden="true" decoding="async" fetchpriority="high" />
              <div className="hm-float hm-float--a ll-glass" aria-hidden="true">
                <span className="hm-float__icon"><EnvelopeSimple size={20} weight="bold" /></span>
                <div><strong>{es ? 'Campaña de reactivación' : 'Win-back campaign'}</strong><span>{es ? 'Programada para el martes, 9:00' : 'Scheduled for Tuesday, 9:00'}</span></div>
              </div>
              <div className="hm-float hm-float--b ll-glass" aria-hidden="true">
                <span className="hm-float__icon"><ArrowsClockwise size={20} weight="bold" /></span>
                <div><strong>{es ? 'Secuencia de seguimiento' : 'Follow-up sequence'}</strong><span>{es ? 'Se envía después de cada visita' : 'Sends after every visit'}</span></div>
              </div>
            </div>
          </div>

          <div className="hm-stats ll-glass">
            {(es ? [['10+', 'Herramientas reemplazadas'], ['$400+', 'De ahorro al mes'], ['24/7', 'Soporte']] : [['10+', 'Tools replaced'], ['$400+', 'Saved monthly'], ['24/7', 'Support']]).map(([v, l]) => (
              <div key={v}><span className="hm-stats__v">{v}</span><span className="hm-stats__l">{l}</span></div>
            ))}
          </div>
        </Wrap>
      </section>

      <FeaturedPostLine onNavigate={onNavigate} />

      <Wrap className="hm-section">
        <SectionHeading title={es ? 'Todo lo que tu negocio necesita para crecer, bajo un mismo techo' : 'Everything your business needs to grow, under one roof'}
          description={es ? 'Una sola plataforma que reemplaza tu CRM, herramienta de email, app de citas, plataforma de cursos y programador de redes. Un solo acceso. Una sola factura mensual.' : 'One platform that replaces your CRM, email tool, scheduling app, course platform and social scheduler. One login. One monthly bill.'} />
        <div className="hm-bento">
          {(es ? features_ES : features).map(f => (
            <Card key={f.title} tone={f.tone} className={`hm-tile ll-reveal${f.tone === 'inverse' ? ' hm-tile--dark' : ''}`}>
              <div className="hm-tile__tools" aria-label={es ? 'Reemplaza' : 'Replaces'}>
                {f.retires.map(t => <span key={t}>{t}</span>)}
              </div>
              <h3>{f.title}</h3>
              <p style={{ color: f.tone === 'inverse' ? 'var(--ink-200)' : 'var(--ink-500)' }}>{f.body}</p>
            </Card>
          ))}
        </div>
      </Wrap>

      <VoiceBotSection />

      <FounderSpotlight />

      <Wrap className="hm-section">
        <div className="hm-why">
          <div className="hm-why__head">
            <SectionHeading title={es ? 'Consultores que de verdad lo construyen' : 'Consultants who can actually build it'}
              description={es ? 'La mayoría de las agencias te entregan una presentación de estrategia. La mayoría de los desarrolladores esperan especificaciones. Nosotros estamos en el medio: especialistas en marketing de rendimiento que escriben el código del backend, conectan el seguimiento y ponen en marcha la IA que hace rendir más tu inversión.' : 'Most agencies hand you a strategy deck. Most dev shops wait for a spec. We sit in the middle: performance marketers who write the backend code, wire the tracking, and ship the AI that makes your spend work harder.'} />
          </div>
          <div className="hm-why__list">
            {(es ? WHY_ES : [['Performance marketing, engineered', 'We run paid media like an engineering problem: clean server-side tracking, real attribution, tight testing loops. Every dollar gets measured against revenue, not clicks or impressions.'],
              ['AI consulting that ships', 'No slide-deck AI strategy. We find where AI actually moves your numbers (lead qualification, voice agents, content ops, reporting) then build and deploy it into your workflow.'],
              ['Software & backend expertise', 'APIs, data pipelines, CRM integrations, custom automations. When your marketing hits a technical wall, we don\'t file a ticket with someone else. We write the code ourselves.'],
              ['A partner, not a vendor', 'You work directly with the people doing the work. We learn your business, sit in on your numbers, and stay accountable to outcomes: strategy, execution, and the tech underneath it all.']]).map(([k, v]) => (
              <Card key={k} className="hm-why__item ll-reveal">
                <h3>{k}</h3>
                <p>{v}</p>
              </Card>
            ))}
          </div>
        </div>
      </Wrap>

      <QuizTeaser onNavigate={onNavigate} />

      <FounderNote />

      <ReferencesTicker />
    </main>
  );
}

export default Home;
