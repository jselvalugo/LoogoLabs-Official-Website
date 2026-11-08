import React from 'react';
import NavBar from './components/navigation/NavBar';
import Button from './components/core/Button';
import Footer from './components/navigation/Footer';
import CookieConsent from './components/feedback/CookieConsent';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Company from './pages/Company';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
// The /consulting page's styles load with the app, not with its lazy chunk, so the
// pre-rendered HTML is styled from the first paint.
import './styles/pages/landing.css';
import './styles/pages/brand-design.css';
import './styles/pages/consulting.css';
import './styles/pages/marketplace.css';
import './styles/pages/game-plan.css';
import SkillsTopBar from './components/navigation/SkillsTopBar';
// Loaded with the app, not lazily: a lazy chunk left the page empty for a beat
// and the footer jumped to the top of the screen while it loaded.
import Marketplace from './pages/Marketplace';
import MarketplaceThankYou from './pages/MarketplaceThankYou';
import Newsletter from './pages/Newsletter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Quizzes from './pages/Quizzes';
import Packages from './pages/Packages';
import PressRelease from './pages/PressRelease';
import BrandPartners from './pages/BrandPartners';
import ServicePackage from './pages/ServicePackage';
import { SERVICE_PACKAGE_BY_PAGE } from './lib/servicePackages';
import { NICHE_BY_PAGE } from './lib/nicheQuizzes';
import { openBooking } from './lib/booking';
import { BLOG_BASE, applyHead, headForPage, pathForPage, routeForPath } from './lib/seo';
import { currentLang, localizePath, syncLangToPath, useLang } from './lib/i18n';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { citySlugFromPage } from './lib/cfl';
import { voiceCitySlugFromPage } from './lib/voiceCities';
import { categorySlugFromPage } from './lib/blogCategories';

const Admin = React.lazy(() => import('./pages/Admin'));
const GrowCFL = React.lazy(() => import('./pages/GrowCFL'));
const GrowCity = React.lazy(() => import('./pages/GrowCity'));
const AIVoice = React.lazy(() => import('./pages/AIVoice'));
const AIVoiceCity = React.lazy(() => import('./pages/AIVoiceCity'));
const AIReceptionist = React.lazy(() => import('./pages/AIReceptionist'));
const ReputationAutopilot = React.lazy(() => import('./pages/ReputationAutopilot'));
const BrandingFunnel = React.lazy(() => import('./pages/BrandingFunnel'));
const BrandDesign = React.lazy(() => import('./pages/BrandDesign'));
const Consulting = React.lazy(() => import('./pages/Consulting'));
const GamePlan = React.lazy(() => import('./pages/GamePlan'));
const NicheQuiz = React.lazy(() => import('./pages/NicheQuiz'));
const ParkSupply = React.lazy(() => import('./pages/ParkSupply'));
const ToolsHub = React.lazy(() => import('./pages/tools/ToolsHub'));
const TOOL_PAGES = {
  ToolReviewLink: React.lazy(() => import('./pages/tools/ReviewLinkTool')),
  ToolMissedCall: React.lazy(() => import('./pages/tools/MissedCallTool')),
  ToolUtm: React.lazy(() => import('./pages/tools/UtmTool')),
};

function getInitialState(initialPath) {
  // The build pre-renders each page on the server, where there is no window;
  // it passes the path in instead.
  if (initialPath) return routeForPath(initialPath);
  // The Central Florida page used to live behind #grow, which is not a URL a
  // search engine can index. It has a real path now; honour the old fragment so
  // links already in the wild still land somewhere.
  if (window.location.hash === '#grow') {
    window.history.replaceState({}, '', pathForPage('GrowCFL'));
    return { page: 'GrowCFL', slug: null };
  }
  return routeForPath(window.location.pathname);
}

