import React from 'react';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import { openBooking } from '../lib/booking';
import { SITE, pathForPage } from '../lib/seo';
import { REFERENCES, CLIENT_LOGOS, CLIENT_WORDMARKS } from '../lib/references';
import { useHref, useLang } from '../lib/i18n';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Reveal, Stagger, Item, Words, Parallax, Magnetic, MotionPace, EASE, useMounted } from '../lib/motion';
import { loadPosts, cachedPosts } from '../lib/postsCache';
import { categoryOf, BLOG_CATEGORY_BY_SLUG } from '../lib/blogCategories';
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

const WORK = [
  { name: 'Engentfy', en: ['Marketing consultant', 'Strategy, UGC video, social posts, newsletter, and Google and Meta ads.'], es: ['Consultor de marketing', 'Estrategia, video UGC, redes sociales, boletín, y anuncios en Google y Meta.'] },
  { name: 'Lugo’s Craft Distillery', en: ['Event promotion', 'Led the promotion for their Cards and Cocktails event, plus video editing.'], es: ['Promoción de eventos', 'Dirigimos la promoción de su evento Cards and Cocktails, más edición de video.'] },
  { name: 'Geros Studio', en: ['Brand & social', 'A six-year partnership in design, branding and social media presence.'], es: ['Marca y redes', 'Seis años de colaboración en diseño, marca y presencia en redes sociales.'] },
  { name: 'Feche Consulting', en: ['Business automation', 'Automation consulting on projects in the healthcare industry.'], es: ['Automatización', 'Consultoría de automatización en proyectos del sector salud.'] },
  { name: 'Riel Compliance Suite', en: ['Market strategy', 'Go-to-market strategy and work on government RFP opportunities.'], es: ['Estrategia de mercado', 'Estrategia de salida al mercado y trabajo en oportunidades de licitaciones.'] },
  { name: 'Dalitzandra Padial', en: ['Creator automation', 'Automated the back end of a women’s mentorship creator business.'], es: ['Automatización para creadora', 'Automatizamos la operación de un negocio de mentoría para mujeres.'] },
];

