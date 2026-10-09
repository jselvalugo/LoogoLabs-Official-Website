import React from 'react';
import BlogSidebar, { CFL_RE, tagsOf, rankScore } from './BlogSidebar';
import { BLOG_BASE, applyHead, headForPage, blogLd } from '../lib/seo';
import { EVENT_THEME, isEventPost } from '../lib/featuredEvent';
import { ArrowRight, MagnifyingGlass, PencilSimpleLine, Star, X } from '@phosphor-icons/react';
import '../styles/pages/blog.css';

// Pseudo-topic for the Central Florida small business collection.
const CFL = '__cfl';

export default function Blog({ onNavigate }) {
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
  const regular = posts.filter(p => p !== eventPost);
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
    <div className="lb-page">
      <div className="lb-wrap">

      {/* ── MASTHEAD ── */}
      <header className="ln-masthead ll-forest">
        <img className="ln-masthead__art" src="/loogonews-masthead.webp" alt="" aria-hidden="true" width="720" height="713" decoding="async" />
        <div className="ln-masthead__inner">
          <div className="ln-masthead__copy">
            <h1 className="ln-masthead__title">
              Industry<br /><em>LoogoBlog.</em>
            </h1>
            <p className="ln-masthead__lede">
              Straight talk for local service businesses: faster lead follow-up, more reviews, fewer no-shows, smarter booking and AI voice agents, plus the marketing myths worth ignoring.
            </p>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="lb-content">

        {loading ? (
          <div className="lb-loading" role="status" aria-live="polite">
            <span className="lb-skel lb-skel--feature" />
            <div className="lb-skel-row"><span className="lb-skel" /><span className="lb-skel" /></div>
            <span className="lb-visually-hidden">Loading posts</span>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="ln-layout">
           <div className="ln-layout__main">
            {eventPost && <EventFeaturedCard post={eventPost} onNavigate={onNavigate} />}
            {spotlight
              ? <FeaturedSpotlight post={spotlight} onNavigate={onNavigate} />
              : featured && <FeaturedCard post={featured} onNavigate={onNavigate} />}

            {(rest.length > 0 || filtering) && (
              <div className="lb-list">
                <div className="lb-list__head">
                  <h2 className="lb-list__title">
                    {filtering ? `Showing ${shown.length} of ${posts.length} posts` : 'Find a post'}
                  </h2>
                  {filtering && (
                    <button type="button" className="ln-filters__clear" onClick={clearFilters}>Clear <X size={12} weight="bold" aria-hidden="true" /></button>
                  )}
                </div>
                <div className="ln-find" role="search">
                  <label className="ln-find__search">
                    <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
                    <input type="search" aria-label="Search posts" placeholder="Search posts, e.g. reviews or HVAC" value={query} onChange={e => setQuery(e.target.value)} />
                  </label>
                  <div className="ln-find__row">
                    <div className="ln-find__chips" aria-label="Filter by topic">
                      {[[null, 'All'], [CFL, 'Central Florida'], ...chipList.map(t => [t, t])].map(([value, text]) => (
                        <button key={text} type="button" className="ln-find__chip" aria-pressed={topic === value} onClick={() => setTopic(value)}>
                          {text}
                        </button>
                      ))}
                    </div>
                    <label className="ln-find__sort">
                      Sort
                      <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="views">Most viewed</option>
                        <option value="ranked">Best ranked</option>
                      </select>
                    </label>
                  </div>
                </div>
                {shown.length === 0 && (
                  <div className="lb-nomatch ll-glass">
                    <p>No posts match those filters.</p>
                    <button type="button" className="ln-filters__clear" onClick={clearFilters}>Clear filters</button>
                  </div>
                )}
                <div className="lb-grid">
                  {shown.map((post, i) => <PostCard key={post.id} post={post} onNavigate={onNavigate} wide={!filtering && shown.length > 2 && i === 0} />)}
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
const fmtDate = (post, month) => (post.published_at
  ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' })
  : '');
const go = (onNavigate, post) => e => { e.preventDefault(); onNavigate('BlogPost', post.slug); };

// The editor-picked featured post: a floating dark forest panel with a
// display-size title and the excerpt set as a pull quote.
function FeaturedSpotlight({ post, onNavigate }) {
  const tags = tagList(post);
  const date = fmtDate(post, 'long');

  return (
    <a
      href={`${BLOG_BASE}/${post.slug}`}
      onClick={go(onNavigate, post)}
      aria-label={`Featured post: ${post.title}`}
      className="lb-feature"
    >
      <div className="ll-feature-panel ll-forest">
        <div className="ll-feature-main">
          <div className="lb-tags">
            <span className="lb-tag lb-tag--accent"><Star size={11} weight="fill" aria-hidden="true" /> Editor's pick</span>
            {tags.map(tag => <span key={tag} className="lb-tag lb-tag--dark">{tag}</span>)}
          </div>
          <h2 className="ll-feature-title">{post.title}</h2>
          <span className="lb-go lb-go--dark">
            Read the featured post
            <span className="lb-go__icon"><ArrowRight size={16} weight="bold" aria-hidden="true" /></span>
          </span>
        </div>

        <aside className="ll-feature-side">
          {post.excerpt && <p className="ll-feature-quote">{post.excerpt}</p>}
          <dl className="ll-feature-meta">
            <dt>By</dt><dd>{post.author}</dd>
            {date && <><dt>Published</dt><dd><time dateTime={post.published_at}>{date}</time></dd></>}
            <dt>Length</dt><dd>{post.read_time} min read</dd>
          </dl>
        </aside>
      </div>
    </a>
  );
}

function EventFeaturedCard({ post, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  const t = EVENT_THEME;
  return (
    <a
      href={`${BLOG_BASE}/${post.slug}`}
      onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'block', marginTop: 48, textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.gold }}>
          Featured event · Nov 14, 2026
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${t.gold}, transparent)` }} />
      </div>
      <div className="ll-2col" style={{
        gap: 0,
        background: `radial-gradient(ellipse 60% 60% at 15% 0%, rgba(201,149,42,.14), transparent 60%), linear-gradient(165deg, #0A0906 0%, ${t.ink} 55%, #160A06 100%)`,
        border: `1px solid ${t.border}`, borderTop: `3px solid ${t.gold}`, borderRadius: 'var(--radius-4)', overflow: 'hidden', marginTop: 12,
        boxShadow: hover ? '0 18px 48px rgba(201,149,42,.18)' : 'none', transition: 'box-shadow 160ms ease',
      }}>
        <div style={{ padding: 'clamp(28px,4vw,52px)', borderRight: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <img src={t.logo} alt="Lugo's Craft Distillery" style={{ width: '100%', maxWidth: 240, height: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        </div>
        <div style={{ padding: 'clamp(28px,4vw,52px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.muted, marginBottom: 14 }}>
              Lakeland, FL · Free admission · 2–10 PM
            </div>
            <h2 style={{ margin: '0 0 18px', fontFamily: t.serif, fontSize: 'clamp(24px,3vw,40px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: hover ? t.goldLight : t.cream, transition: 'color 120ms ease' }}>
              {post.title}
            </h2>
            {post.excerpt && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: t.muted }}>{post.excerpt}</p>}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.gold, fontWeight: 600 }}>
            Event details
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: t.gold, color: t.ink, borderRadius: '50%', fontSize: 13, transition: 'transform 120ms ease', transform: hover ? 'translateX(3px)' : 'none' }}>→</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function FeaturedCard({ post, onNavigate }) {
  const tags = tagList(post);
  const date = fmtDate(post, 'long');

  return (
    <a href={`${BLOG_BASE}/${post.slug}`} onClick={go(onNavigate, post)} className="lb-latest ll-glass">
      <div className="lb-latest__side">
        <div className="lb-tags">
          <span className="lb-tag lb-tag--accent-light">Latest post</span>
          {tags.map(tag => <span key={tag} className="lb-tag">{tag}</span>)}
        </div>
        <div className="lb-meta">
          <time dateTime={post.published_at || undefined}>{date}</time>
          <span>{post.read_time} min read</span>
        </div>
      </div>
      <div className="lb-latest__main">
        <div>
          <h2 className="lb-latest__title">{post.title}</h2>
          {post.excerpt && <p className="lb-latest__excerpt">{post.excerpt}</p>}
        </div>
        <span className="lb-go">
          Read the post
          <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
        </span>
      </div>
    </a>
  );
}

function PostCard({ post, onNavigate, wide }) {
  const tags = tagList(post);
  const date = fmtDate(post, 'short');

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
          <span>{post.read_time} min read</span>
        </div>
        <span className="lb-card__go" aria-hidden="true"><ArrowRight size={14} weight="bold" /></span>
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div className="lb-empty ll-glass">
      <span className="lb-empty__icon" aria-hidden="true"><PencilSimpleLine size={22} weight="duotone" /></span>
      <span className="lb-empty__kicker">Coming soon</span>
      <p>First post is being written. Check back soon.</p>
    </div>
  );
}
