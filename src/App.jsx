import React from 'react';
import NavBar from './components/navigation/NavBar';
import Button from './components/core/Button';
import Footer from './components/navigation/Footer';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import { BOOKING_URL, openBooking } from './lib/booking';
import { applyHead, headForPage, pathForPage, routeForPath } from './lib/seo';

const Admin = React.lazy(() => import('./pages/Admin'));
const GrowCFL = React.lazy(() => import('./pages/GrowCFL'));
const AIVoice = React.lazy(() => import('./pages/AIVoice'));

function getInitialState() {
  // The Central Florida page used to live behind #grow, which is not a URL a
  // search engine can index. It has a real path now; honour the old fragment so
  // links already in the wild still land somewhere.
  if (window.location.hash === '#grow') {
    window.history.replaceState({}, '', pathForPage('GrowCFL'));
    return { page: 'GrowCFL', slug: null };
  }
  return routeForPath(window.location.pathname);
}

function App() {
  const init = getInitialState();
  const [page, setPage] = React.useState(init.page);
  const [postSlug, setPostSlug] = React.useState(init.slug);

  const navigate = React.useCallback((target, param, { push = true } = {}) => {
    const slug = target === 'BlogPost' ? param : null;
    setPage(target);
    setPostSlug(slug);
    if (push) {
      const next = pathForPage(target, slug);
      if (next !== window.location.pathname) window.history.pushState({}, '', next);
      window.scrollTo(0, 0);
    }
    if (window.fbq) window.fbq('track', 'PageView');
  }, []);

  // Back and forward buttons previously did nothing: the URL changed but the
  // view did not, so a visitor (and any crawler following history) got stuck.
  React.useEffect(() => {
    const onPop = () => {
      const next = routeForPath(window.location.pathname);
      setPage(next.page);
      setPostSlug(next.slug);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // A post's title and description depend on data BlogPost fetches, so it sets
  // its own head once the post arrives. Everything else is known up front.
  React.useEffect(() => {
    if (page === 'BlogPost' || page === 'Admin') return;
    applyHead(headForPage(page));
  }, [page]);

  // Internal links are now real hrefs so crawlers can follow them. Intercept the
  // clicks that stay on the site and route them without a reload; let modified
  // clicks, new tabs, and external links behave normally.
  const handleLinkClick = React.useCallback((e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const anchor = e.target.closest('a[href]');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    const href = anchor.getAttribute('href');
    if (href === '#' || href.startsWith('#')) { e.preventDefault(); return; }

    const dest = new URL(anchor.href, window.location.origin);
    if (dest.origin !== window.location.origin) return;

    const next = routeForPath(dest.pathname);
    if (next.page === 'NotFound') return;
    e.preventDefault();
    navigate(next.page, next.slug);
  }, [navigate]);

  if (page === 'Admin') return <React.Suspense fallback={null}><Admin /></React.Suspense>;
  if (page === 'GrowCFL') return <React.Suspense fallback={null}><GrowCFL /></React.Suspense>;
  if (page === 'AIVoice') return <React.Suspense fallback={null}><AIVoice /></React.Suspense>;

  const nav = ['Home', 'Mission', 'AIVoice', 'Pricing', 'LoogoNews'];
  let body;
  if (page === 'Home') body = <Home onNavigate={navigate} />;
  else if (page === 'Mission') body = <Mission onNavigate={navigate} />;
  else if (page === 'Pricing') body = <Pricing onNavigate={navigate} />;
  else if (page === 'LoogoNews') body = <Blog onNavigate={navigate} />;
  else if (page === 'BlogPost') body = <BlogPost slug={postSlug} onNavigate={navigate} />;
  else if (page === 'Privacy') body = <Privacy onNavigate={navigate} />;
  else if (page === 'Terms') body = <Terms onNavigate={navigate} />;
  else body = <NotFound onNavigate={navigate} />;

  return (
    <div>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          height: 36, background: 'var(--ink-900)',
          borderBottom: '1px solid rgba(216,211,198,0.25)',
          textDecoration: 'none',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ink-300)',
          transition: 'background 160ms ease',
          overflow: 'hidden',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(216,211,198,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink-900)'; }}
        onClick={() => { if (window.fbq) window.fbq('track', 'Schedule'); }}
      >
        <span style={{ color: 'var(--cyan-500)', fontSize: 7 }}>●</span>
        Book a free strategy call
        <span style={{ color: 'var(--cyan-500)', fontSize: 11 }}>→</span>
      </a>
      <NavBar items={nav} active={page} onNavigate={navigate}
        cta={<Button size="sm" variant="primary" onClick={openBooking}>Book a free call</Button>}
      />
      <div onClick={handleLinkClick}>{body}</div>
      <Footer note="One platform to launch, grow, and automate your online business. Replace 10–15 tools and save $400+ a month."
        columns={[
          { title: 'Company', links: ['Mission', 'Book a Call'] },
          { title: 'Platform', links: ['Pricing', 'LoogoNews', 'Central Florida'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
          { title: 'Follow', links: ['Facebook', 'Instagram', 'LinkedIn'] },
        ]}
        onNavigate={p => navigate(p === 'Launch notes' ? 'LoogoNews' : p)}
        onAdmin={() => navigate('Admin')} />
    </div>
  );
}

export default App;
