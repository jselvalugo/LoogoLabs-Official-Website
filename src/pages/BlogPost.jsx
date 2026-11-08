import React from 'react';
import { BOOKING_URL } from '../lib/booking';
import { trackSchedule } from '../lib/metaEvents';
import { BLOG_INDEX, applyHead, headForPost } from '../lib/seo';
import { EVENT_THEME, isEventPost } from '../lib/featuredEvent';
import { partnerForPost, partnerHref } from '../lib/partners';
import PartnerRail from '../components/blog/PartnerRail';
import { useHref, useLang } from '../lib/i18n';
import { BLOG_CATEGORY_BY_SLUG, categoryOf, categoryPageKey, categoryPath, relatedPosts } from '../lib/blogCategories';
import { TOOL_BY_PAGE, toolPath } from '../lib/tools';
import { loadPosts } from '../lib/postsCache';
import { hasConsent } from '../lib/cookieConsent';
import { ArrowLeft, ArrowRight, Star, Wrench, X } from '@phosphor-icons/react';
import '../styles/pages/blog.css';

export default function BlogPost({ slug, onNavigate }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [allPosts, setAllPosts] = React.useState([]);
  React.useEffect(() => { loadPosts().then(setAllPosts); }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  React.useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/.netlify/functions/get-post?slug=${encodeURIComponent(slug)}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(data => {
        if (data) {
          setPost(data);
          // One counted view per slug per browser session; reloading or
          // re-reading the same post in this tab shouldn't inflate the count.
          // Gated on the Analytics cookie category: no consent, no request.
          if (hasConsent('analytics')) {
            const viewedKey = `ll_viewed_${slug}`;
            try {
              if (!sessionStorage.getItem(viewedKey)) {
                sessionStorage.setItem(viewedKey, '1');
                fetch('/.netlify/functions/track-view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
              }
            } catch {
              // sessionStorage unavailable (private mode, etc.) — fall back to counting every load.
              fetch('/.netlify/functions/track-view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Title, description, canonical and BlogPosting schema all come from the post
  // body, so they can only be set once it has loaded. Until then the pre-rendered
  // tags from the static shell stand.
  React.useEffect(() => {
    if (loading) return;
    applyHead(headForPost(notFound ? null : post));
  }, [loading, notFound, post]);

  if (loading) {
    return (
      <div className="lb-page" role="main">
        <div className="lb-wrap lb-post-state" role="status" aria-live="polite">
          <span className="lb-skel lb-skel--hero" />
          <span className="lb-skel lb-skel--line" />
          <span className="lb-skel lb-skel--line lb-skel--short" />
          <span className="lb-visually-hidden">{es ? 'Cargando artículo' : 'Loading post'}</span>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="lb-page" role="main">
        <div className="lb-wrap lb-post-state">
          <div className="lb-notfound ll-glass">
            <span className="lb-empty__kicker">404</span>
            <h1 className="lb-notfound__title">{es ? 'Artículo no encontrado.' : 'Post not found.'}</h1>
            <a href={toHref(BLOG_INDEX)} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--pill">
              <ArrowLeft size={14} weight="bold" aria-hidden="true" /> {es ? 'Volver a Industry LoogoBlog' : 'Back to Industry LoogoBlog'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString(es ? 'es-US' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const event = isEventPost(post);
  const partner = event ? null : partnerForPost(post);
  const cat = BLOG_CATEGORY_BY_SLUG.get(categoryOf(post));
  const catLabel = es ? cat.nameEs : cat.name;
  const goCategory = e => { e.preventDefault(); onNavigate(categoryPageKey(cat.slug)); };
  const related = relatedPosts(post, allPosts, 3);
  const tool = cat.tool ? TOOL_BY_PAGE.get(cat.tool) : null;
  const headings = headingsOf(post.content);
  // The reading rail (table of contents + related) sits beside ordinary posts on
  // wide screens; partner and event posts already use that column.
  const rail = !event && !partner && (headings.length > 1 || related.length > 0);

  const cta = (
    <div className="lb-cta ll-forest">
      <h3 className="lb-cta__title">{event
        ? <><span className="lb-cta__long">{es ? 'Aparta tu lugar. La entrada es gratis.' : 'Save your spot. It is free to attend.'}</span><span className="lb-cta__short">{es ? 'Cards & Cocktails · Gratis · 14 nov.' : <>Cards &amp; Cocktails · Free · Nov 14</>}</span></>
        : (es ? '¿Quieres esto funcionando en tu negocio?' : 'Want this running in your business?')}</h3>
      <p className="lb-cta__text">
        {event
          ? (es ? 'Consigue un boleto gratis (con un pin coleccionable) o un pase VIP de acceso anticipado de $25 en Eventbrite. Niños bienvenidos, mocktails incluidos.' : 'Grab a free ticket (with a collectible pin) or a $25 VIP early-access pass on Eventbrite. Kids welcome, mocktails included.')
          : (es ? 'Lo configuramos, lo operamos y lo optimizamos cada mes. Tú solo te ocupas de tu negocio.' : 'We set it up, run it, and optimize it every month. You just run your business.')}
      </p>
      <a
        href={event ? EVENT_URL : BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="lb-cta__btn"
        onClick={() => { if (!event) trackSchedule(); }}
      >
        {event
          ? <><span className="lb-cta__long">{es ? 'Consigue tus boletos en Eventbrite' : 'Get tickets on Eventbrite'}</span><span className="lb-cta__short">{es ? 'Boletos' : 'Get tickets'}</span></>
          : (es ? 'Agenda una llamada de estrategia gratis' : 'Book a free strategy call')}
        <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
      </a>
    </div>
  );

  return (
    <div className={event ? 'lb-page lb-page--event' : partner ? 'lb-page lb-page--partner' : 'lb-page'} role="main">
      <div className="lb-wrap">

      {post.featured && !event ? (
        <FeaturedHero post={post} tags={tags} date={date} onNavigate={onNavigate} es={es} partner={partner} cat={cat} />
      ) : (
      /* ── HERO HEADER ── */
      <header className="lb-hero ll-forest">
        {/* Back nav: a real breadcrumb link, so the post is not an orphan */}
        <nav aria-label={es ? 'Ruta de navegación' : 'Breadcrumb'} className="lb-hero__nav">
          <a href={toHref(BLOG_INDEX)} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--dark">
            <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Industry LoogoBlog
          </a>
          <a href={toHref(categoryPath(cat.slug))} onClick={goCategory} className="lb-catchip">{catLabel}</a>
        </nav>

        <div className="lb-hero__body">
          {event && <img src={EVENT_THEME.logo} alt="Lugo's Craft Distillery" className="lb-event-logo" />}
          {partner && <PartnerBadge partner={partner} slug={post.slug} es={es} />}
          <h1 className="lb-hero__title">{post.title}</h1>

          <div className="lb-hero__meta">
            <span className="lb-hero__author">
              <span className="lb-avatar">{post.author ? post.author[0].toUpperCase() : 'L'}</span>
              {post.author}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at || undefined}>{date}</time>
            <span aria-hidden="true">·</span>
            <span>{post.read_time} {es ? 'min de lectura' : 'min read'}</span>
          </div>
        </div>
      </header>
      )}

      {/* ── BODY ── */}
      <div className={partner ? 'll-post-layout lb-post lb-post--partner' : rail ? 'll-post-layout lb-post lb-post--rail' : 'll-post-layout lb-post'}>
          {partner && <PartnerRail partner={partner} slug={post.slug} es={es} />}

          {/* Article content */}
          <article className="lb-article">
            {es && (
              <p lang="es" style={{ margin: '0 0 16px', fontSize: 13, fontStyle: 'italic', color: 'var(--ink-500)' }}>Este artículo está disponible solo en inglés.</p>
            )}
            {post.excerpt && !post.featured && (
              <p className="lb-standfirst">{post.excerpt}</p>
            )}

            <div className="lb-prose">
              {renderMarkdown(post.content, { dropCap: !!post.featured })}
            </div>

            <div className="lb-tags lb-post__tags">
              <a href={toHref(categoryPath(cat.slug))} onClick={goCategory} className="lb-catchip lb-catchip--light">{es ? `Más en ${catLabel}` : `More in ${catLabel}`} <ArrowRight size={12} weight="bold" aria-hidden="true" /></a>
              {tags.map(tag => <span key={tag} className="lb-tag">{tag}</span>)}
            </div>

            {tool && (
              <a href={toHref(toolPath(tool))} onClick={e => { e.preventDefault(); onNavigate(tool.page); }} className="lb-toolcall ll-glass">
                <span className="lb-toolcall__icon" aria-hidden="true"><Wrench size={18} /></span>
                <span>
                  <span className="lb-toolcall__k">{es ? 'Herramienta gratis' : 'Free tool'}</span>
                  <span className="lb-toolcall__t">{es ? tool.es.title : tool.title}</span>
                  <span className="lb-toolcall__d">{es ? tool.es.blurb : tool.blurb}</span>
                </span>
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </a>
            )}

            {partner && <PartnerRail partner={partner} slug={post.slug} es={es} variant="inline" />}

            {/* Author bio: the personal signature on every post, not just a byline */}
            {post.author === 'David Selva' && (
              <div className="lb-bio ll-glass">
                <img src="/founder-david-selva.jpg" alt="David Selva" width={56} height={56} className="lb-bio__img" />
                <div>
                  <div className="lb-bio__kicker">{es ? 'Escrito por' : 'Written by'}</div>
                  <div className="lb-bio__name">David Selva</div>
                  <p className="lb-bio__text">
                    {es ? 'Fundador de Loogo Labs. Creo y opero los sistemas de seguimiento, reservas y reseñas que evitan que los negocios de servicios locales pierdan prospectos, e Industry LoogoBlog es donde escribo lo que funciona una vez que esos sistemas están en marcha, y lo que no.' : <>
                    Founder of Loogo Labs. I build and run the follow-up, booking and review systems that
                    keep local service businesses from losing leads, and Industry LoogoBlog is where I write down
                    what holds up once those systems are live, and what doesn't.
                  </>}</p>
                </div>
              </div>
            )}

            {/* CTA box: event posts float it in a side rail instead */}
            {!event && cta}

            {related.length > 0 && (
              <section className="lb-more" aria-labelledby="lb-more-t">
                <h2 className="lb-more__title" id="lb-more-t">{es ? 'Sigue leyendo' : 'Keep reading'}</h2>
                <div className="lb-more__grid">
                  {related.map(r => (
                    <a key={r.slug} href={`${BLOG_BASE_PATH}/${r.slug}`} onClick={e => { e.preventDefault(); onNavigate('BlogPost', r.slug); }} className="lb-more__card ll-glass">
                      <span className="ln-card-cat">{es ? BLOG_CATEGORY_BY_SLUG.get(categoryOf(r)).nameEs : BLOG_CATEGORY_BY_SLUG.get(categoryOf(r)).name}</span>
                      <span className="lb-more__t">{r.title}</span>
                      <span className="lb-more__m">{r.read_time} {es ? 'min de lectura' : 'min read'} <ArrowRight size={13} weight="bold" aria-hidden="true" /></span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Back link */}
            <div className="lb-post__back">
              <a href={toHref(BLOG_INDEX)} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--pill">
                <ArrowLeft size={14} weight="bold" aria-hidden="true" /> {es ? 'Volver a Industry LoogoBlog' : 'Back to Industry LoogoBlog'}
              </a>
            </div>
          </article>
          {event && <aside className="lb-event-rail" aria-label={es ? 'Boletos del evento' : 'Event tickets'}>{cta}</aside>}
          {rail && <ReadingRail headings={headings} related={related} cat={cat} onNavigate={onNavigate} es={es} />}
      </div>
      {!event && related[0] && <NextBar post={related[0]} onNavigate={onNavigate} es={es} />}
      </div>
    </div>
  );
}

// Header for the featured post: a full editorial opener on a floating forest
// panel (featured kicker, display-size title, the excerpt as a standfirst and
// a byline strip). A reading-progress bar rides the top of the viewport.
function FeaturedHero({ post, tags, date, onNavigate, es, partner, cat }) {
  const toHref = useHref();
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <>
      <div className="ll-read-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      <header className="lb-hero lb-hero--feature ll-forest">
        <nav aria-label={es ? 'Ruta de navegación' : 'Breadcrumb'} className="lb-hero__nav">
          <a href={toHref(BLOG_INDEX)} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--dark">
            <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Industry LoogoBlog
          </a>
          <a href={toHref(categoryPath(cat.slug))} onClick={e => { e.preventDefault(); onNavigate(categoryPageKey(cat.slug)); }} className="lb-catchip">{es ? cat.nameEs : cat.name}</a>
          <span className="lb-tag lb-tag--accent"><Star size={11} weight="fill" aria-hidden="true" /> {es ? 'Artículo destacado' : 'Featured post'}</span>
        </nav>

        <div className="lb-hero__body">
          {partner && <PartnerBadge partner={partner} slug={post.slug} es={es} />}
          <h1 className="lb-hero__title lb-hero__title--xl">{post.title}</h1>
          {post.excerpt && <p className="lb-hero__lede">{post.excerpt}</p>}
        </div>

        <div className="ll-feature-byline">
          <div className="ll-feature-cell ll-feature-cell--author">
            {post.author === 'David Selva' ? (
              <img src="/founder-david-selva.jpg" alt="" width={40} height={40} className="lb-avatar lb-avatar--img" />
            ) : (
              <span className="lb-avatar">{post.author ? post.author[0].toUpperCase() : 'L'}</span>
            )}
            <span className="ll-feature-cell">
              <span className="ll-feature-cell__k">{es ? 'Escrito por' : 'Written by'}</span>
              <span className="ll-feature-cell__v ll-feature-cell__v--name">{post.author}</span>
            </span>
          </div>
          <div className="ll-feature-cell">
            <span className="ll-feature-cell__k">{es ? 'Publicado' : 'Published'}</span>
            <time dateTime={post.published_at || undefined} className="ll-feature-cell__v">{date}</time>
          </div>
          <div className="ll-feature-cell">
            <span className="ll-feature-cell__k">{es ? 'Tiempo de lectura' : 'Read time'}</span>
            <span className="ll-feature-cell__v">{post.read_time} min</span>
          </div>
        </div>
      </header>
    </>
  );
}

// Partner logo in the post header, on a white plate so the brand colors hold.
function PartnerBadge({ partner, slug, es }) {
  return (
    <a className="lb-partner-badge" href={partnerHref(partner.url, slug)} target="_blank" rel="noopener noreferrer"
      aria-label={es ? `Visita ${partner.name}` : `Visit ${partner.name}`}>
      <span className="lb-partner-badge__k">{es ? 'Anuncio de' : 'Announcement from'}</span>
      <img src={partner.logo} alt={partner.name} width="132" height="32" />
    </a>
  );
}

function renderMarkdown(text, { dropCap = false } = {}) {
  if (!text) return null;
  const blocks = text.split(/\n\n+/);
  // The drop cap goes on the first plain paragraph only, never a heading or list.
  const firstPara = dropCap
    ? blocks.findIndex(b => { const t = b.trim(); return t && !/^(#{2,3} |> |[-*] |!\[)/.test(t); })
    : -1;
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('## ')) return <h2 key={i} id={headingId(trimmed.slice(3))}>{inlineRender(trimmed.slice(3))}</h2>;
    if (trimmed.startsWith('### ')) return <h3 key={i}>{inlineRender(trimmed.slice(4))}</h3>;
    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) return <figure key={i} className="lb-figure"><img src={img[2]} alt={img[1]} loading="lazy" /></figure>;
    const lines = trimmed.split('\n');
    if (lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>
              {inlineRender(l.trim().slice(2))}
            </li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i}>
          {inlineRender(trimmed.slice(2))}
        </blockquote>
      );
    }
    return <p key={i} className={i === firstPara ? 'll-dropcap' : undefined}>{inlineRender(trimmed)}</p>;
  });
}

function inlineRender(text) {
  const parts = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0, match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={match.index}>{match[4]}</em>);
    else if (match[5]) parts.push(<code key={match.index}>{match[6]}</code>);
    else if (match[7]) parts.push(<a key={match.index} href={match[9]} target="_blank" rel="noopener noreferrer">{match[8]}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : parts;
}

const EVENT_URL = 'https://www.eventbrite.com/e/cards-and-cocktails-tcg-event-at-lugos-craft-distillery-tickets-1998693881202';

const BLOG_BASE_PATH = '/news';

// Section anchors for the table of contents: "## Why it matters" -> #why-it-matters.
const headingId = (text) => text.replace(/[*`[\]()]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
function headingsOf(content = '') {
  return content.split(/\n\n+/).map(b => b.trim()).filter(b => b.startsWith('## '))
    .map(b => { const t = b.slice(3).split('\n')[0]; return { id: headingId(t), text: t.replace(/[*`]/g, '') }; });
}

// Desktop only: a sticky column beside the article with the post's sections
// (current one highlighted) and what to read next.
function ReadingRail({ headings, related, cat, onNavigate, es }) {
  const toHref = useHref();
  const [active, setActive] = React.useState(null);
  React.useEffect(() => {
    if (headings.length < 2 || typeof IntersectionObserver === 'undefined') return undefined;
    const els = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-80px 0px -65% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [headings]);
  return (
    <aside className="lb-rail" aria-label={es ? 'En esta página' : 'On this page'}>
      {headings.length > 1 && (
        <nav className="lb-rail__sec">
          <p className="lb-rail__label">{es ? 'En esta página' : 'On this page'}</p>
          <ol className="lb-rail__toc">
            {headings.map(h => (
              <li key={h.id}><a href={`#${h.id}`} aria-current={active === h.id ? 'true' : undefined}
                onClick={e => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{h.text}</a></li>
            ))}
          </ol>
        </nav>
      )}
      {related.length > 0 && (
        <div className="lb-rail__sec">
          <p className="lb-rail__label">{es ? `Más en ${cat.nameEs}` : `More in ${cat.name}`}</p>
          <ul className="lb-rail__list">
            {related.map(r => (
              <li key={r.slug}><a href={`${BLOG_BASE_PATH}/${r.slug}`} onClick={e => { e.preventDefault(); onNavigate('BlogPost', r.slug); }}>{r.title}</a></li>
            ))}
          </ul>
          <a className="lb-rail__all" href={toHref(categoryPath(cat.slug))} onClick={e => { e.preventDefault(); onNavigate(categoryPageKey(cat.slug)); }}>
            {es ? 'Ver la categoría' : 'See the category'} <ArrowRight size={12} weight="bold" aria-hidden="true" />
          </a>
        </div>
      )}
    </aside>
  );
}

// Phones and tablets: a slim "Next" bar that slides up once the reader is
// halfway through, so the next post is one tap away. Dismissible.
function NextBar({ post, onNavigate, es }) {
  const [show, setShow] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const at = max > 0 ? window.scrollY / max : 0;
      setShow(at > 0.45 && at < 0.97);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (closed) return null;
  return (
    <div className={`lb-next${show ? ' is-on' : ''}`} aria-hidden={!show}>
      <a href={`${BLOG_BASE_PATH}/${post.slug}`} tabIndex={show ? 0 : -1} onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }} className="lb-next__link">
        <span className="lb-next__k">{es ? 'Siguiente' : 'Next'}</span>
        <span className="lb-next__t">{post.title}</span>
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </a>
      <button type="button" className="lb-next__x" tabIndex={show ? 0 : -1} aria-label={es ? 'Cerrar' : 'Close'} onClick={() => setClosed(true)}><X size={14} weight="bold" aria-hidden="true" /></button>
    </div>
  );
}
