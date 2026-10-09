import React from 'react';
import { BOOKING_URL } from '../lib/booking';
import { BLOG_INDEX, applyHead, headForPost } from '../lib/seo';
import { EVENT_THEME, isEventPost } from '../lib/featuredEvent';
import { hasConsent } from '../lib/cookieConsent';
import { ArrowLeft, ArrowRight, Star } from '@phosphor-icons/react';
import '../styles/pages/blog.css';

export default function BlogPost({ slug, onNavigate }) {
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

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
      <div className="lb-page">
        <div className="lb-wrap lb-post-state" role="status" aria-live="polite">
          <span className="lb-skel lb-skel--hero" />
          <span className="lb-skel lb-skel--line" />
          <span className="lb-skel lb-skel--line lb-skel--short" />
          <span className="lb-visually-hidden">Loading post</span>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="lb-page">
        <div className="lb-wrap lb-post-state">
          <div className="lb-notfound ll-glass">
            <span className="lb-empty__kicker">404</span>
            <h1 className="lb-notfound__title">Post not found.</h1>
            <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--pill">
              <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Back to Industry LoogoBlog
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const event = isEventPost(post);

  return (
    <div className={event ? 'lb-page lb-page--event' : 'lb-page'}>
      <div className="lb-wrap">

      {post.featured && !event ? (
        <FeaturedHero post={post} tags={tags} date={date} onNavigate={onNavigate} />
      ) : (
      /* ── HERO HEADER ── */
      <header className="lb-hero ll-forest">
        {/* Back nav: a real breadcrumb link, so the post is not an orphan */}
        <nav aria-label="Breadcrumb" className="lb-hero__nav">
          <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--dark">
            <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Industry LoogoBlog
          </a>
        </nav>

        <div className="lb-hero__body">
          {event && <img src={EVENT_THEME.logo} alt="Lugo's Craft Distillery" className="lb-event-logo" />}
          <h1 className="lb-hero__title">{post.title}</h1>

          <div className="lb-hero__meta">
            <span className="lb-hero__author">
              <span className="lb-avatar">{post.author ? post.author[0].toUpperCase() : 'L'}</span>
              {post.author}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.published_at || undefined}>{date}</time>
            <span aria-hidden="true">·</span>
            <span>{post.read_time} min read</span>
          </div>
        </div>
      </header>
      )}

      {/* ── BODY ── */}
      <div className="ll-post-layout lb-post">

          {/* Article content */}
          <article className="lb-article">
            {post.excerpt && !post.featured && (
              <p className="lb-standfirst">{post.excerpt}</p>
            )}

            <div className="lb-prose">
              {renderMarkdown(post.content, { dropCap: !!post.featured })}
            </div>

            {tags.length > 0 && (
              <div className="lb-tags lb-post__tags">
                {tags.map(tag => <span key={tag} className="lb-tag">{tag}</span>)}
              </div>
            )}

            {/* Author bio: the personal signature on every post, not just a byline */}
            {post.author === 'David Selva' && (
              <div className="lb-bio ll-glass">
                <img src="/founder-david-selva.jpg" alt="David Selva" width={56} height={56} className="lb-bio__img" />
                <div>
                  <div className="lb-bio__kicker">Written by</div>
                  <div className="lb-bio__name">David Selva</div>
                  <p className="lb-bio__text">
                    Founder of Loogo Labs. I build and run the follow-up, booking and review systems that
                    keep local service businesses from losing leads, and Industry LoogoBlog is where I write down
                    what holds up once those systems are live, and what doesn't.
                  </p>
                </div>
              </div>
            )}

            {/* CTA box */}
            <div className="lb-cta ll-forest">
              <h3 className="lb-cta__title">{event ? 'Save your spot. It is free to attend.' : 'Want this running in your business?'}</h3>
              <p className="lb-cta__text">
                {event
                  ? 'Register as a guest, grab a $25 VIP early-access pass, or request an $80 vendor table.'
                  : 'We set it up, run it, and optimize it every month. You just run your business.'}
              </p>
              <a
                href={event ? EVENT_URL : BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lb-cta__btn"
                onClick={() => { if (!event && window.fbq) window.fbq('track', 'Schedule'); }}
              >
                {event ? 'Register for the event' : 'Book a free strategy call'}
                <span className="lb-go__icon"><ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
              </a>
            </div>

            {/* Back link */}
            <div className="lb-post__back">
              <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--pill">
                <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Back to Industry LoogoBlog
              </a>
            </div>
          </article>
      </div>
      </div>
    </div>
  );
}

// Header for the featured post: a full editorial opener on a floating forest
// panel (featured kicker, display-size title, the excerpt as a standfirst and
// a byline strip). A reading-progress bar rides the top of the viewport.
function FeaturedHero({ post, tags, date, onNavigate }) {
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
        <nav aria-label="Breadcrumb" className="lb-hero__nav">
          <a href={BLOG_INDEX} onClick={e => { e.preventDefault(); onNavigate('LoogoNews'); }} className="lb-back lb-back--dark">
            <ArrowLeft size={14} weight="bold" aria-hidden="true" /> Industry LoogoBlog
          </a>
          <span className="lb-tag lb-tag--accent"><Star size={11} weight="fill" aria-hidden="true" /> Featured post</span>
        </nav>

        <div className="lb-hero__body">
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
              <span className="ll-feature-cell__k">Written by</span>
              <span className="ll-feature-cell__v ll-feature-cell__v--name">{post.author}</span>
            </span>
          </div>
          <div className="ll-feature-cell">
            <span className="ll-feature-cell__k">Published</span>
            <time dateTime={post.published_at || undefined} className="ll-feature-cell__v">{date}</time>
          </div>
          <div className="ll-feature-cell">
            <span className="ll-feature-cell__k">Read time</span>
            <span className="ll-feature-cell__v">{post.read_time} min</span>
          </div>
        </div>
      </header>
    </>
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
    if (trimmed.startsWith('## ')) return <h2 key={i}>{inlineRender(trimmed.slice(3))}</h2>;
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

const EVENT_URL = 'https://cards-and-cocktails.netlify.app/#register';