function App({ initialPath }) {
  const init = getInitialState(initialPath);
  const [page, setPage] = React.useState(init.page);
  const [postSlug, setPostSlug] = React.useState(init.slug);
  const es = useLang() === 'es';
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const navigate = React.useCallback((target, param, { push = true } = {}) => {
    const slug = target === 'BlogPost' ? param : null;
    setPage(target);
    setPostSlug(slug);
    if (push) {
      // Stay in the visitor's language: internal paths are English, so add /es.
      const next = localizePath(pathForPage(target, slug), currentLang());
      if (next !== window.location.pathname) window.history.pushState({}, '', next);
      window.scrollTo(0, 0);
    }
    if (window.fbq) window.fbq('track', 'PageView');
  }, []);

  // Back and forward buttons previously did nothing: the URL changed but the
  // view did not, so a visitor (and any crawler following history) got stuck.
  React.useEffect(() => {
    const onPop = () => {
      syncLangToPath(window.location.pathname);
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
    applyHead(headForPage(page, es ? 'es' : 'en'));
  }, [page, es]);

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
  const citySlug = citySlugFromPage(page);
  if (page === 'GrowCFL' || citySlug) {
    return (
      <><CookieConsent /><div onClick={handleLinkClick}><React.Suspense fallback={null}>
        {citySlug ? <GrowCity key={citySlug} slug={citySlug} /> : <GrowCFL />}
      </React.Suspense></div></>
    );
  }
  const voiceSlug = voiceCitySlugFromPage(page);
  if (voiceSlug) {
    return (
      <><CookieConsent /><div onClick={handleLinkClick}><React.Suspense fallback={null}>
        <AIVoiceCity key={voiceSlug} slug={voiceSlug} />
      </React.Suspense></div></>
    );
  }
  if (page === 'AIReceptionist') return <><CookieConsent /><React.Suspense fallback={null}><AIReceptionist /></React.Suspense></>;
  if (page === 'ReputationAutopilot') return <><CookieConsent /><React.Suspense fallback={null}><ReputationAutopilot /></React.Suspense></>;
  if (page === 'BrandingFunnel') return <><CookieConsent /><React.Suspense fallback={null}><BrandingFunnel /></React.Suspense></>;
  if (page === 'BrandDesign') return <><CookieConsent /><React.Suspense fallback={null}><BrandDesign /></React.Suspense></>;
  if (page === 'Consulting') return <><CookieConsent /><React.Suspense fallback={null}><Consulting /></React.Suspense></>;
  if (page === 'GamePlan') return <><CookieConsent /><React.Suspense fallback={null}><GamePlan /></React.Suspense></>;
  if (NICHE_BY_PAGE[page]) return <><CookieConsent /><React.Suspense fallback={null}><NicheQuiz key={page} page={page} /></React.Suspense></>;
  if (page === 'ParkSupply') return <><CookieConsent /><React.Suspense fallback={null}><ParkSupply /></React.Suspense></>;

  const nav = ['Mission', 'Company'];
  let body;
  if (page === 'Home') body = <Home onNavigate={navigate} />;
  else if (page === 'Mission') body = <Mission onNavigate={navigate} />;
  else if (page === 'AIVoice') body = <React.Suspense fallback={null}><AIVoice /></React.Suspense>;
  else if (page === 'Company') body = <Company onNavigate={navigate} />;
  else if (page === 'Quizzes') body = <Quizzes onNavigate={navigate} />;
  else if (page === 'Tools') body = <React.Suspense fallback={null}><ToolsHub /></React.Suspense>;
  else if (TOOL_PAGES[page]) { const Tool = TOOL_PAGES[page]; body = <React.Suspense fallback={null}><Tool /></React.Suspense>; }
  else if (page === 'Packages') body = <Packages onNavigate={navigate} />;
  else if (page === 'PressRelease') body = <PressRelease />;
  else if (page === 'BrandPartners') body = <BrandPartners />;
  else if (SERVICE_PACKAGE_BY_PAGE[page]) body = <ServicePackage key={page} page={page} />;
  else if (page === 'LoogoNews' || categorySlugFromPage(page)) body = <Blog onNavigate={navigate} category={categorySlugFromPage(page)} />;
  else if (page === 'BlogPost') body = <BlogPost slug={postSlug} onNavigate={navigate} />;
  else if (page === 'Marketplace') body = <Marketplace />;
  else if (page === 'MarketplaceThankYou') body = <MarketplaceThankYou />;
  else if (page === 'Newsletter') body = <Newsletter />;
  else if (page === 'Privacy') body = <Privacy onNavigate={navigate} />;
  else if (page === 'Terms') body = <Terms onNavigate={navigate} />;
  else body = <NotFound onNavigate={navigate} />;

  return (
    <div className="ll-shell">
      {page !== 'Marketplace' && page !== 'MarketplaceThankYou' && <SkillsTopBar es={es} onNavigate={navigate} />}
      <NavBar items={nav} active={categorySlugFromPage(page) ? 'LoogoNews' : page} onNavigate={navigate} overHero={false} home={page === 'Home'}
        feature={{ page: 'LoogoNews', label: es ? 'Últimas noticias' : 'Latest News' }}
        cta={<Button size="sm" variant="primary" iconRight={<span>→</span>} onClick={openBooking}>{es ? 'Agenda una llamada' : 'Book a call'}</Button>}
      />
      <div onClick={handleLinkClick}>
        {!mounted || reduce ? body : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={(categorySlugFromPage(page) ? 'LoogoNews' : page) + (postSlug || '')} className="ll-page"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}>
              {body}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <Footer
        columns={[
          { title: es ? 'Empresa' : 'Company', links: ['Mission', 'Company', 'Industry LoogoBlog', 'Book a Call'] },
          { title: es ? 'Negocios locales' : 'Local businesses', links: ['AI Voice', 'Central Florida', 'Packaged Services', 'Free Tools'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Preferences'] },
          { title: es ? 'Síguenos' : 'Follow', links: ['Facebook', 'Instagram', 'LinkedIn'] },
        ]}
        style={page === 'Home' ? { marginTop: 0 } : undefined}
        onNavigate={p => navigate(p === 'Launch notes' ? 'LoogoNews' : p)}
        onAdmin={() => navigate('Admin')} />
      <CookieConsent />
    </div>
  );
}

export default App;
