import React from 'react';
import NavBar from './components/navigation/NavBar';
import Button from './components/core/Button';
import Footer from './components/navigation/Footer';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';

const Admin = React.lazy(() => import('./pages/Admin'));
const GrowCFL = React.lazy(() => import('./pages/GrowCFL'));

function getInitialState() {
  const path = window.location.pathname;
  if (path === '/admin') return { page: 'Admin', slug: null };
  if (path.startsWith('/news/')) return { page: 'BlogPost', slug: path.slice(6) };
  if (path === '/privacy') return { page: 'Privacy', slug: null };
  if (path === '/terms') return { page: 'Terms', slug: null };
  if (window.location.hash === '#grow') return { page: 'GrowCFL', slug: null };
  return { page: 'Home', slug: null };
}

function App() {
  const init = getInitialState();
  const [page, setPage] = React.useState(init.page);
  const [postSlug, setPostSlug] = React.useState(init.slug);

  if (page === 'Admin') return <React.Suspense fallback={null}><Admin /></React.Suspense>;
  if (page === 'GrowCFL') return <React.Suspense fallback={null}><GrowCFL /></React.Suspense>;

  function handleNavigate(target, param) {
    if (target === 'BlogPost' && param) {
      setPostSlug(param);
      setPage('BlogPost');
      window.history.pushState({}, '', `/news/${param}`);
    } else {
      setPage(target);
      window.history.pushState({}, '', target === 'Home' ? '/' : `/${target.toLowerCase()}`);
    }
  }

  const nav = ['Home', 'Mission', 'Pricing', 'LoogoNews'];
  let body;
  if (page === 'Home') body = <Home onNavigate={handleNavigate} />;
  else if (page === 'Mission') body = <Mission onNavigate={handleNavigate} />;
  else if (page === 'Pricing') body = <Pricing onNavigate={handleNavigate} />;
  else if (page === 'LoogoNews') body = <Blog onNavigate={handleNavigate} />;
  else if (page === 'BlogPost') body = <BlogPost slug={postSlug} onNavigate={handleNavigate} />;
  else if (page === 'Contact') body = <Contact />;
  else if (page === 'Privacy') body = <Privacy onNavigate={handleNavigate} />;
  else if (page === 'Terms') body = <Terms onNavigate={handleNavigate} />;
  else body = <Home onNavigate={handleNavigate} />;

  return (
    <div>
      <a
        href="https://api.leadconnectorhq.com/widget/bookings/outbound-reach-aoFaC"
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
      >
        <span style={{ color: 'var(--cyan-500)', fontSize: 7 }}>●</span>
        Book a free strategy call
        <span style={{ color: 'var(--cyan-500)', fontSize: 11 }}>→</span>
      </a>
      <NavBar items={nav} active={page} onNavigate={handleNavigate}
        cta={<Button size="sm" variant="primary" onClick={() => setPage('Contact')}>Book a free call</Button>}
      />
      <div onClick={e => { if (e.target.closest('a') && !e.target.closest('nav')) e.preventDefault(); }}>{body}</div>
      <Footer note="One platform to launch, grow, and automate your online business. Replace 10–15 tools and save $400+ a month."
        columns={[
          { title: 'Company', links: ['Mission', 'Contact'] },
          { title: 'Platform', links: ['Pricing', 'LoogoNews'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
        ]}
        onNavigate={p => handleNavigate(p === 'Launch notes' ? 'LoogoNews' : p)}
        onAdmin={() => setPage('Admin')} />
    </div>
  );
}

export default App;
