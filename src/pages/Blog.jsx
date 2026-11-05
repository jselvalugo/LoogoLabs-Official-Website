import React from 'react';
import BlogSidebar, { CFL_RE, tagsOf, rankScore } from './BlogSidebar';
import { BLOG_BASE, applyHead, headForPage, blogLd } from '../lib/seo';
import { useLang } from '../lib/i18n';
import { EVENT_THEME, isEventPost, isPinnedAnnouncement } from '../lib/featuredEvent';
import { partnerForPost } from '../lib/partners';
import { ArrowRight, MagnifyingGlass, PencilSimpleLine, Star, X } from '@phosphor-icons/react';
import '../styles/pages/blog.css';

// Pseudo-topic for the Central Florida small business collection.
const CFL = '__cfl';

export default function Blog({ onNavigate }) {
  const es = useLang() === 'es';
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [topic, setTopic] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('newest');

  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .finally(() => setLoading(false));
  }, []);

  // Re-publish the index's structured data once the real post list is in, so the
  // Blog node lists the posts a visitor actually sees.
  React.useEffect(() => {
    if (!posts.length) return;
    const head = headForPage('LoogoNews');
    applyHead({ ...head, jsonLd: [...head.jsonLd, blogLd(posts)] });
  }, [posts]);

  // An editor-picked featured post gets the spotlight layout. With none picked,
  // the newest post leads in the plain "Latest post" card, as before.
  // A pinned event post sits above everything, in the event's own finish.
  const eventPost = posts.find(isEventPost) || null;
  const pinned = posts.filter(isPinnedAnnouncement);
  const regular = posts.filter(p => p !== eventPost && !pinned.includes(p));
  const spotlight = regular.find(p => p.featured) || null;
  const featured = spotlight || regular[0] || null;
  const rest = regular.filter(p => p !== featured);
  // Quick-pick chips: the Central Florida collection plus the most-used tags.
  // A topic picked from the sidebar that isn't among them gets its own chip.
  const chips = React.useMemo(() => {
    const counts = {};
    posts.forEach(p => tagsOf(p).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((x, y) => y[1] - x[1]).map(([t]) => t).filter(t => t.toLowerCase() !== 'central florida').slice(0, 6);
  }, [posts]);
  const chipList = topic && topic !== CFL && !chips.includes(topic) ? [...chips, topic] : chips;
  const filtering = Boolean(topic || query.trim() || sort !== 'newest');
  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (filtering ? posts : rest).filter(p =>
      (!topic || (topic === CFL ? CFL_RE.test(`${p.tags || ''} ${p.title}`) : tagsOf(p).includes(topic)))
      && (!q || `${p.title} ${p.excerpt || ''} ${p.tags || ''}`.toLowerCase().includes(q)));
    if (sort === 'views') return [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    if (sort === 'ranked') return [...list].sort((a, b) => rankScore(b) - rankScore(a));
    return list;
  }, [posts, rest, filtering, topic, query, sort]);
  const clearFilters = () => { setTopic(null); setQuery(''); setSort('newest'); };

  return (
    <div className="lb-page" role="main">
      <div className="lb-wrap">

      {/* ── MASTHEAD ── */}
      <div className="ln-masthead ll-forest">
        <img className="ln-masthead__art" src="/loogonews-masthead.webp" alt="" aria-hidden="true" width="720" height="713" decoding="async" />
        <div className="ln-masthead__inner">
          <div className="ln-masthead__copy">
            <h1 className="ln-masthead__title">
              Industry<br /><em>LoogoBlog.</em>
            </h1>
            <p className="ln-masthead__lede">
              {es ? 'Notas de un equipo que planea el marketing y luego lo construye: posicionamiento, anuncios, email, seguimiento, automatizaciones e IA, además de los mitos de marketing que conviene ignorar.' : 'Notes from a team that plans marketing and then builds it: positioning, ads, email, tracking, automations and AI, plus the marketing myths worth ignoring.'}
            </p>
          </div>
          {/* Featured cards sit beside the intro on desktop and under it on phones. */}
          {loading ? (
            <div className="ln-masthead__featured" aria-hidden="true"><span className="lb-skel lb-skel--masthead" /></div>
          ) : (pinned.length > 0 || eventPost || featured) && (
            <section className="lb-featured ln-masthead__featured" aria-label={es ? 'Destacados' : 'Featured'}>
              <div className="lb-featured__grid">
                {pinned.map(p => <PinnedCard key={p.id} post={p} onNavigate={onNavigate} es={es} />)}
                {eventPost && <EventFeaturedCard post={eventPost} onNavigate={onNavigate} es={es} />}
                {spotlight
                  ? <FeaturedSpotlight post={spotlight} onNavigate={onNavigate} es={es} />
                  : featured && <FeaturedCard post={featured} onNavigate={onNavigate} es={es} />}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="lb-content">

        {loading ? (
          <div className="lb-loading" role="status" aria-live="polite">
            <div className="lb-skel-row"><span className="lb-skel" /><span className="lb-skel" /></div>
            <span className="lb-visually-hidden">{es ? 'Cargando artículos' : 'Loading posts'}</span>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState es={es} />
        ) : (
          <div className="ln-layout">
           <div className="ln-layout__main">
            {(rest.length > 0 || filtering) && (
              <div className="lb-list">
                <div className="lb-list__head">
                  <h2 className="lb-list__title">
                    {filtering ? (es ? `Mostrando ${shown.length} de ${posts.length} artículos` : `Showing ${shown.length} of ${posts.length} posts`) : (es ? 'Encuentra un artículo' : 'Find a post')}
                  </h2>
                  {filtering && (
                    <button type="button" className="ln-filters__clear" onClick={clearFilters}>{es ? 'Borrar' : 'Clear'} <X size={12} weight="bold" aria-hidden="true" /></button>
                  )}
                </div>
                <div className="ln-find" role="search">
                  <label className="ln-find__search">
                    <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
                    <input type="search" aria-label={es ? 'Buscar artículos' : 'Search posts'} placeholder={es ? 'Busca artículos, p. ej. reseñas o HVAC' : 'Search posts, e.g. reviews or HVAC'} value={query} onChange={e => setQuery(e.target.value)} />
                  </label>
                  <div className="ln-find__row">
                    <div className="ln-find__chips" aria-label={es ? 'Filtrar por tema' : 'Filter by topic'}>
                      {[[null, es ? 'Todos' : 'All'], [CFL, es ? 'Centro de Florida' : 'Central Florida'], ...chipList.map(t => [t, t])].map(([value, text]) => (
                        <button key={text} type="button" className="ln-find__chip" aria-pressed={topic === value} onClick={() => setTopic(value)}>
                          {text}
                        </button>
                      ))}
                    </div>
                    <label className="ln-find__sort">
                      {es ? 'Ordenar' : 'Sort'}
                      <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="newest">{es ? 'Más recientes' : 'Newest'}</option>
                        <option value="views">{es ? 'Más vistos' : 'Most viewed'}</option>
                        <option value="ranked">{es ? 'Mejor valorados' : 'Best ranked'}</option>
                      </select>
                    </label>
                  </div>
                </div>
                {shown.length === 0 && (
                  <div className="lb-nomatch ll-glass">
                    <p>{es ? 'Ningún artículo coincide con esos filtros.' : 'No posts match those filters.'}</p>
                    <button type="button" className="ln-filters__clear" onClick={clearFilters}>{es ? 'Borrar filtros' : 'Clear filters'}</button>
                  </div>
                )}
                <div className="lb-grid">
                  {shown.map((post, i) => <PostCard key={post.id} post={post} onNavigate={onNavigate} es={es} wide={!filtering && shown.length > 2 && i === 0} />)}
                </div>
              </div>
            )}
           </div>
            <BlogSidebar posts={posts} topic={topic} onTopic={setTopic} onNavigate={onNavigate} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

const tagList = post => (post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
const fmtDate = (post, month, es) => (post.published_at
  ? new Date(post.published_at).toLocaleDateString(es ? 'es-US' : 'en-US', { year: 'numeric', month, day: 'numeric' })
  : '');
const go = (onNavigate, post) => e => { e.preventDefault(); onNavigate('BlogPost', post.slug); };

// Pinned announcement (src/lib/featuredEvent.js): the lead card of the
// featured grid, full width on desktop, compact on phones.
function PinnedCard({ post, onNavigate, es }) {
  const date = fmtDate(post, 'long', es);
  const partner = partnerForPost(post);
  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className="lb-fcard lb-fcard--pinned"
      aria-label={es ? `Anuncio: ${post.title}` : `Announcement: ${post.title}`}>
      <div className="lb-fcard__body">
        <div className="lb-fcard__top">
          <span className="lb-fcard__kicker lb-fcard__kicker--new">{es ? 'Nuevo lanzamiento' : 'New release'}</span>
          {partner && <span className="lb-fcard__plogo"><img src={partner.logo} alt={partner.name} width="116" height="28" /></span>}
        </div>
        <h2 className="lb-fcard__title">{post.title}</h2>
        {post.excerpt && <p className="lb-fcard__excerpt">{post.excerpt}</p>}
      </div>
      <div className="lb-fcard__foot">
        <span className="lb-fcard__meta">{date && <time dateTime={post.published_at}>{date}</time>}{date && ' · '}{post.read_time} {es ? 'min de lectura' : 'min read'}</span>
        <span className="lb-go lb-go--dark">
          {es ? 'Leer el anuncio' : 'Read the announcement'}
          <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
        </span>
      </div>
    </a>
  );
}

// Pinned event: compact card in the event's own black-and-gold finish.
function EventFeaturedCard({ post, onNavigate, es }) {
  const t = EVENT_THEME;
  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className="lb-fcard lb-fcard--event"
      aria-label={es ? `Evento destacado: ${post.title}` : `Featured event: ${post.title}`}>
      <div className="lb-fcard__body">
        <div className="lb-fcard__top">
          <span className="lb-fcard__kicker">{es ? 'Evento · 14 nov. 2026' : 'Event · Nov 14, 2026'}</span>
          <img className="lb-fcard__logo" src={t.logo} alt="Lugo's Craft Distillery" width="44" height="44" />
        </div>
        <h2 className="lb-fcard__title">{post.title}</h2>
        <p className="lb-fcard__excerpt">{es ? 'Lakeland, FL · Entrada gratis · 2–10 PM' : 'Lakeland, FL · Free admission · 2–10 PM'}</p>
      </div>
      <div className="lb-fcard__foot">
        <span className="lb-go lb-go--dark">
          {es ? 'Detalles del evento' : 'Event details'}
          <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
        </span>
      </div>
    </a>
  );
}

// The editor-picked featured post (daily routine): compact forest card.
function FeaturedSpotlight({ post, onNavigate, es }) {
  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className="lb-fcard lb-fcard--pick"
      aria-label={es ? `Artículo destacado: ${post.title}` : `Featured post: ${post.title}`}>
      <div className="lb-fcard__body">
        <span className="lb-fcard__kicker"><Star size={11} weight="fill" aria-hidden="true" /> {es ? 'Selección del editor' : "Editor's pick"}</span>
        <h2 className="lb-fcard__title">{post.title}</h2>
        {post.excerpt && <p className="lb-fcard__excerpt">{post.excerpt}</p>}
      </div>
      <div className="lb-fcard__foot">
        <span className="lb-fcard__meta">{post.read_time} {es ? 'min de lectura' : 'min read'}</span>
        <span className="lb-go lb-go--dark">
          {es ? 'Leer' : 'Read'}
          <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
        </span>
      </div>
    </a>
  );
}

// No editor pick: the newest post, same compact card on paper.
function FeaturedCard({ post, onNavigate, es }) {
  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className="lb-fcard lb-fcard--latest ll-glass">
      <div className="lb-fcard__body">
        <span className="lb-fcard__kicker">{es ? 'Último artículo' : 'Latest post'}</span>
        <h2 className="lb-fcard__title">{post.title}</h2>
        {post.excerpt && <p className="lb-fcard__excerpt">{post.excerpt}</p>}
      </div>
      <div className="lb-fcard__foot">
        <span className="lb-fcard__meta">{post.read_time} {es ? 'min de lectura' : 'min read'}</span>
        <span className="lb-go">
          {es ? 'Leer' : 'Read'}
          <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
        </span>
      </div>
    </a>
  );
}

function PostCard({ post, onNavigate, wide, es }) {
  const tags = tagList(post);
  const date = fmtDate(post, 'short', es);

  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className={`lb-card ll-glass${wide ? ' lb-card--wide' : ''}`}>
      {tags.length > 0 && (
        <div className="lb-tags">
          {tags.map(tag => <span key={tag} className="lb-tag">{tag}</span>)}
        </div>
      )}
      <h3 className="lb-card__title">{post.title}</h3>
      {post.excerpt && <p className="lb-card__excerpt">{post.excerpt}</p>}
      <div className="lb-card__foot">
        <div className="lb-meta lb-meta--inline">
          <time dateTime={post.published_at || undefined}>{date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.read_time} {es ? 'min de lectura' : 'min read'}</span>
        </div>
        <span className="lb-card__go" aria-hidden="true"><ArrowRight size={14} weight="bold" /></span>
      </div>
    </a>
  );
}

function EmptyState({ es }) {
  return (
    <div className="lb-empty ll-glass">
      <span className="lb-empty__icon" aria-hidden="true"><PencilSimpleLine size={22} weight="duotone" /></span>
      <span className="lb-empty__kicker">{es ? 'Muy pronto' : 'Coming soon'}</span>
      <p>{es ? 'Estamos escribiendo el primer artículo. Vuelve pronto.' : 'First post is being written. Check back soon.'}</p>
    </div>
  );
}