const STEPS = [
  ['Free Game Plan call', 'A free 30-minute call. We look at your business, your numbers and what is holding growth back. No obligation.'],
  ['Your 90-day plan', 'What to fix first, which channels to focus on, and the budget and targets for each month.'],
  ['We build and run it', 'Content, ads, website and automations, with a monthly check-in on results.'],
];
const STEPS_ES = [
  ['Llamada gratis del Plan', 'Una llamada gratis de 30 minutos. Revisamos tu negocio, tus números y qué está frenando el crecimiento. Sin compromiso.'],
  ['Tu plan de 90 días', 'Qué arreglar primero, en qué canales enfocarte, y el presupuesto y las metas de cada mes.'],
  ['Lo construimos y operamos', 'Contenido, anuncios, sitio web y automatizaciones, con una revisión mensual de resultados.'],
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

// Swipe carousel: phones, tablets, reduced motion and the server render.
// Every card shows everything (what you get, price, CTA), so nothing hides behind a "+".
function Carousel({ es, items }) {
  const track = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const onScroll = () => {
    const el = track.current; if (!el) return;
    const card = el.firstElementChild; if (!card) return;
    const step = card.getBoundingClientRect().width + 16;
    const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
    if (i !== active) setActive(i);
  };
  const go = (i) => {
    const el = track.current; if (!el) return;
    const card = el.children[Math.max(0, Math.min(items.length - 1, i))];
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };
  return (
    <div className="hm-car">
      <div className="hm-car__bar">
        <span className="hm-car__count">0{active + 1} <i>/ 0{items.length}</i></span>
        <span className="hm-car__hint" aria-hidden="true">{es ? 'Desliza' : 'Swipe'} →</span>
        <div className="hm-car__arrows">
          <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label={es ? 'Anterior' : 'Previous'}>←</button>
          <button type="button" onClick={() => go(active + 1)} disabled={active === items.length - 1} aria-label={es ? 'Siguiente' : 'Next'}>→</button>
        </div>
      </div>
      <div ref={track} className="hm-car__track" onScroll={onScroll} role="region" aria-label={es ? 'Servicios' : 'Services'}>
        {items.map((s, i) => (
          <article key={s.title} className={`hm-car__card${i === active ? ' on' : ''}`} aria-roledescription="slide" aria-label={`${i + 1} / ${items.length}`}>
            <div className="hm-car__head">
              <span className="hm-car__num">0{i + 1}</span>
              <div className="hm-car__glyph" aria-hidden="true"><ServiceGlyph index={i} built={1} size={56} fill="var(--ink-900)" stroke="var(--amber-500)" /></div>
            </div>
            <h3>{s.title}</h3>
            <p>{s.summary}</p>
            <ul className="hm-gets">{s.gets.map(g => <li key={g}>{g}</li>)}</ul>
            
          </article>
        ))}
      </div>
      <div className="hm-car__dots">
        {items.map((s, i) => <button key={s.title} type="button" className={i === active ? 'on' : ''} onClick={() => go(i)} aria-label={s.title} aria-current={i === active || undefined} />)}
      </div>
    </div>
  );
}

// Pinned scroll scene: the viewport locks while the four services advance.
function Scene({ es, items, onNavigate }) {
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
            <h2 className="hm-scene__h2">{es ? 'Cuatro formas en que te ayudamos a crecer.' : 'Four ways we help you grow.'}</h2>
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
            <a className="hm-btn-outline" href={pkHref} onClick={e => { e.preventDefault(); onNavigate('Packages'); window.scrollTo(0, 0); }}>{es ? 'Ver todos los precios' : 'See full pricing'} <span aria-hidden="true">→</span></a>
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
                  
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Explorer({ es, onNavigate }) {
  const pkHref = useHref()(pathForPage('Packages'));
  const items = es ? SERVICES_ES : SERVICES;
  const reduce = useReducedMotion();
  const wide = useMedia('(min-width: 961px)');
  if (wide && !reduce) return <section id="services"><Scene es={es} items={items} onNavigate={onNavigate} /></section>;
  return (
    <Wrap className="hm-section" id="services">
      <div className="hm-plan hm-plan--car">
        <div className="hm-plan__head hm-has-buddy">
          <Buddy pose="explain" />
          <SectionHeading
            eyebrow={es ? 'Qué hacemos' : 'What we do'}
            title={es ? 'Cuatro formas en que te ayudamos a crecer.' : 'Four ways we help you grow.'}
            description={es ? 'Lo que incluye cada servicio. Desliza para ver cada uno.' : 'What each service includes. Swipe to see each one.'} />
        </div>
        <Carousel es={es} items={items} />
        <a className="hm-btn-outline" href={pkHref} onClick={e => { e.preventDefault(); onNavigate('Packages'); window.scrollTo(0, 0); }}>{es ? 'Ver todos los precios' : 'See full pricing'} <span aria-hidden="true">→</span></a>
      </div>
    </Wrap>
  );
}

function Journal({ es, onNavigate }) {
  const toHref = useHref();
  const [posts, setPosts] = React.useState(() => cachedPosts() || []);
  React.useEffect(() => { let on = true; loadPosts().then(p => { if (on) setPosts(p || []); }); return () => { on = false; }; }, []);
  if (!posts.length) return null;
  const [lead, ...rest] = posts.slice(0, 4);
  const fmt = (d) => (d ? new Date(d).toLocaleDateString(es ? 'es-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
  const cat = (p) => { const c = BLOG_CATEGORY_BY_SLUG.get(categoryOf(p)); return c ? (es ? c.nameEs : c.name) : (es ? 'Artículo' : 'Article'); };
  const href = (p) => toHref(pathForPage('BlogPost', p.slug));
  const open = (p) => (e) => { e.preventDefault(); onNavigate('BlogPost', p.slug); };
  return (
    <section className="hm-blog">
      <Wrap>
        <div className="hm-blog__head">
          <Reveal>
            <SectionHeading eyebrow={es ? 'Del blog' : 'From the blog'}
              title={es ? 'Lo que estamos aprendiendo sobre IA y marketing.' : 'What we are learning about AI and marketing.'} />
          </Reveal>
          <a className="hm-btn-outline" href={toHref(pathForPage('LoogoNews'))} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }}>{es ? 'Ver todos los artículos' : 'All articles'} <span aria-hidden="true">→</span></a>
        </div>
        <div className="hm-blog__grid">
          <Reveal className="hm-blog__lead">
            <a href={href(lead)} onClick={open(lead)}>
              <span className="hm-blog__tag">{es ? 'Lo más reciente' : 'Latest'} · {cat(lead)}</span>
              <h3>{lead.title}</h3>
              {lead.excerpt && <p>{lead.excerpt}</p>}
              <span className="hm-blog__meta">{fmt(lead.published_at)}{lead.read_time ? ` · ${lead.read_time} ${es ? 'min de lectura' : 'min read'}` : ''}</span>
              <span className="hm-blog__read">{es ? 'Leer artículo' : 'Read the article'} <span aria-hidden="true">→</span></span>
            </a>
          </Reveal>
          <Stagger as="ol" className="hm-blog__list" gap={0.08}>
            {rest.map((p, i) => (
              <Item key={p.slug} as="li">
                <a href={href(p)} onClick={open(p)}>
                  <span className="hm-blog__num" aria-hidden="true">0{i + 2}</span>
                  <span className="hm-blog__body">
                    <span className="hm-blog__cat">{cat(p)}</span>
                    <strong>{p.title}</strong>
                    <span className="hm-blog__meta">{fmt(p.published_at)}{p.read_time ? ` · ${p.read_time} min` : ''}</span>
                  </span>
                  <span className="hm-blog__arrow" aria-hidden="true">→</span>
                </a>
              </Item>
            ))}
          </Stagger>
        </div>
        <a className="hm-btn-outline hm-blog__more" href={toHref(pathForPage('LoogoNews'))} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }}>{es ? 'Ver todos los artículos' : 'All articles'} <span aria-hidden="true">→</span></a>
      </Wrap>
    </section>
  );
}

