// Blog categories. Every post belongs to exactly one, which drives the category
// bar on /news, the /news/category/<slug> pages (route table, sitemap, pre-render),
// the category chip and "Keep reading" on each post, and which free tool a post
// points to. Framework-free so the build can import it.
//
// Posts are assigned by slug below. A post that isn't listed (for example one the
// daily blog task just published) is placed by keywords in its tags and title, so
// it never lands without a category. Add new slugs here when you want to pin one.

export const BLOG_CATEGORY_BASE = '/news/category';

export const BLOG_CATEGORIES = [
  {
    slug: 'lead-follow-up',
    name: 'Lead Follow-Up & CRM',
    nameEs: 'Seguimiento y CRM',
    blurb: 'Answer every lead fast, follow up until they book, and keep a CRM your team actually uses.',
    blurbEs: 'Responde rápido a cada prospecto, da seguimiento hasta que agende y mantén un CRM que tu equipo sí use.',
    tool: 'ToolMissedCall',
  },
  {
    slug: 'ai-assistants',
    name: 'AI Assistants & Voice',
    nameEs: 'Asistentes de IA y voz',
    blurb: 'Where AI receptionists, voice agents and booking assistants help, and where a person should take over.',
    blurbEs: 'Dónde ayudan las recepcionistas con IA, los agentes de voz y los asistentes de citas, y dónde debe entrar una persona.',
    tool: 'ToolMissedCall',
  },
  {
    slug: 'reviews',
    name: 'Reviews & Reputation',
    nameEs: 'Reseñas y reputación',
    blurb: 'Get more Google reviews the right way, answer them well, and stay on the right side of the FTC.',
    blurbEs: 'Consigue más reseñas de Google de la forma correcta, contéstalas bien y cumple con la FTC.',
    tool: 'ToolReviewLink',
  },
  {
    slug: 'email-sms',
    name: 'Email & SMS',
    nameEs: 'Email y SMS',
    blurb: 'Messages people read: segmentation, timing, seasonal campaigns and texting rules you can’t ignore.',
    blurbEs: 'Mensajes que la gente lee: segmentación, horarios, campañas de temporada y las reglas de texto que no puedes ignorar.',
    tool: 'ToolUtm',
  },
  {
    slug: 'ads-tracking',
    name: 'Ads, Social & Tracking',
    nameEs: 'Anuncios, redes y medición',
    blurb: 'Paid ads, social content, websites that convert, and knowing which marketing actually brings customers.',
    blurbEs: 'Anuncios pagados, contenido para redes, sitios que convierten y saber qué marketing de verdad trae clientes.',
    tool: 'ToolUtm',
  },
  {
    slug: 'marketing-myths',
    name: 'Marketing Myths & Red Flags',
    nameEs: 'Mitos y señales de alerta',
    blurb: 'Guaranteed leads, long contracts and other promises to question before you hire anyone.',
    blurbEs: 'Prospectos garantizados, contratos largos y otras promesas que debes cuestionar antes de contratar a alguien.',
    tool: null,
  },
  {
    slug: 'news',
    name: 'News & Events',
    nameEs: 'Noticias y eventos',
    blurb: 'Announcements, launches and events from Loogo Labs LLC and the businesses we work with.',
    blurbEs: 'Anuncios, lanzamientos y eventos de Loogo Labs LLC y de los negocios con los que trabajamos.',
    tool: null,
  },
];

export const BLOG_CATEGORY_BY_SLUG = new Map(BLOG_CATEGORIES.map((c) => [c.slug, c]));

