import React from 'react';
import NavBar from './components/navigation/NavBar';
import Button from './components/core/Button';
import Footer from './components/navigation/Footer';
import Home from './pages/Home';
import Mission from './pages/Mission';
import LaunchPost from './pages/LaunchPost';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';

function App() {
  const [page, setPage] = React.useState('Home');
  const [blogSlug, setBlogSlug] = React.useState(null);

  if (page === 'Admin') return <Admin />;

  function handleNavigate(target, param) {
    if (target === 'BlogPost' && param) {
      setBlogSlug(param);
      setPage('BlogPost');
    } else {
      setPage(target);
    }
  }

  const nav = ['Home', 'Mission', 'Launch'];
  let body;
  if (page === 'Home') body = <Home onNavigate={handleNavigate} />;
  else if (page === 'Mission') body = <Mission onNavigate={handleNavigate} />;
  else if (page === 'Launch') body = <LaunchPost onNavigate={handleNavigate} />;
  else if (page === 'Blog') body = <Blog onNavigate={handleNavigate} />;
  else if (page === 'BlogPost') body = <BlogPost slug={blogSlug} onNavigate={handleNavigate} />;
  else if (page === 'Contact') body = <Contact />;
  else body = <Home onNavigate={handleNavigate} />;

  const isBlog = page === 'Blog' || page === 'BlogPost';

  return (
    <div>
      <NavBar items={nav} active={isBlog ? null : page} onNavigate={handleNavigate}
        cta={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => handleNavigate('Blog')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 13px',
                background: isBlog ? 'rgba(0,229,255,0.08)' : 'transparent',
                border: `1px solid ${isBlog ? 'var(--cyan-500)' : 'rgba(0,229,255,0.45)'}`,
                borderRadius: 'var(--radius-2)',
                boxShadow: isBlog ? '2px 2px 0 var(--cyan-500)' : 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isBlog ? 'var(--cyan-700)' : 'var(--ink-400)',
                transition: 'all 90ms ease',
              }}
              onMouseEnter={e => {
                if (!isBlog) {
                  e.currentTarget.style.borderColor = 'var(--cyan-500)';
                  e.currentTarget.style.color = 'var(--cyan-700)';
                  e.currentTarget.style.boxShadow = '2px 2px 0 var(--cyan-500)';
                  e.currentTarget.style.background = 'rgba(0,229,255,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!isBlog) {
                  e.currentTarget.style.borderColor = 'rgba(0,229,255,0.45)';
                  e.currentTarget.style.color = 'var(--ink-400)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ color: 'var(--cyan-500)', fontSize: 14, lineHeight: 1 }}>●</span>
              Signal
            </button>
            <Button size="sm" variant="primary" onClick={() => setPage('Contact')}>Talk to us</Button>
          </div>
        } />
      <div onClick={e => { if (e.target.closest('a') && !e.target.closest('nav')) e.preventDefault(); }}>{body}</div>
      <Footer note="Operational software for analysis and reporting in industries that enterprise vendors left behind."
        columns={[
          { title: 'Company', links: ['Mission', 'Contact'] },
          { title: 'Products', links: ['Distillr'] },
          { title: 'Updates', links: ['Signal', 'Launch notes'] },
        ]}
        onNavigate={p => handleNavigate(p === 'Signal' ? 'Blog' : p === 'Launch notes' ? 'Launch' : p)}
        onAdmin={() => setPage('Admin')} />
    </div>
  );
}

export default App;