// How we work: the section pins while the three steps switch in place, so it
// takes a short scroll instead of a long list. Reduced motion gets the list.
function HowWeWork({ es, onNavigate }) {
  const toHref = useHref();
  const steps = es ? STEPS_ES : STEPS;
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length * 0.999)));
    if (i !== active) setActive(i);
  });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const heading = (
    <SectionHeading eyebrow={es ? 'Cómo trabajamos' : 'How we work'}
      title={es ? 'Empieza con una conversación, no con un contrato.' : 'It starts with a conversation, not a contract.'} />
  );
  const cta = (
    <a className="hm-btn-outline" href={toHref(pathForPage('GamePlan'))} onClick={e => { e.preventDefault(); onNavigate('GamePlan'); }}>{es ? 'Qué incluye el Plan de Marketing gratis' : 'What is in the free Marketing Game Plan'} <span aria-hidden="true">→</span></a>
  );
  if (!mounted || reduce) {
    return (
      <Wrap className="hm-section">
        <Reveal>{heading}</Reveal>
        <ol className="hm-flow">
          {steps.map(([k, v], i) => (
            <li key={k} className={`hm-flow__step${i === 0 ? ' hm-flow__step--first' : ''}`}>
              <span className="hm-flow__num" aria-hidden="true">{i + 1}</span><h3>{k}</h3><p>{v}</p>
            </li>
          ))}
        </ol>
        <div className="hm-flow__cta">{cta}</div>
      </Wrap>
    );
  }
  const jump = (i) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (h * (i + 0.5)) / steps.length, behavior: 'smooth' });
  };
  const [k, v] = steps[active];
  return (
    <section ref={ref} className="hm-hww" style={{ height: `calc(100vh + ${steps.length * 38}vh)` }}>
      <div className="hm-hww__pin">
        <div className="hm-wrap hm-hww__inner">
          {heading}
          <div className="hm-hww__rail" role="tablist" aria-label={es ? 'Pasos' : 'Steps'}>
            <div className="hm-hww__track" aria-hidden="true"><motion.span style={{ width: fill }} /></div>
            {steps.map(([t], i) => (
              <button key={t} type="button" role="tab" aria-selected={i === active} className={`hm-hww__dot${i <= active ? ' done' : ''}${i === active ? ' on' : ''}`} onClick={() => jump(i)}>
                <span>{i + 1}</span><em>{t}</em>
              </button>
            ))}
          </div>
          <div className="hm-hww__stage" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={active} className="hm-hww__card"
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.38, ease: EASE }}>
                <span className="hm-hww__big" aria-hidden="true">0{active + 1}</span>
                <div>
                  <span className="hm-hww__step">{es ? `Paso ${active + 1} de ${steps.length}` : `Step ${active + 1} of ${steps.length}`}</span>
                  <h3>{k}</h3>
                  <p>{v}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="hm-hww__cta">{cta}</div>
        </div>
      </div>
    </section>
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
              </Reveal>
              <Reveal delay={1.15} y={16}>
              <div className="hm-hero__actions">
                <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free strategy call'}</Button></Magnetic>
                <Button variant="ghost" size="md" iconRight={<span>→</span>} onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>{es ? 'Qué hacemos' : 'What we do'}</Button>
              </div>
              </Reveal>
            </div>
            <div className="hm-hero__side">
              <div className="hm-hero__mark" aria-hidden="true"><LivingMonogram fill="var(--ink-900)" bg="var(--paper-200)" delay={1.1} /></div>
            </div>
      </Hero>

      <References />

      <Wrap className="hm-section hm-intro">
        <Reveal>
          <p className="hm-intro__text">
            {es
              ? <>Somos una compañía de marketing y automatización en Orlando. Trabajamos con <em>negocios locales y marcas en crecimiento</em> en todo Estados Unidos, en inglés y en español: planeamos el marketing, hacemos el contenido, manejamos los anuncios y construimos los sistemas detrás.</>
              : <>We are a marketing and automation company in Orlando. We work with <em>local businesses and growing brands</em> across the United States, in English and Spanish: we plan the marketing, make the content, run the ads and build the systems behind it.</>}
          </p>
        </Reveal>
        <Stagger as="dl" className="hm-facts" gap={0.08}>
          {(es
            ? [['Base', 'Orlando, Florida'], ['Mercado', 'Estados Unidos'], ['Idiomas', 'Inglés y español'], ['Enfoque', 'Marketing con IA y automatización']]
            : [['Based in', 'Orlando, Florida'], ['Market', 'United States'], ['Languages', 'English & Spanish'], ['Focus', 'AI marketing & automation']]
          ).map(([k, v]) => <Item key={k} className="hm-facts__item"><dt>{k}</dt><dd>{v}</dd></Item>)}
        </Stagger>
      </Wrap>

      <Explorer es={es} onNavigate={onNavigate} />

      <section className="hm-work ll-band ll-band--tan">
        <Wrap>
          <Reveal>
            <SectionHeading eyebrow={es ? 'Trabajo seleccionado' : 'Selected work'}
              title={es ? 'Algunas de las marcas con las que hemos trabajado.' : 'Some of the brands we have worked with.'} />
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

      <HowWeWork es={es} onNavigate={onNavigate} />

      <section className="hm-founder-band">
        <Wrap>
          <Reveal className="hm-founder2">
            <span className="hm-founder2__label">{es ? 'El fundador' : 'The founder'}</span>
            <blockquote>
              {es
                ? '“He pasado mi carrera construyendo sistemas que hacen que las cosas realmente se cumplan. Loogo Labs es eso aplicado al marketing: escribimos el plan, construimos lo que necesita y nos quedamos para operarlo.”'
                : '“I have spent my career building systems that make things actually get done. Loogo Labs is that applied to marketing: we write the plan, build what it needs and stay to run it.”'}
            </blockquote>
            <div className="hm-founder2__foot">
              <div className="hm-founder2__sig"><strong>David Selva</strong><span>{es ? 'Fundador, Loogo Labs LLC' : 'Founder, Loogo Labs LLC'}</span></div>
              <a className="hm-btn-outline hm-btn-outline--light" href={toHref(pathForPage('About'))} onClick={e => { e.preventDefault(); onNavigate('About'); }}>{es ? 'Conoce al fundador' : 'Meet the founder'} <span aria-hidden="true">→</span></a>
            </div>
          </Reveal>
        </Wrap>
      </section>

      <Journal es={es} onNavigate={onNavigate} />

      <section className="hm-glasscta">
        <div className="hm-glasscta__light" aria-hidden="true"><i /><i /><i /></div>
        <Wrap>
          <div className="hm-glasscta__panel">
            <Reveal className="hm-glasscta__copy">
              <h2>{es ? 'Cuéntanos qué quieres que crezca.' : 'Tell us what you want to grow.'}</h2>
              <p>{es ? 'Una llamada gratis de 30 minutos. Revisamos dónde estás, qué está frenando el crecimiento y te llevas un plan de marketing de 90 días. Sin compromiso.' : 'A free 30-minute call. We look at where you are and what is holding growth back, and you leave with a 90-day marketing game plan. No commitment.'}</p>
            </Reveal>
            <Reveal className="hm-glasscta__side" delay={0.12}>
              <Magnetic><Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</Button></Magnetic>
              <a href={`mailto:${SITE.email}`}>{es ? '¿Prefieres escribir? ' : 'Rather write? '}{SITE.email}</a>
            </Reveal>
          </div>
        </Wrap>
      </section>
    </main>
    </MotionPace>
  );
}

export default Home;
