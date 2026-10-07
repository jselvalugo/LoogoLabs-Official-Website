// Single source of truth for everything a crawler reads: the URL table, the
// per-route title/description, and the JSON-LD builders.
//
// This module is deliberately framework-free ESM so that two very different
// consumers can share it — the React app calls applyHead() on every client-side
// navigation, and scripts/generate-seo-assets.mjs imports the same functions at
// build time to write static HTML, the sitemap, and the feed. One definition,
// so the rendered page and the pre-rendered page can never disagree.

import { NICHE_QUIZZES } from './nicheQuizzes.js';
import { GROW_FAQ, SERVICE_AREA } from './content.js';
import { SERVICE_PACKAGES } from './servicePackages.js';
import { CITIES, CITY_BY_SLUG, cityPath, cityPageKey, citySlugFromPage } from './cfl.js';
import { VOICE_BASE, VOICE_CITIES, VOICE_CITY_BY_SLUG, voiceCityPath, voiceCityPageKey, voiceCitySlugFromPage } from './voiceCities.js';

export const SITE = {
  origin: 'https://loogolabs.com',
  name: 'Loogo Labs',
  legalName: 'David Selva', // sole proprietor d/b/a Loogo Labs
  locale: 'en_US',
  lang: 'en',
  author: 'David Selva',
  founder: 'David Selva',
  email: 'david@loogolabs.com',
  // Public business mailing address, shown in the footer and the schema.
  address: {
    recipient: 'David Selva',
    streetAddress: '2875 S Orange Ave STE 500 #6412',
    addressLocality: 'Orlando',
    addressRegion: 'FL',
    postalCode: '32806-5471',
    addressCountry: 'US',
    countryName: 'United States',
  },
  logo: '/logo.png',
  ogImage: '/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 628,
  themeColor: '#1a1f14',
  description:
    'One platform to launch, grow, and automate your business — CRM, follow-up automation, reputation management, and marketing, set up and run for you.',
  tagline: 'Marketing Systems, Automation, All-in-One CRM',
  // Profiles that corroborate the Organization entity. Add Instagram, LinkedIn
  // and the Google Business Profile URL here as they go live — each one should
  // be a page that actually loads, since a sameAs pointing somewhere dead is a
  // weak negative signal rather than a neutral one.
  // Canonical profile URLs only — no share or campaign parameters. The Instagram
  // link is commonly copied from a QR share as ...?igsi=…&utm_source=qr; those
  // identify the share, not the profile, and would make this a non-canonical URL
  // for something whose whole job is to be the profile's stable identity.
  sameAs: [
    'https://www.facebook.com/loogolabs',
    'https://www.instagram.com/loogolabs.fl',
    'https://www.linkedin.com/company/loogolabs/',
  ],
};

// Topics the business is an authority on. Feeds schema.org knowsAbout and the
// llms.txt key facts, so AI answer engines can match the entity to queries like
// "marketing agency in Orlando" or "local SEO in Central Florida".
export const KNOWS_ABOUT = [
  'Local SEO',
  'Google Business Profile optimization',
  'Reputation and review management',
  'Marketing automation',
  'CRM setup and management',
  'Lead follow-up and missed-call text-back',
  'AI voice agents and AI receptionists',
  'Facebook and Google Ads management',
];

export const url = (path = '/') => new URL(path, SITE.origin).href;

// ── URL table ────────────────────────────────────────────────────────────────
// `page` is the internal component key App.jsx switches on. Every indexable
// route gets exactly one canonical path, so a page can never be reachable at two
// URLs and split its own ranking signals.

