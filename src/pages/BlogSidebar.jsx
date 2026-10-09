import React from 'react';
import { BLOG_BASE } from '../lib/seo';
import { ArrowRight, Sparkle, X } from '@phosphor-icons/react';

// Tags/titles that mark a post as written for Central Florida small businesses.
export const CFL_RE = /central florida|\bcfl\b|orlando|kissimmee|sanford|lakeland|winter park|small business|local business/i;

export const tagsOf = p => (p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
const daysLive = p => Math.max(1, (Date.now() - new Date(p.published_at || p.created_at || Date.now())) / 864e5);

// "Best ranked": views earned per day live (so a strong new post isn't buried by
// an older one's raw total), with a boost for editor-featured posts.
export const rankScore = p => (p.views || 0) / Math.sqrt(daysLive(p)) + (p.featured ? 25 : 0);

export function buildSidebar(posts) {
  const top = (list, fn, n = 5) => [...list].sort((a, b) => fn(b) - fn(a)).slice(0, n);
  const cfl = posts.filter(p => CFL_RE.test(`${p.tags || ''} ${p.title}`));
  const counts = {};
  posts.forEach(p => tagsOf(p).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  return {
    mostViewed: top(posts, p => p.views || 0),
    bestRanked: top(posts, rankScore),
    cfl: top(cfl, rankScore),
    quickReads: top(posts.filter(p => (p.read_time || 99) <= 5), p => p.views || 0, 4),
    topics: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12),
  };
}

function PostLink({ post, index, meta, onNavigate, onPick }) {
  return (
    <li>
      <a
        className="ln-side__link"
        href={`${BLOG_BASE}/${post.slug}`}
        onClick={e => { e.preventDefault(); onPick?.(); onNavigate('BlogPost', post.slug); }}
      >
        {index != null && <span className="ln-side__num">{String(index + 1).padStart(2, '0')}</span>}
        <span className="ln-side__title">{post.title}</span>
        {meta && <span className="ln-side__meta">{meta}</span>}
      </a>
    </li>
  );
}

function Section({ label, children }) {
  return (
    <section className="ln-side__section">
      <h2 className="ln-side__label">{label}</h2>
      {children}
    </section>
  );
}

function SidebarBody({ posts, topic, onTopic, onNavigate, onPick }) {
  const s = React.useMemo(() => buildSidebar(posts), [posts]);
  const views = p => `${(p.views || 0).toLocaleString('en-US')} views`;
  const list = (items, meta, numbered) => (
    <ol className="ln-side__list">
      {items.map((p, i) => <PostLink key={p.id} post={p} index={numbered ? i : null} meta={meta?.(p)} onNavigate={onNavigate} onPick={onPick} />)}
    </ol>
  );

  return (
    <>
      {s.cfl.length > 0 && (
        <Section label="Central Florida small business">{list(s.cfl, p => `${p.read_time} min read`)}</Section>
      )}
      <Section label="Most viewed">{list(s.mostViewed, views, true)}</Section>
      <Section label="Best ranked">{list(s.bestRanked, p => (p.featured ? "Editor's pick" : views(p)), true)}</Section>
      {s.quickReads.length > 0 && (
        <Section label="Quick reads · 5 min or less">{list(s.quickReads, p => `${p.read_time} min`)}</Section>
      )}
      {s.topics.length > 0 && (
        <Section label="Browse by topic">
          <div className="ln-side__tags">
            {s.topics.map(([t, n]) => (
              <button
                key={t}
                type="button"
                className="ln-side__tag"
                aria-pressed={topic === t}
                onClick={() => { onTopic(topic === t ? null : t); onPick?.(); }}
              >
                {t} <span>{n}</span>
              </button>
            ))}
          </div>
        </Section>
      )}
      <Section label="Explore">
        <ul className="ln-side__list">
          {[['GrowCFL', 'Grow in Central Florida'], ['Quizzes', 'Free marketing quizzes'], ['Packages', 'Packaged services']].map(([page, text]) => (
            <li key={page}>
              <button type="button" className="ln-side__link" onClick={() => { onPick?.(); onNavigate(page); }}>
                <span className="ln-side__title ln-side__title--go">{text} <ArrowRight size={13} weight="bold" aria-hidden="true" /></span>
              </button>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

// Sticky glass panel beside the post list on wide screens; on narrow screens it
// collapses into a floating button that opens the same panel as a drawer.
export default function BlogSidebar(props) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <aside className="ln-side ln-side--docked" aria-label="Industry LoogoBlog highlights">
        <SidebarBody {...props} />
      </aside>

      <button type="button" className="ln-side__fab" aria-expanded={open} aria-controls="ln-side-drawer" onClick={() => setOpen(o => !o)}>
        {open ? <><X size={14} weight="bold" aria-hidden="true" /> Close</> : <><Sparkle size={14} weight="fill" aria-hidden="true" /> Top posts</>}
      </button>
      {open && <div className="ln-side__scrim" onClick={() => setOpen(false)} />}
      <aside id="ln-side-drawer" className={`ln-side ln-side--drawer${open ? ' is-open' : ''}`} aria-label="Industry LoogoBlog highlights" hidden={!open}>
        <SidebarBody {...props} onPick={() => setOpen(false)} />
      </aside>
    </>
  );
}