const BY_POST = {
  '5-minute-rule-local-service-business-leads': 'lead-follow-up',
  'painting-contractor-estimate-follow-up': 'lead-follow-up',
  'moving-company-referral-partners': 'lead-follow-up',
  'insurance-agency-contact-data-hygiene': 'lead-follow-up',
  'gym-membership-retention-management': 'lead-follow-up',
  'gohighlevel-workflows-that-dont-break': 'lead-follow-up',
  'pressure-washing-photo-quote-before-site-visit': 'lead-follow-up',
  'ai-voice-after-hours-plumbing': 'ai-assistants',
  'reduce-no-shows-appointment-reminders': 'ai-assistants',
  'ai-powered-marketing-is-mostly-marketing': 'ai-assistants',
  'pressure-washing-review-request-automation': 'reviews',
  'review-gating-illegal-ftc-rule': 'reviews',
  'pest-control-list-segmentation': 'email-sms',
  'unsolicited-text-marketing-tcpa-risk': 'email-sms',
  'salon-december-chair-hours-regulars-first': 'email-sms',
  'lawn-care-fall-transition-after-last-mow': 'email-sms',
  'cleaning-company-multi-location-reporting': 'ads-tracking',
  'boosting-facebook-posts-charity-for-meta': 'ads-tracking',
  'garage-door-website-conversion': 'ads-tracking',
  'pool-service-seasonal-content-calendar': 'ads-tracking',
  'lead-guarantee-lie-local-marketing': 'marketing-myths',
  'twelve-month-contract-red-flag': 'marketing-myths',
  'engentfy-new-release-ai-for-real-estate': 'news',
  'cards-and-cocktails-pokemon-event-lakeland': 'news',
};

// Checked in order; the first match wins. Lead follow-up is the fallback.
const RULES = [
  ['news', /announcement|new release|launch|\bevents?\b/i],
  ['reviews', /review|reputation/i],
  ['ai-assistants', /ai assistant|voice|receptionist|chatbot|ai in marketing|ai tools/i],
  ['marketing-myths', /myth|red flag|contract|guarantee|marketing claims/i],
  ['email-sms', /email|sms|text message|newsletter|tcpa/i],
  ['ads-tracking', /\bads?\b|ad spend|paid social|facebook|google ads|tracking|analytics|\bseo\b|social media|website|conversion/i],
];

/** The category slug for a post ({ slug, tags, title }). */
export function categoryOf(post) {
  if (!post) return 'lead-follow-up';
  if (BY_POST[post.slug]) return BY_POST[post.slug];
  const text = `${post.tags || ''} ${post.title || ''}`;
  const hit = RULES.find(([, re]) => re.test(text));
  return hit ? hit[0] : 'lead-follow-up';
}

export const categoryPath = (slug) => `${BLOG_CATEGORY_BASE}/${slug}`;

// Route-table page keys, like City:<slug> for the city pages.
export const categoryPageKey = (slug) => `BlogCategory:${slug}`;
export const categorySlugFromPage = (page) =>
  typeof page === 'string' && page.startsWith('BlogCategory:') ? page.slice(13) : null;

/** Category slug from a URL path (/news/category/x or /es/news/category/x), or null. */
export function categorySlugFromPath(pathname = '') {
  const m = pathname.replace(/\/+$/, '').match(/\/news\/category\/([a-z0-9-]+)$/);
  return m && BLOG_CATEGORY_BY_SLUG.has(m[1]) ? m[1] : null;
}

/**
 * Up to n posts to read next: same category first (newest first), then posts
 * that share a tag, then the newest of the rest. Never the post itself.
 */
export function relatedPosts(post, posts, n = 3) {
  if (!post) return [];
  const cat = categoryOf(post);
  const tags = new Set(String(post.tags || '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean));
  const others = posts.filter((p) => p.slug !== post.slug);
  const score = (p) => (categoryOf(p) === cat ? 10 : 0)
    + String(p.tags || '').split(',').filter((t) => tags.has(t.trim().toLowerCase())).length;
  return others
    .map((p, i) => ({ p, s: score(p), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map((x) => x.p);
}

// Hand-picked "Start here" guides on /news: the strongest hub per big topic.
// Missing slugs are skipped, so a later rename never breaks the row.
export const START_HERE = [
  '5-minute-rule-local-service-business-leads',
  'ai-voice-after-hours-plumbing',
  'pressure-washing-review-request-automation',
];