export const ROUTES = [
  {
    page: 'Home',
    path: '/',
    title: `AI Voice Agent`,
    description: SITE.description,
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    page: 'Mission',
    path: '/mission',
    title: `Our Mission — One Platform, Not 15 Tools | ${SITE.name}`,
    description:
      'Most owners run their business across 10–15 disconnected tools. We built one platform that replaces them, and we handle setup, training, and support.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    page: 'Company',
    path: '/company',
    title: `Company — Meet Founder ${SITE.founder} | ${SITE.name}`,
    description:
      `${SITE.name} is founded by ${SITE.founder}, a professional from Coamo, Puerto Rico with a background in CLM, government contracting, consulting, project management and marketing — now building in Celebration, Florida.`,
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    page: 'LoogoNews',
    path: '/loogonews',
    title: `LoogoNews — Automation Guides for Local Business | ${SITE.name}`,
    description:
      'Guides on lead follow-up, missed-call text-back, reviews, and automation — written for owners of HVAC, dental, salon, gym, and other service businesses.',
    priority: '0.9',
    changefreq: 'daily',
  },
  {
    page: 'GrowCFL',
    path: '/grow',
    label: 'Central Florida',
    title: `Central Florida Local SEO & Marketing Automation | ${SITE.name}`,
    description:
      'Local SEO, automated lead follow-up, and review generation for businesses in Orlando, Kissimmee, Celebration, and across Central Florida.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  ...CITIES.map((c) => ({
    page: cityPageKey(c.slug),
    path: cityPath(c.slug),
    label: `${c.name}, FL`,
    title: `${c.name}, FL Local SEO & Marketing Automation | ${SITE.name}`,
    description: `Local SEO, Google Business Profile, review automation, and instant lead follow-up for ${c.name} businesses. ${c.intro.split('. ')[0]}.`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
  {
    page: 'AIVoice',
    path: '/ai-voice',
    title: `AI Voice Agents for Local Service Businesses | ${SITE.name}`,
    description:
      'An AI voice agent that answers every call, books the job, and never puts a customer on hold — set up and managed for local service businesses.',
    priority: '0.8',
    changefreq: 'monthly',
    image: '/og-image-ai-voice.jpg',
  },
  ...VOICE_CITIES.map((c) => ({
    page: voiceCityPageKey(c.slug),
    path: voiceCityPath(c.slug),
    label: `AI Voice Agent — ${c.name}, FL`,
    title: `AI Voice Agent for ${c.name}, FL Businesses | ${SITE.name}`,
    description: `A 24/7 AI voice agent that answers, qualifies, and books calls for ${c.name} businesses in English and Spanish. ${c.intro.split('. ')[0]}.`,
    priority: '0.7',
    changefreq: 'monthly',
    image: '/og-image-ai-voice.jpg',
  })),
  {
    page: 'AIReceptionist',
    path: '/ai-receptionist',
    title: `AI Receptionist for Local Service Businesses | ${SITE.name}`,
    description:
      'A full-time AI receptionist that answers every call, books the appointment, and never calls out sick — for a fraction of what one payroll costs. Take the free 60-second fit check.',
    priority: '0.8',
    changefreq: 'monthly',
    image: '/og-image-ai-voice.jpg',
  },
  {
    page: 'ReputationAutopilot',
    path: '/reputation-autopilot',
    title: `Automated Review & Reputation Management | ${SITE.name}`,
    description:
      'Every completed job automatically becomes a review request — no spreadsheet, no sticky note, no forgetting. Take the free 60-second fit check.',
    priority: '0.8',
    changefreq: 'monthly',
    image: '/og-image-ai-voice.jpg',
  },
  {
    page: 'Quizzes',
    path: '/quizzes',
    title: `Free Fit-Check Quizzes | ${SITE.name}`,
    description:
      'Quick, free quizzes that tell you whether a Loogo Labs system is a fit for your business — no call required to find out.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  ...NICHE_QUIZZES.map((q) => ({
    page: q.page,
    path: q.path,
    label: q.label,
    title: `${q.label} — Free 60-Second Quiz | ${SITE.name}`,
    description: q.description,
    priority: '0.6',
    changefreq: 'monthly',
  })),
  {
    page: 'Packages',
    path: '/packages',
    title: `Growth Packages & Quick Starts — Done For You | ${SITE.name}`,
    description:
      'Done-for-you growth packages — Launch, Growth and Scale — plus fixed-price quick starts for reviews, Google Business Profile, city pages and press releases.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    page: 'PressRelease',
    path: '/packages/press-release',
    title: `Press Release Writing & Distribution | ${SITE.name}`,
    description:
      'Press release writing and distribution to 350+ news sites, broadcast affiliate pages, and Google News. Fixed prices from $149.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  ...SERVICE_PACKAGES.map((p) => ({
    page: p.page,
    path: p.path,
    title: `${p.metaTitle} | ${SITE.name}`,
    description: p.metaDescription,
    priority: '0.7',
    changefreq: 'monthly',
  })),
  {
    // Unlisted: shared by direct link only — kept out of nav, sitemap, llms.txt
    // and served noindex.
    page: 'ParkSupply',
    path: '/park-supply',
    title: `Park Supply — Pet Waste Stations & Dog Park Amenities | ${SITE.name}`,
    description:
      'Commercial pet waste stations, bags, signage, and dog park amenities for parks, HOAs, and developers. Build a line-item proposal and request a quote.',
    priority: '0.1',
    changefreq: 'monthly',
    unlisted: true,
  },
  {
    page: 'Privacy',
    path: '/privacy',
    title: `Privacy Policy | ${SITE.name}`,
    description: `How ${SITE.name} collects, uses, and protects the information you share with us.`,
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    page: 'Terms',
    path: '/terms',
    title: `Terms of Service | ${SITE.name}`,
    description: `The terms that govern your use of ${SITE.name} services and this website.`,
    priority: '0.3',
    changefreq: 'yearly',
  },
];

