import React from 'react';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import { openBooking } from '../lib/booking';
import { SITE, pathForPage } from '../lib/seo';
import { REFERENCES, CLIENT_LOGOS, CLIENT_WORDMARKS } from '../lib/references';
import { useHref, useLang } from '../lib/i18n';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Reveal, Stagger, Item, Words, Parallax, Magnetic, MotionPace, EASE, useMounted } from '../lib/motion';
import NewsletterSignup from '../components/funnel/NewsletterSignup';
import { LivingMonogram, ServiceGlyph, AmbientShape } from '../components/brand/Morph';

const Wrap = ({ children, style, className, id }) => (
  <div id={id} className={['hm-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

// ── What we do, in plain words ─────────────────────────────────────────────
// Four service lines. Each says what it is, then exactly what the client gets.
const SERVICES = [
  {
    title: 'Marketing strategy',
    summary: 'Not sure what is working or where to spend? We study your business, your customers and your competition, then hand you a clear 90-day plan.',
    gets: ['Free Marketing Game Plan call', 'Your offer, message and who to target', 'Channel plan with budget and monthly targets', 'Monthly review of what worked'],
    price: 'Starts with a free Game Plan call',
  },
  {
    title: 'Content & social media',
    summary: 'Show up every week with content that sounds like you: short-form video, carousels and posts made to get attention and turn followers into customers.',
    gets: ['Short-form video and Reels editing', 'UGC and creator content', 'Monthly content calendar, hooks and captions', 'Instagram, Facebook, TikTok and LinkedIn'],
    price: '$500–$2,000/mo, based on industry and volume',
  },
  {
    title: 'Paid ads',
    summary: 'Google, Facebook, Instagram and YouTube ads aimed at the people most likely to buy, with tracking so you see which dollars bring customers.',
    gets: ['Campaign setup, targeting and ad creative', 'Landing pages that match the ad', 'Conversion tracking set up first', 'Results explained in plain English'],
    price: '$500/mo minimum, or 20% of ad spend (whichever is higher)',
  },
  {
    title: 'Websites, CRM & automation',
    summary: 'A website that turns visitors into leads, and a system that follows up for you so no lead slips through the cracks.',
    gets: ['Websites and landing pages', 'CRM setup on GoHighLevel', 'Automatic email and text follow-up', 'AI receptionist and review requests'],
    price: 'Websites from $1,500 · Software from $297/mo',
  },
];
const SERVICES_ES = [
  {
    title: 'Estrategia de marketing',
    summary: '¿No sabes qué funciona ni dónde invertir? Estudiamos tu negocio, tus clientes y tu competencia, y te entregamos un plan claro de 90 días.',
    gets: ['Llamada gratis para tu Plan de Marketing', 'Tu oferta, tu mensaje y a quién dirigirte', 'Plan de canales con presupuesto y metas mensuales', 'Revisión mensual de lo que funcionó'],
    price: 'Empieza con una llamada gratis',
  },
  {
    title: 'Contenido y redes sociales',
    summary: 'Aparece cada semana con contenido que suena a ti: videos cortos, carruseles y publicaciones hechos para captar atención y convertir seguidores en clientes.',
    gets: ['Edición de videos cortos y Reels', 'Contenido UGC y de creadores', 'Calendario mensual, ganchos y textos', 'Instagram, Facebook, TikTok y LinkedIn'],
    price: '$500–$2,000/mes, según industria y volumen',
  },
  {
    title: 'Anuncios pagados',
    summary: 'Anuncios en Google, Facebook, Instagram y YouTube dirigidos a quienes tienen más probabilidad de comprar, con medición para ver qué dólares traen clientes.',
    gets: ['Configuración, segmentación y creatividades', 'Páginas de destino que coinciden con el anuncio', 'Medición de conversiones desde el inicio', 'Resultados explicados en palabras simples'],
    price: '$500/mes mínimo, o 20% de la inversión (lo que sea mayor)',
  },
  {
    title: 'Sitios web, CRM y automatización',
    summary: 'Un sitio web que convierte visitas en prospectos, y un sistema que les da seguimiento por ti para que ningún prospecto se pierda.',
    gets: ['Sitios web y páginas de destino', 'CRM en GoHighLevel', 'Seguimiento automático por email y texto', 'Recepcionista con IA y solicitudes de reseñas'],
    price: 'Sitios desde $1,500 · Software desde $297/mes',
  },
];

// "Sound familiar?": the problems owners tell us about, each tied to the service that fixes it.
const PROBLEMS = [
  { q: 'I post, but nothing happens.', fix: 'We plan content around what your customers care about, then make the videos and posts that get them to call or buy.', svc: 1, svcName: 'Content & social media' },
  { q: 'I tried ads and lost money.', fix: 'We set up tracking first, aim at the people most likely to buy, and show you which dollars brought customers.', svc: 2, svcName: 'Paid ads' },
  { q: 'Leads come in, then go cold.', fix: 'We set up a system that texts and emails every lead right away and reminds you who to call.', svc: 3, svcName: 'CRM & automation' },
  { q: 'I don’t know what to focus on.', fix: 'On a free call we look at your business and give you a 90-day plan: what to fix first and where to spend.', svc: 0, svcName: 'Marketing strategy' },
];
const PROBLEMS_ES = [
  { q: 'Publico, pero no pasa nada.', fix: 'Planeamos el contenido según lo que le importa a tus clientes y hacemos los videos y publicaciones que los llevan a llamar o comprar.', svc: 1, svcName: 'Contenido y redes' },
  { q: 'Probé anuncios y perdí dinero.', fix: 'Primero configuramos la medición, apuntamos a quienes tienen más probabilidad de comprar y te mostramos qué dólares trajeron clientes.', svc: 2, svcName: 'Anuncios pagados' },
  { q: 'Llegan prospectos y se enfrían.', fix: 'Montamos un sistema que le escribe por texto y email a cada prospecto al instante y te recuerda a quién llamar.', svc: 3, svcName: 'CRM y automatización' },
  { q: 'No sé en qué enfocarme.', fix: 'En una llamada gratis revisamos tu negocio y te damos un plan de 90 días: qué arreglar primero y dónde invertir.', svc: 0, svcName: 'Estrategia de marketing' },
];

const WHO = [
  ['Local service businesses', 'Restaurants, salons, clinics, contractors, distilleries and shops that need more calls, bookings and walk-ins.'],
  ['Growing brands and startups', 'Software, products and creators that need a clear message, steady content and a funnel that turns attention into sales.'],
  ['Spanish-speaking businesses', 'Bilingual marketing for businesses serving Hispanic customers in the United States and in Mexico.'],
];
const WHO_ES = [
  ['Negocios de servicio locales', 'Restaurantes, salones, clínicas, contratistas, destilerías y tiendas que necesitan más llamadas, citas y visitas.'],
  ['Marcas y startups en crecimiento', 'Software, productos y creadores que necesitan un mensaje claro, contenido constante y un embudo que convierta la atención en ventas.'],
  ['Negocios hispanohablantes', 'Marketing bilingüe para negocios que atienden clientes hispanos en Estados Unidos y en México.'],
];

// Real client work. Keep each line to what we actually did.
const WORK = [
  { name: 'Engentfy', en: ['Marketing consultant', 'Strategy, UGC video, social posts, newsletter, and Google and Meta ads.'], es: ['Consultor de marketing', 'Estrategia, video UGC, redes sociales, boletín, y anuncios en Google y Meta.'] },
  { name: 'Lugo’s Craft Distillery', en: ['Event promotion', 'Led the promotion for their Cards and Cocktails event, plus video editing.'], es: ['Promoción de eventos', 'Dirigimos la promoción de su evento Cards and Cocktails, más edición de video.'] },
  { name: 'Geros Studio', en: ['Brand & social', 'A six-year partnership in design, branding and social media presence.'], es: ['Marca y redes', 'Seis años de colaboración en diseño, marca y presencia en redes sociales.'] },
  { name: 'Feche Consulting', en: ['Business automation', 'Automation consulting on projects in the healthcare industry.'], es: ['Automatización', 'Consultoría de automatización en proyectos del sector salud.'] },
  { name: 'Riel Compliance Suite', en: ['Market strategy', 'Go-to-market strategy and work on government RFP opportunities.'], es: ['Estrategia de mercado', 'Estrategia de salida al mercado y trabajo en oportunidades de licitaciones.'] },
  { name: 'Dalitzandra Padial', en: ['Creator automation', 'Automated the back end of a women’s mentorship creator business.'], es: ['Automatización para creadora', 'Automatizamos la operación de un negocio de mentoría para mujeres.'] },
];

const FAQ = [
  ['How much does it cost?', 'It depends on what you need. Content and social media runs $500–$2,000/mo depending on your industry and how much content you need. Ads management is 20% of your monthly ad spend, with a $500/mo minimum. For example, $1,500 in ads is a $500 fee; $5,000 in ads is a $1,000 fee. Websites start at $1,500. Separately, our marketing software (SaaS) starts at $297/mo, and the $1,297/mo Scale plan includes consulting on the software itself. The Game Plan call is free, and you get a clear quote before anything starts.'],
  ['I’m not sure what I need. Where do I start?', 'Start with the free Game Plan call. We look at your business and tell you honestly what to fix first, even if the answer is something you can do yourself.'],
  ['Do I have to do the work?', 'No. We make the content, run the ads and build the systems. We need some time from you at the start to learn your business, then quick approvals along the way.'],
  ['How soon will I see results?', 'Fixes like automatic follow-up can help within weeks. Content and ads usually take a few months of testing to find what works. We will not promise numbers we cannot control.'],
  ['Do you only work with Orlando businesses?', 'No. We are based in Orlando, Florida and work with businesses across the United States and Mexico, in English and Spanish.'],
];
const FAQ_ES = [
  ['¿Cuánto cuesta?', 'Depende de lo que necesites. Contenido y redes sociales va de $500 a $2,000/mes según tu industria y cuánto contenido necesitas. El manejo de anuncios es el 20% de tu inversión mensual en anuncios, con un mínimo de $500/mes. Por ejemplo, $1,500 en anuncios es una tarifa de $500; $5,000 en anuncios es una tarifa de $1,000. Los sitios web empiezan en $1,500. Aparte, nuestro software de marketing (SaaS) empieza en $297/mes, y el plan Scale de $1,297/mes incluye consultoría sobre el software. La llamada del plan es gratis y recibes una cotización clara antes de empezar.'],
  ['No sé qué necesito. ¿Por dónde empiezo?', 'Empieza con la llamada gratis. Revisamos tu negocio y te decimos con honestidad qué arreglar primero, aunque sea algo que puedas hacer tú mismo.'],
  ['¿Tengo que hacer el trabajo yo?', 'No. Nosotros hacemos el contenido, manejamos los anuncios y montamos los sistemas. Necesitamos algo de tu tiempo al inicio para conocer tu negocio y aprobaciones rápidas en el camino.'],
  ['¿Cuándo veré resultados?', 'Cosas como el seguimiento automático pueden ayudar en semanas. El contenido y los anuncios suelen tomar unos meses de pruebas para encontrar lo que funciona. No prometemos números que no controlamos.'],
  ['¿Solo trabajan con negocios de Orlando?', 'No. Estamos en Orlando, Florida y trabajamos con negocios en Estados Unidos y México, en inglés y en español.'],
];

const OFFER = {
  en: {
    eyebrow: 'Start here',
    title: 'Your free Marketing Game Plan.',
    lede: 'One free 30-minute call. You leave with a 90-day marketing plan built for your business, whether you hire us or not.',
    getsTitle: 'What you get',
    gets: ['An honest look at your marketing today: what is working and what is not', 'The first things to fix, in order', 'A 90-day plan in three 30-day phases, with a weekly rhythm', 'A clear price if you want us to do it for you'],
    fine: 'No cost. No obligation. The plan is yours to keep.',
    cta: 'Book my free Game Plan',
    more: 'See what is in the plan',
  },
  es: {
    eyebrow: 'Empieza aquí',
    title: 'Tu Plan de Marketing gratis.',
    lede: 'Una llamada gratis de 30 minutos. Sales con un plan de marketing de 90 días hecho para tu negocio, nos contrates o no.',
    getsTitle: 'Lo que recibes',
    gets: ['Una mirada honesta a tu marketing hoy: qué funciona y qué no', 'Lo primero que hay que arreglar, en orden', 'Un plan de 90 días en tres fases de 30 días, con un ritmo semanal', 'Un precio claro si quieres que lo hagamos por ti'],
    fine: 'Sin costo. Sin compromiso. El plan es tuyo.',
    cta: 'Agenda mi plan gratis',
    more: 'Ver qué incluye el plan',
  },
};

const STEPS = [
  ['Free Game Plan call', '30 minutes. We look at your business, your numbers and what is holding growth back.'],
  ['Your 90-day plan', 'What to fix first, which channels to focus on, and the budget and targets for each month.'],
  ['We build and run it', 'Content, ads, website and automations, with a monthly check-in on results.'],
];
const STEPS_ES = [
  ['Llamada gratis del Plan', '30 minutos. Revisamos tu negocio, tus números y qué está frenando el crecimiento.'],
  ['Tu plan de 90 días', 'Qué arreglar primero, en qué canales enfocarte, y el presupuesto y las metas de cada mes.'],
  ['Lo construimos y operamos', 'Contenido, anuncios, sitio web y automatizaciones, con una revisión mensual de resultados.'],
];

const LOCAL = [
  { page: 'AIReceptionist', en: ['AI receptionist', 'Answers every call, books the appointment, texts back missed calls.'], es: ['Recepcionista con IA', 'Contesta cada llamada, agenda la cita y responde por texto las perdidas.'] },
  { page: 'ReputationAutopilot', en: ['Reviews on autopilot', 'Review requests, replies and monitoring, run for you.'], es: ['Reseñas en automático', 'Solicitudes, respuestas y monitoreo de reseñas, operados por nosotros.'] },
  { page: 'GrowCFL', en: ['Central Florida', 'Local SEO and follow-up systems for Orlando, Lakeland and Tampa businesses.'], es: ['Florida Central', 'SEO local y sistemas de seguimiento para negocios en Orlando, Lakeland y Tampa.'] },
];

// Cartoon David: the friendly face of the home page. Each section gets a pose
// that matches what it says. Decorative, so hidden from screen readers.
const POSES = {
  wave: { w: 391, h: 742 }, explain: { w: 418, h: 741 }, cool: { w: 290, h: 741 },
  point: { w: 368, h: 743 }, happy: { w: 290, h: 741 },
};
function Buddy({ pose, className }) {
  const { w, h } = POSES[pose];
  return (
    <Reveal y={18} className={['hm-buddy', `hm-buddy--${pose}`, className].filter(Boolean).join(' ')} aria-hidden="true">
      <img src={`/character/${pose}.webp`} alt="" width={w} height={h} loading="lazy" decoding="async" />
    </Reveal>
  );
}

function Monogram({ es }) {
  return (
    <figure className="hm-mark" aria-label={es ? 'El monograma de Loogo Labs' : 'The Loogo Labs monogram'}>
      <LivingMonogram fill="var(--paper-000)" bg="var(--ink-900)" delay={1.1} />
      <figcaption className="hm-mark__caption"><span>Loogo Labs</span><span>Orlando, FL</span></figcaption>
    </figure>
  );
}

function Hero({ es, children }) {
  const ref = React.useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const mounted = useMounted();
  const Inner = !mounted || reduce ? 'div' : motion.div;
  const props = !mounted || reduce ? {} : { style: { y, opacity, scale } };
  return (
    <section ref={ref} className="hm-hero">
      <div className="hm-hero__frame">
        <Inner className="hm-hero__grid" {...props}>{children}</Inner>
      </div>
      {mounted && !reduce && (
        <motion.div className="hm-hero__hint" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
          <span>{es ? 'Desliza' : 'Scroll'}</span><i />
        </motion.div>
      )}
    </section>
  );
}

function References() {
  const es = useLang() === 'es';
  const items = [
    ...REFERENCES.map((name) => ({ name, ...CLIENT_LOGOS[name], ...CLIENT_LOGOS[name]?.ticker })),
    ...CLIENT_WORDMARKS.map((name) => ({ name, wordmark: name.split(' - ')[0] })),
  ];
  return (
    <div className="ll-ticker-bar" role="region" aria-label={es ? 'Clientes seleccionados' : 'Selected clients'}>
      <div className="ll-ticker-label">{es ? 'Hemos trabajado con' : 'Work we have done for'}</div>
      <div className="ll-ticker-belt">
        <div className="ll-ticker-track">
          {[0, 1].map(copy => items.map((item) => (
            item.src ? (
              <span key={`${copy}-${item.name}`} aria-hidden={copy === 1 || undefined} className={`ll-ticker-logo${item.dark ? ' ll-ticker-logo--dark' : ''}${item.chip ? ' ll-ticker-logo--chip' : ''}${item.fill ? ' ll-ticker-logo--fill' : ''}`}>
                <img src={item.src} width={item.w} height={item.h} alt={copy === 0 ? item.name : ''} loading="lazy" style={item.th ? { height: item.th } : undefined} />
                {item.caption && <span className="ll-ticker-logo__cap">{item.caption}</span>}
              </span>
            ) : (
              <span key={`${copy}-${item.name}`} aria-hidden={copy === 1 || undefined} className="ll-ticker-ref">{item.wordmark || item.name}</span>
            )
          )))}
        </div>
      </div>
    </div>
  );
}

function useMedia(q) {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

// Accordion version: phones, reduced motion, and the server render.
function Accordion({ es, items }) {
  const [open, setOpen] = React.useState(0);
  return (
    <ul className="hm-acc">
      {items.map((s, i) => {
        const on = open === i;
        return (
          <li key={s.title}>
            <button type="button" className="hm-acc__btn" aria-expanded={on} aria-controls={`svc-${i}`} onClick={() => setOpen(on ? -1 : i)}>
              <span className="hm-acc__num">0{i + 1}</span>
              <span className="hm-acc__title">{s.title}</span>
              <span className="hm-acc__icon" aria-hidden="true" />
            </button>
            <div id={`svc-${i}`} className="hm-acc__panel" data-open={on} aria-hidden={!on}>
              <div className="hm-acc__inner">
                <div className="hm-acc__body">
                  <p>{s.summary}</p>
                  <ul className="hm-gets">{s.gets.map(g => <li key={g}>{g}</li>)}</ul>
                  <div className="hm-price"><span className="hm-price__k">{es ? 'Inversión' : 'Pricing'}</span><strong>{s.price}</strong><Button variant="primary" size="md" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Hablemos' : "Let's talk"}</Button></div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Pinned scroll scene: the viewport locks while the four services advance.
function Scene({ es, items }) {
  const pkHref = useHref()(pathForPage('Packages'));
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [built, setBuilt] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = v * items.length;
    const i = Math.min(items.length - 1, Math.floor(raw));
    if (i !== active) setActive(i);
    // Within each step: first half draws the plan (outline), second half fills the build.
    const local = Math.min(1, Math.max(0, raw - i));
    const b = Math.min(1, Math.max(0, (local - 0.35) / 0.45));
    if (Math.abs(b - built) > 0.01) setBuilt(b);
  });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const s = items[active];
  const jump = (i) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (h * (i + 0.5)) / items.length, behavior: 'smooth' });
  };
  return (
    <div ref={ref} className="hm-scene" style={{ height: `${items.length * 90 + 10}vh` }}>
      <div className="hm-scene__pin">
        <div className="hm-wrap hm-scene__grid">
          <div className="hm-scene__left">
            <span className="ll-label">{es ? 'Qué hacemos' : 'What we do'}</span>
            <h2 className="hm-scene__h2">{es ? 'Luego hacemos el trabajo. Elige lo que necesitas.' : 'Then we do the work. Pick what you need.'}</h2>
            <ol className="hm-scene__nav">
              {items.map((it, i) => (
                <li key={it.title}>
                  <button type="button" className={i === active ? 'on' : ''} onClick={() => jump(i)} aria-current={i === active ? 'step' : undefined}>
                    <span>0{i + 1}</span>{it.title}
                  </button>
                </li>
              ))}
            </ol>
            <div className="hm-scene__bar" aria-hidden="true"><motion.span style={{ width: bar }} /></div>
            <a className="hm-allpk" href={pkHref}>{es ? 'Ver todos los paquetes y precios' : 'See all packages & pricing'} →</a>
            <Buddy pose="explain" className="hm-buddy--scene" />
          </div>
          <div className="hm-scene__right">
            <AnimatePresence mode="wait">
              <motion.div key={active} className="hm-scene__card"
                initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}>
                <div className="hm-scene__glyph"><ServiceGlyph index={active} built={built} size={150} fill="var(--ink-900)" stroke="var(--amber-500)" /></div>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <ul className="hm-gets">{s.gets.map(g => <li key={g}>{g}</li>)}</ul>
                  <div className="hm-price"><span className="hm-price__k">{es ? 'Inversión' : 'Pricing'}</span><strong>{s.price}</strong><Button variant="primary" size="md" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Hablemos' : "Let's talk"}</Button></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Explorer({ es }) {
  const pkHref = useHref()(pathForPage('Packages'));
  const items = es ? SERVICES_ES : SERVICES;
  const reduce = useReducedMotion();
  const wide = useMedia('(min-width: 961px)');
  if (wide && !reduce) return <section id="services"><Scene es={es} items={items} /></section>;
  return (
    <Wrap className="hm-section" id="services">
      <div className="hm-plan">
        <div className="hm-plan__head hm-has-buddy">
          <Buddy pose="explain" />
          <SectionHeading
            eyebrow={es ? 'Qué hacemos' : 'What we do'}
            title={es ? 'Luego hacemos el trabajo. Elige lo que necesitas.' : 'Then we do the work. Pick what you need.'}
            description={es ? 'Cuatro servicios, cada uno con lo que incluye y su precio. Toca uno para verlo.' : 'Four services, each with what is included and what it costs. Tap one to see it.'} />
        </div>
        <Accordion es={es} items={items} />
        <a className="hm-allpk" href={pkHref}>{es ? 'Ver todos los paquetes y precios' : 'See all packages & pricing'} →</a>
      </div>
    </Wrap>
  );
}

function StickyCta({ es }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const hero = document.querySelector('.hm-hero');
    if (!hero || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`hm-sticky${on ? ' on' : ''}`} aria-hidden={!on}>
      <Button variant="primary" size="lg" onClick={openBooking} tabIndex={on ? 0 : -1}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button>
    </div>
  );
}

function Home({ onNavigate }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  // Phones: same animations, about 30% quicker, and blocks start revealing as
  // soon as they peek in, so nobody waits on text while scrolling.
  const phone = useMedia('(max-width: 767px)');
  return (
    <MotionPace pace={phone ? 0.7 : 1} amount={phone ? 0.12 : null}>
    <main>
      <Hero es={es}>
            <div className="hm-hero__copy">
              <Reveal y={10}><span className="hm-hero__kicker ll-label">{es ? 'Marketing y automatización · Orlando, FL' : 'Marketing & automation · Orlando, FL'}</span></Reveal>
              <h1 className="hm-hero__title">
                <Words text={es ? 'Tú manejas el negocio.' : 'You run the business.'} delay={0.1} step={0.07} />{' '}
                <Words as="em" text={es ? 'Nosotros traemos los clientes.' : 'We bring the customers.'} delay={0.5} step={0.07} />
              </h1>
              <Reveal delay={0.9} y={10}><span className="hm-hero__sub ll-label">{es ? 'Estrategia · Contenido · Anuncios · Sitios web · Automatización' : 'Strategy · Content · Ads · Websites · Automation'}</span></Reveal>
              <Reveal delay={1.0} y={16}>
              <p className="hm-hero__lede">
                {es
                  ? 'Loogo Labs es un equipo de marketing en Orlando. Planeamos tu marketing, hacemos el contenido, manejamos los anuncios y montamos el seguimiento, para que más gente te encuentre, te llame y te compre. En inglés y en español.'
                  : 'Loogo Labs is a marketing team in Orlando. We plan your marketing, make the content, run the ads and set up the follow-up, so more people find you, call you and buy from you. In English and Spanish.'}
              </p>
              <ul className="hm-hero__checks">
                {(es ? ['Plan de 90 días gratis', 'Precios claros', 'Inglés y español'] : ['Free 90-day Game Plan', 'Clear pricing', 'English & Spanish']).map(t => <li key={t}>{t}</li>)}
              </ul>
              </Reveal>
              <Reveal delay={1.15} y={16}>
              <div className="hm-hero__actions">
                <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Obtén tu plan gratis' : 'Get your free Game Plan'}</Button></Magnetic>
                <Button variant="ghost" size="md" iconRight={<span>→</span>} onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{es ? 'Ver nuestros servicios' : 'See our services'}</Button>
              </div>
              </Reveal>
            </div>
            <div className="hm-hero__side">
              <div className="hm-hero__mark" aria-hidden="true"><LivingMonogram fill="var(--ink-900)" bg="var(--paper-200)" delay={1.1} /></div>
              <figure className="hm-hero__founder hm-hero__founder--toon">
                <img src="/character/wave.webp" alt={es ? 'Ilustración de David Selva, fundador de Loogo Labs, saludando' : 'Illustration of David Selva, founder of Loogo Labs, waving hello'} width="391" height="742" fetchpriority="high" />
                <figcaption><strong>David Selva</strong><span>{es ? 'Fundador' : 'Founder'}</span></figcaption>
              </figure>
            </div>
      </Hero>

      <References />

      <Wrap className="hm-section hm-offer-wrap">
        {(() => { const o = es ? OFFER.es : OFFER.en; return (
          <Reveal className="hm-offer">
            <div className="hm-offer__main">
              <span className="hm-offer__eyebrow">{o.eyebrow}</span>
              <h2>{o.title}</h2>
              <p>{o.lede}</p>
              <div className="hm-offer__actions">
                <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{o.cta}</Button></Magnetic>
                <a href={toHref(pathForPage('GamePlan'))} onClick={e => { e.preventDefault(); onNavigate('GamePlan'); }}>{o.more} →</a>
              </div>
            </div>
            <div className="hm-offer__side">
              <span className="hm-offer__k">{o.getsTitle}</span>
              <ul>{o.gets.map(g => <li key={g}>{g}</li>)}</ul>
              <p className="hm-offer__fine">{o.fine}</p>
            </div>
          </Reveal>
        ); })()}
      </Wrap>

      <section className="hm-pain ll-band ll-band--tan">
        <Wrap>
          <Reveal>
            <SectionHeading eyebrow={es ? '¿Te suena familiar?' : 'Sound familiar?'}
              title={es ? 'Lo que nos dicen los dueños de negocio, y lo que hacemos al respecto.' : 'What business owners tell us, and what we do about it.'} />
          </Reveal>
          <Stagger className="hm-pain__grid" gap={0.1}>
            {(es ? PROBLEMS_ES : PROBLEMS).map(pr => (
              <Item key={pr.q} className="hm-pain__card">
                <p className="hm-pain__q">“{pr.q}”</p>
                <p className="hm-pain__fix">{pr.fix}</p>
                <button type="button" className="hm-pain__link" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{pr.svcName} →</button>
              </Item>
            ))}
          </Stagger>
        </Wrap>
      </section>

      <Explorer es={es} />

      <Wrap className="hm-section">
        <Reveal>
          <SectionHeading eyebrow={es ? 'A quién ayudamos' : 'Who we help'}
            title={es ? 'Hecho para negocios que quieren crecer sin contratar un equipo de marketing.' : 'Built for businesses that want to grow without hiring a marketing team.'} />
        </Reveal>
        <Stagger className="hm-who" gap={0.1}>
          {(es ? WHO_ES : WHO).map(([k, v]) => (
            <Item key={k} className="hm-who__item"><h3>{k}</h3><p>{v}</p></Item>
          ))}
        </Stagger>
      </Wrap>

      <section className="hm-work ll-band ll-band--tan">
        <Wrap>
          <Reveal>
            <SectionHeading eyebrow={es ? 'Nuestro trabajo' : 'Our work'}
              title={es ? 'Lo que hemos hecho para nuestros clientes.' : 'What we have done for our clients.'} />
          </Reveal>
          <Stagger className="hm-work__grid" gap={0.08}>
            {WORK.map(w => {
              const logo = CLIENT_LOGOS[w.name]?.ticker;
              const [k, v] = es ? w.es : w.en;
              return (
                <Item key={w.name} className="hm-work__card">
                  <div className="hm-work__logo">{logo ? <img src={logo.src} alt={w.name} width={logo.w} height={logo.h} loading="lazy" style={{ height: Math.min(logo.th, 32) }} /> : <span>{w.name}</span>}</div>
                  <span className="hm-work__k">{k}</span>
                  <p>{v}</p>
                </Item>
              );
            })}
          </Stagger>
        </Wrap>
      </section>

      <Wrap className="hm-section">
        <Reveal>
          <SectionHeading eyebrow={es ? 'Cómo funciona' : 'How it works'}
            title={es ? 'De la primera llamada a resultados, en tres pasos.' : 'From first call to results, in three steps.'} />
        </Reveal>
        <Stagger as="ol" className="hm-steps" gap={0.12}>
          {(es ? STEPS_ES : STEPS).map(([k, v], i) => (
            <Item key={k} as="li" className="hm-steps__item"><span className="hm-steps__num">0{i + 1}</span><h3>{k}</h3><p>{v}</p></Item>
          ))}
        </Stagger>
      </Wrap>

      <Wrap className="hm-section">
        <div className="hm-faq">
          <Reveal>
            <SectionHeading eyebrow={es ? 'Preguntas frecuentes' : 'Questions'}
              title={es ? 'Lo que la gente pregunta antes de llamarnos.' : 'What people ask before they call.'} />
          </Reveal>
          <div className="hm-faq__list">
            {(es ? FAQ_ES : FAQ).map(([q, a], i) => (
              <details key={q} className="hm-faq__item" open={i === 0}>
                <summary>{q}<span aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Wrap>

      <Wrap className="hm-section">
        <div className="hm-local">
          <div className="hm-has-buddy">
          <Reveal>
          <SectionHeading eyebrow={es ? 'Para negocios locales' : 'For local businesses'}
            title={es ? 'Sistemas listos para negocios de servicio.' : 'Ready-made systems for service businesses.'}
            description={es ? '¿Prefieres empezar con algo puntual? Estos sistemas se configuran rápido y los operamos por ti.' : 'Want to start with one thing? These systems set up fast and we run them for you.'} />
          </Reveal>
          <Buddy pose="point" />
          </div>
          <Stagger as="ul" className="hm-local__links" gap={0.1}>
            {LOCAL.map(l => {
              const [t, d] = es ? l.es : l.en;
              return (
                <Item key={l.page} as="li">
                  <a href={toHref(pathForPage(l.page))} onClick={e => { e.preventDefault(); onNavigate(l.page); }}>
                    <strong>{t}</strong><span>{d}</span><em aria-hidden="true">→</em>
                  </a>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </Wrap>

      <NewsletterSignup variant="band" source="home" />

      <section className="hm-cta ll-band" style={{ position: 'relative', overflow: 'hidden' }}>
        <AmbientShape index={3} className="hm-cta__shape" />
        <Wrap style={{ position: 'relative' }}>
          <div className="hm-cta__grid hm-has-buddy">
            <Buddy pose="happy" />
            <Reveal>
              <h2>{es ? 'Cuéntanos qué quieres que crezca.' : 'Tell us what you want to grow.'}</h2>
              <p>{es ? 'Una llamada gratis de 30 minutos. Revisamos dónde estás, qué está frenando el crecimiento y te llevas un plan de marketing de 90 días. Sin compromiso.' : 'A free 30-minute call. We look at where you are and what is holding growth back, and you leave with a 90-day marketing game plan. No commitment.'}</p>
            </Reveal>
            <Reveal className="hm-cta__side" delay={0.15}>
              <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button></Magnetic>
              <a href={`mailto:${SITE.email}`}>{es ? '¿Prefieres escribir? ' : 'Rather write? '}{SITE.email}</a>
            </Reveal>
          </div>
        </Wrap>
      </section>

      <StickyCta es={es} />
    </main>
    </MotionPace>
  );
}

export default Home;
