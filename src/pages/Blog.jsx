import React from 'react';
import { rankScore, buildSidebar } from './BlogSidebar';
import { BLOG_BASE, BLOG_INDEX, applyHead, headForPage, blogLd } from '../lib/seo';
import { BLOG_CATEGORIES, BLOG_CATEGORY_BY_SLUG, START_HERE, categoryOf, categoryPageKey, categoryPath, categorySlugFromPath } from '../lib/blogCategories';
import { TOOLS, toolPath } from '../lib/tools';
import { cachedPosts, loadPosts } from '../lib/postsCache';
import { localizePath, useHref, useLang } from '../lib/i18n';
import { EVENT_THEME, isEventPost, isPinnedAnnouncement } from '../lib/featuredEvent';
import { partnerForPost } from '../lib/partners';
import { ArrowLeft, ArrowRight, MagnifyingGlass, PencilSimpleLine, Star, X } from '@phosphor-icons/react';
import '../styles/pages/blog.css';

export default function Blog({ onNavigate, category: categoryProp = null }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  // Fetched once per visit (lib/postsCache), so moving between the index and
  // category pages never refetches or flashes the loading state.
  const [posts, setPosts] = React.useState(cachedPosts() || []);
  const [loading, setLoading] = React.useState(!cachedPosts());
  const [category, setCategory] = React.useState(categoryProp);
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('newest');
  const [showAll, setShowAll] = React.useState(false);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (cachedPosts()) return;
    loadPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  // Follow the URL: a category link from a post, or the back/forward buttons.
  React.useEffect(() => { setCategory(categoryProp); }, [categoryProp]);
  React.useEffect(() => {
    const onPop = () => setCategory(categorySlugFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const cat = category ? BLOG_CATEGORY_BY_SLUG.get(category) : null;
  const pageKey = cat ? categoryPageKey(cat.slug) : 'LoogoNews';
  const inCategory = React.useMemo(() => (cat ? posts.filter(p => categoryOf(p) === cat.slug) : posts), [posts, cat]);

  // Head (title, canonical, Blog schema) follows the selected category.
  React.useEffect(() => {
    if (!posts.length) return;
    const head = headForPage(pageKey, es ? 'es' : 'en');
    applyHead({ ...head, jsonLd: [...head.jsonLd, blogLd(inCategory)] });
  }, [posts, pageKey, inCategory, es]);

  // Picking a category filters in place and updates the address, so the view
  // can be shared and the back button undoes it. No reload, no jump to the top.
  const pickCategory = (slug) => {
    const next = slug === category ? null : slug;
    setCategory(next);
    const path = localizePath(next ? categoryPath(next) : BLOG_INDEX, es ? 'es' : 'en');
    if (path !== window.location.pathname) window.history.pushState({}, '', path);
    const top = listRef.current?.getBoundingClientRect().top;
    if (top != null && top < 0) listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const counts = React.useMemo(() => {
    const c = {};
    posts.forEach(p => { const k = categoryOf(p); c[k] = (c[k] || 0) + 1; });
    return c;
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
  const startHere = START_HERE.map(slug => posts.find(p => p.slug === slug)).filter(Boolean);

  const filtering = Boolean(cat || query.trim() || sort !== 'newest');
  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (filtering ? inCategory : rest).filter(p =>
      !q || `${p.title} ${p.excerpt || ''} ${p.tags || ''}`.toLowerCase().includes(q));
    if (sort === 'views') return [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    if (sort === 'ranked') return [...list].sort((a, b) => rankScore(b) - rankScore(a));
    return list;
  }, [inCategory, rest, filtering, query, sort]);
  const clearFilters = () => { setQuery(''); setSort('newest'); if (category) pickCategory(null); };

  const mostRead = React.useMemo(() => buildSidebar(posts).mostViewed, [posts]);
  const LATEST_COUNT = 9;
  const latest = filtering || showAll ? shown : shown.slice(0, LATEST_COUNT);
  const hasFeatured = pinned.length > 0 || eventPost || featured;

  const searchBox = (
    <label className="ln-find__search ln-hero__search">
      <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
      <input type="search" aria-label={es ? 'Buscar artículos' : 'Search posts'} placeholder={es ? 'Busca artículos, p. ej. reseñas o HVAC' : 'Search posts, e.g. reviews or HVAC'} value={query} onChange={e => setQuery(e.target.value)} />
    </label>
  );

  return (
    <div className="lb-page" role="main">
      <div className="lb-wrap">

      {/* ── 1. MASTHEAD: what this is, and a search box ── */}
      <div className="ln-hero">
        {cat ? (
          <>
            <a className="ln-masthead__kicker" href={toHref(BLOG_INDEX)} onClick={e => { e.preventDefault(); pickCategory(null); }}>
              <ArrowLeft size={13} weight="bold" aria-hidden="true" /> Industry LoogoBlog
            </a>
            <h1 className="ln-hero__title ln-hero__title--cat">{es ? cat.nameEs : cat.name}</h1>
            <p className="ln-hero__lede">{es ? cat.blurbEs : cat.blurb}</p>
          </>
        ) : (
          <>
            <h1 className="ln-hero__title">Industry <em>LoogoBlog.</em></h1>
            <p className="ln-hero__lede">
              {es ? 'Guías prácticas para usar la IA en tu marketing. Qué automatizar, qué dejar en manos de una persona y qué de verdad te trae clientes.' : 'Practical guides to using AI in your marketing. What to automate, what to keep human, and what actually brings in customers.'}
            </p>
          </>
        )}
        {searchBox}
      </div>

      {/* ── 2. FEATURED: announcement, event and editor's pick in one row ── */}
      {!cat && !filtering && (loading ? (
        <div className="ln-feat" aria-hidden="true"><span className="lb-skel lb-skel--masthead" /></div>
      ) : hasFeatured && (
        <section className="lb-featured ln-feat" aria-label={es ? 'Destacados' : 'Featured'}>
          {pinned.map(p => <PinnedCard key={p.id} post={p} onNavigate={onNavigate} es={es} />)}
          {eventPost && <EventFeaturedCard post={eventPost} onNavigate={onNavigate} es={es} />}
          {spotlight
            ? <FeaturedSpotlight post={spotlight} onNavigate={onNavigate} es={es} />
            : featured && <FeaturedCard post={featured} onNavigate={onNavigate} es={es} />}
        </section>
      ))}

      {/* ── 3. TOPICS + SORT: sticky under the nav ── */}
      <nav className="ln-cats" aria-label={es ? 'Categorías del blog' : 'Blog categories'}>
        <div className="ln-cats__track">
          <a href={toHref(BLOG_INDEX)} className="ln-cats__pill" aria-current={!cat ? 'page' : undefined}
            onClick={e => { e.preventDefault(); if (cat) pickCategory(null); }}>
            {es ? 'Todos' : 'All'} {posts.length > 0 && <span>{posts.length}</span>}
          </a>
          {BLOG_CATEGORIES.filter(c => loading || counts[c.slug]).map(c => (
            <a key={c.slug} href={toHref(categoryPath(c.slug))} className="ln-cats__pill" aria-current={category === c.slug ? 'page' : undefined}
              onClick={e => { e.preventDefault(); pickCategory(c.slug); }}>
              {es ? c.nameEs : c.name} {counts[c.slug] > 0 && <span>{counts[c.slug]}</span>}
            </a>
          ))}
        </div>
        <label className="ln-find__sort ln-cats__sort">
          {es ? 'Ordenar' : 'Sort'}
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">{es ? 'Más recientes' : 'Newest'}</option>
            <option value="views">{es ? 'Más vistos' : 'Most viewed'}</option>
            <option value="ranked">{es ? 'Mejor valorados' : 'Best ranked'}</option>
          </select>
        </label>
      </nav>

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
          <>
            {/* 4. Start here + Most read, side by side */}
            {!filtering && (startHere.length > 0 || mostRead.length > 0) && (
              <div className="ln-intro">
                {startHere.length > 0 && (
                  <section className="ln-start" aria-labelledby="ln-start-t">
                    <h2 className="lb-list__title" id="ln-start-t">{es ? 'Empieza aquí' : 'Start here'}</h2>
                    <p className="ln-start__lede">{es ? 'Las tres guías que más le sirven a un negocio de servicios.' : 'The three guides that help a service business most.'}</p>
                    <div className="ln-start__grid">
                      {startHere.map((p, i) => (
                        <a key={p.slug} href={`${BLOG_BASE}/${p.slug}`} onClick={go(onNavigate, p)} className="ln-start__card ll-glass">
                          <span className="ln-start__num">{String(i + 1).padStart(2, '0')}</span>
                          <span className="ln-card-cat">{catName(p, es)}</span>
                          <span className="ln-start__title">{p.title}</span>
                          <span className="ln-start__meta">{p.read_time} {es ? 'min de lectura' : 'min read'} <ArrowRight size={13} weight="bold" aria-hidden="true" /></span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
                {mostRead.length > 0 && (
                  <section className="ln-top" aria-labelledby="ln-top-t">
                    <h2 className="lb-list__title" id="ln-top-t">{es ? 'Lo más leído' : 'Most read'}</h2>
                    <ol className="ln-top__list">
                      {mostRead.map((p, i) => (
                        <li key={p.id}>
                          <a href={`${BLOG_BASE}/${p.slug}`} onClick={go(onNavigate, p)}>
                            <span className="ln-top__num">{String(i + 1).padStart(2, '0')}</span>
                            <span className="ln-top__title">{p.title}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
              </div>
            )}

            {/* 5. The posts */}
            <div className="lb-list" ref={listRef}>
              <div className="lb-list__head">
                <h2 className="lb-list__title">
                  {filtering
                    ? (es ? `${shown.length} ${shown.length === 1 ? 'artículo' : 'artículos'}${cat ? ` en ${cat.nameEs}` : ''}` : `${shown.length} ${shown.length === 1 ? 'post' : 'posts'}${cat ? ` in ${cat.name}` : ''}`)
                    : (es ? 'Artículos recientes' : 'Latest posts')}
                </h2>
                {filtering && (
                  <button type="button" className="ln-filters__clear" onClick={clearFilters}>{es ? 'Borrar' : 'Clear'} <X size={12} weight="bold" aria-hidden="true" /></button>
                )}
              </div>
              {shown.length === 0 && (
                <div className="lb-nomatch ll-glass">
                  <p>{es ? 'Ningún artículo coincide con esos filtros.' : 'No posts match those filters.'}</p>
                  <button type="button" className="ln-filters__clear" onClick={clearFilters}>{es ? 'Borrar filtros' : 'Clear filters'}</button>
                </div>
              )}
              <div className="lb-grid ln-grid3">
                {latest.map(post => <PostCard key={post.id} post={post} onNavigate={onNavigate} es={es} />)}
              </div>
              {!filtering && !showAll && shown.length > LATEST_COUNT && (
                <div className="ln-more">
                  <button type="button" className="ln-more__btn" onClick={() => setShowAll(true)}>
                    {es ? `Ver los ${shown.length} artículos` : `Show all ${shown.length} posts`} <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <ToolsStrip es={es} toHref={toHref} />
          </>
        )}
      </div>
      </div>
    </div>
  );
}

const catName = (post, es) => { const c = BLOG_CATEGORY_BY_SLUG.get(categoryOf(post)); return es ? c.nameEs : c.name; };

// Small strip under the post list pointing at the free tools.
function ToolsStrip({ es, toHref }) {
  return (
    <section className="ln-tools" aria-labelledby="ln-tools-t">
      <div>
        <h2 className="ln-tools__title" id="ln-tools-t">{es ? 'Herramientas gratis' : 'Free tools'}</h2>
        <p className="ln-tools__lede">{es ? 'Sin registro. Funcionan en tu navegador.' : 'No sign-up. They run in your browser.'}</p>
      </div>
      <div className="ln-tools__links">
        {TOOLS.map(t => (
          <a key={t.page} href={toHref(toolPath(t))} className="ln-tools__link">
            {es ? t.es.short : t.short} <ArrowRight size={13} weight="bold" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

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
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className={`lb-fcard lb-fcard--pinned${partner ? ` lb-fcard--partner lb-fcard--${partner.key}` : ''}`}
      style={partner ? { '--pt-primary': partner.colors.primary, '--pt-secondary': partner.colors.secondary, '--pt-ink': partner.colors.ink } : undefined}
      aria-label={es ? `Anuncio: ${post.title}` : `Announcement: ${post.title}`}>
      <div className="lb-fcard__body">
        <div className="lb-fcard__top">
          <span className="lb-fcard__kicker lb-fcard__kicker--new">{es ? 'Nuevo lanzamiento' : 'New release'}</span>
          {partner && <img className="lb-fcard__plogo-img" src={partner.logoOnDark} alt={partner.name} width="116" height="28" />}
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
          <span className="lb-fcard__logo lb-fcard__logo--mask" role="img" aria-label="Lugo's Craft Distillery" />
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
  const date = fmtDate(post, 'short', es);

  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className={`lb-card ll-glass${wide ? ' lb-card--wide' : ''}`}>
      <span className="ln-card-cat">{catName(post, es)}</span>
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