export const BLOG_BASE = '/news';
export const BLOG_INDEX = '/loogonews';

const BY_PAGE = new Map(ROUTES.map((r) => [r.page, r]));
const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

// Trailing slashes and casing are the classic way one page ends up indexed as
// three. Normalise before anything else looks at a path.
export function normalizePath(pathname = '/') {
  let p = String(pathname).split('?')[0].split('#')[0].toLowerCase();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

/** Resolve a browser path to { page, slug }. Unknown paths return page 'NotFound'. */
export function routeForPath(pathname) {
  const p = normalizePath(pathname);
  if (p === '/admin') return { page: 'Admin', slug: null };
  if (p.startsWith(`${BLOG_BASE}/`)) {
    const slug = p.slice(BLOG_BASE.length + 1);
    return slug ? { page: 'BlogPost', slug } : { page: 'LoogoNews', slug: null };
  }
  if (p === BLOG_BASE) return { page: 'LoogoNews', slug: null };
  const route = BY_PATH.get(p);
  if (route) return { page: route.page, slug: null };
  return { page: 'NotFound', slug: null };
}

// Pages that have a URL but are deliberately kept out of ROUTES, because they
// must never reach the sitemap or be pre-rendered as indexable.
const UNLISTED_PATHS = { Admin: '/admin' };

/** Canonical path for an internal page key. */
export function pathForPage(page, slug) {
  if (page === 'BlogPost' && slug) return `${BLOG_BASE}/${slug}`;
  return BY_PAGE.get(page)?.path ?? UNLISTED_PATHS[page] ?? '/';
}

export const routeMeta = (page) => BY_PAGE.get(page) ?? null;

// ── Per-page head metadata ───────────────────────────────────────────────────

// Google truncates titles past ~60 characters. Drop the brand suffix (and, for
// very long titles, trim at a word boundary) rather than lose the keywords.
export const fitTitle = (title, max = 60) => {
  const t = String(title || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const bare = t.replace(/\s+\|\s+[^|]+$/, '');
  if (bare.length <= max) return bare;
  return `${bare.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[\s,;:.—-]+$/, '')}…`;
};

const clamp = (text, max = 155) => {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).replace(/[\s,;:.—-]+$/, '')}…`;
};

/** Head metadata for a static route. */
export function headForPage(page) {
  const route = BY_PAGE.get(page);
  if (!route) {
    return {
      title: `Page not found | ${SITE.name}`,
      description: SITE.description,
      canonical: url('/'),
      robots: 'noindex, follow',
      ogType: 'website',
      image: url(SITE.ogImage),
      jsonLd: [],
    };
  }
  return {
    title: fitTitle(route.title),
    description: clamp(route.description),
    canonical: url(route.path),
    robots: route.unlisted ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    image: url(route.image || SITE.ogImage),
    jsonLd: route.unlisted ? [] : jsonLdForPage(page),
  };
}

/** Head metadata for a single post. Accepts an API row or a content/posts.mjs entry. */
export function headForPost(post) {
  if (!post) {
    return {
      title: `Post not found | ${SITE.name}`,
      description: SITE.description,
      canonical: url(BLOG_INDEX),
      robots: 'noindex, follow',
      ogType: 'website',
      image: url(SITE.ogImage),
      jsonLd: [],
    };
  }
  return {
    title: fitTitle(`${post.title} | LoogoNews`),
    description: clamp(post.excerpt || SITE.description),
    canonical: url(`${BLOG_BASE}/${post.slug}`),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'article',
    image: url(SITE.ogImage),
    article: {
      published: isoDate(post.published_at || post.publishedAt),
      modified: isoDate(post.updated_at || post.published_at || post.publishedAt),
      author: post.author || SITE.author,
      tags: splitTags(post.tags),
    },
    jsonLd: [blogPostingLd(post), breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'LoogoNews', path: BLOG_INDEX },
      { name: post.title, path: `${BLOG_BASE}/${post.slug}` },
    ])],
  };
}

export const splitTags = (tags) =>
  String(tags || '').split(',').map((t) => t.trim()).filter(Boolean);

export function isoDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const postalAddressLd = () => {
  const { streetAddress, addressLocality, addressRegion, postalCode, addressCountry } = SITE.address;
  return { '@type': 'PostalAddress', streetAddress, addressLocality, addressRegion, postalCode, addressCountry };
};

export const organizationLd = () => ({
  '@type': 'Organization',
  '@id': url('/#organization'),
  name: SITE.name,
  legalName: SITE.legalName,
  url: url('/'),
  logo: { '@type': 'ImageObject', url: url(SITE.logo) },
  image: url(SITE.ogImage),
  description: SITE.description,
  email: SITE.email,
  address: postalAddressLd(),
  founder: { '@type': 'Person', name: SITE.founder },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: SITE.email,
    areaServed: 'US',
    availableLanguage: 'English',
  },
  areaServed: SERVICE_AREA.map((name) => ({ '@type': 'Place', name })),
  knowsAbout: KNOWS_ABOUT,
  slogan: SITE.tagline,
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
});

export const websiteLd = () => ({
  '@type': 'WebSite',
  '@id': url('/#website'),
  name: SITE.name,
  url: url('/'),
  description: SITE.description,
  inLanguage: SITE.lang,
  publisher: { '@id': url('/#organization') },
});

export const breadcrumbLd = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: url(c.path),
  })),
});

export const blogPostingLd = (post) => {
  const published = isoDate(post.published_at || post.publishedAt);
  return {
    '@type': 'BlogPosting',
    '@id': url(`${BLOG_BASE}/${post.slug}#article`),
    headline: post.title,
    description: post.excerpt || undefined,
    url: url(`${BLOG_BASE}/${post.slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url(`${BLOG_BASE}/${post.slug}`) },
    image: url(SITE.ogImage),
    inLanguage: SITE.lang,
    keywords: splitTags(post.tags).join(', ') || undefined,
    ...(published ? { datePublished: published } : {}),
    ...(isoDate(post.updated_at) ? { dateModified: isoDate(post.updated_at) } : published ? { dateModified: published } : {}),
    ...(post.word_count ? { wordCount: post.word_count } : {}),
    author: { '@type': 'Person', name: post.author || SITE.author },
    publisher: { '@id': url('/#organization') },
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };
};

export const blogLd = (posts = []) => ({
  '@type': 'Blog',
  '@id': url(`${BLOG_INDEX}#blog`),
  name: 'LoogoNews',
  url: url(BLOG_INDEX),
  description: BY_PAGE.get('LoogoNews').description,
  inLanguage: SITE.lang,
  publisher: { '@id': url('/#organization') },
  blogPost: posts.slice(0, 20).map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    url: url(`${BLOG_BASE}/${p.slug}`),
    ...(isoDate(p.published_at || p.publishedAt) ? { datePublished: isoDate(p.published_at || p.publishedAt) } : {}),
  })),
});

export const faqLd = (entries = GROW_FAQ, path = '/grow') => ({
  '@type': 'FAQPage',
  '@id': url(`${path}#faq`),
  mainEntity: entries.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

// Modelled as a service-area business: the work is delivered to the client, not
// from a storefront. The address is the public business mailing address (no
// `geo` node — there is no storefront to locate); areaServed carries the
// geographic signal.
export const localBusinessLd = () => ({
  '@type': 'ProfessionalService',
  '@id': url('/grow#localbusiness'),
  name: `${SITE.name} — Central Florida`,
  url: url('/grow'),
  image: url(SITE.ogImage),
  address: postalAddressLd(),
  description:
    'Central Florida marketing agency based in Orlando: local SEO, marketing automation, AI voice agents, and reputation management for service businesses.',
  email: SITE.email,
  knowsAbout: KNOWS_ABOUT,
  parentOrganization: { '@id': url('/#organization') },
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  areaServed: SERVICE_AREA.map((name) => ({
    '@type': 'City',
    name,
    containedInPlace: { '@type': 'State', name: 'Florida' },
  })),
  priceRange: '$$',
});

// A city page describes the same business serving one city, so it points at the
// hub's LocalBusiness node instead of minting a second business entity.
export const cityServiceLd = (city) => ({
  '@type': 'Service',
  '@id': url(`${cityPath(city.slug)}#service`),
  name: `Local SEO & marketing automation in ${city.name}, FL`,
  serviceType: 'Local SEO and marketing automation',
  url: url(cityPath(city.slug)),
  description: city.intro,
  provider: { '@id': url('/grow#localbusiness') },
  areaServed: {
    '@type': 'City',
    name: city.name,
    containedInPlace: { '@type': 'AdministrativeArea', name: `${city.county}, Florida` },
  },
});

// Same business, one more service: points at the hub's LocalBusiness node.
export const voiceCityServiceLd = (city) => ({
  '@type': 'Service',
  '@id': url(`${voiceCityPath(city.slug)}#service`),
  name: `AI voice agent in ${city.name}, FL`,
  serviceType: 'AI voice agent and call answering',
  url: url(voiceCityPath(city.slug)),
  description: city.intro,
  provider: { '@id': url('/grow#localbusiness') },
  availableLanguage: ['English', 'Spanish'],
  areaServed: {
    '@type': 'City',
    name: city.name,
    containedInPlace: { '@type': 'AdministrativeArea', name: `${city.county}, Florida` },
  },
});

/** The JSON-LD graph nodes a given static page should carry. */
export function jsonLdForPage(page) {
  const crumbBase = { name: 'Home', path: '/' };
  const route = BY_PAGE.get(page);
  const nodes = [];
  if (page === 'Home') {
    nodes.push({
      '@type': 'WebPage',
      '@id': url('/#webpage'),
      url: url('/'),
      name: route.title,
      description: route.description,
      isPartOf: { '@id': url('/#website') },
      about: { '@id': url('/#organization') },
    });
  } else if (route) {
    const citySlug = citySlugFromPage(page);
    const voiceSlug = voiceCitySlugFromPage(page);
    nodes.push(breadcrumbLd(citySlug
      ? [crumbBase, { name: 'Central Florida', path: '/grow' }, { name: CITY_BY_SLUG.get(citySlug).name, path: route.path }]
      : voiceSlug
        ? [crumbBase, { name: 'AI Voice Agents', path: VOICE_BASE }, { name: VOICE_CITY_BY_SLUG.get(voiceSlug).name, path: route.path }]
        : [crumbBase, { name: route.label || route.page, path: route.path }]));
    if (citySlug) nodes.push(cityServiceLd(CITY_BY_SLUG.get(citySlug)));
    if (voiceSlug) nodes.push(voiceCityServiceLd(VOICE_CITY_BY_SLUG.get(voiceSlug)));
  }
  if (page === 'GrowCFL') nodes.push(faqLd(), localBusinessLd());
  return nodes;
}

/** Wrap graph nodes in the @context envelope shared by every page. */
export const ldGraph = (nodes) => ({
  '@context': 'https://schema.org',
  '@graph': [organizationLd(), websiteLd(), ...nodes.filter(Boolean)],
});

// ── Runtime head updates ─────────────────────────────────────────────────────
// The pre-rendered HTML already carries the right tags for a cold load; this
// keeps them correct after a client-side navigation, which is what social
// scrapers and Googlebot's second render pass end up reading.

const HEAD_MARK = 'data-seo-managed';

function setMeta(attr, key, content) {
  if (typeof document === 'undefined') return;
  if (content == null || content === '') {
    document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
    return;
  }
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(HEAD_MARK, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', String(content));
}

export function applyHead(head) {
  if (typeof document === 'undefined' || !head) return;

  document.title = head.title;
  setMeta('name', 'description', head.description);
  setMeta('name', 'robots', head.robots);

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute(HEAD_MARK, '');
    document.head.appendChild(link);
  }
  link.setAttribute('href', head.canonical);

  setMeta('property', 'og:type', head.ogType);
  setMeta('property', 'og:title', head.title);
  setMeta('property', 'og:description', head.description);
  setMeta('property', 'og:url', head.canonical);
  setMeta('property', 'og:image', head.image);
  setMeta('name', 'twitter:title', head.title);
  setMeta('name', 'twitter:description', head.description);
  setMeta('name', 'twitter:image', head.image);

  const a = head.article;
  setMeta('property', 'article:published_time', a?.published);
  setMeta('property', 'article:modified_time', a?.modified);
  setMeta('property', 'article:author', a?.author);
  document.head.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
  (a?.tags || []).forEach((tag) => {
    const el = document.createElement('meta');
    el.setAttribute('property', 'article:tag');
    el.setAttribute('content', tag);
    el.setAttribute(HEAD_MARK, '');
    document.head.appendChild(el);
  });

  const existing = document.getElementById('ld-json');
  const script = existing || document.createElement('script');
  script.id = 'ld-json';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ldGraph(head.jsonLd || []));
  if (!existing) document.head.appendChild(script);
}
