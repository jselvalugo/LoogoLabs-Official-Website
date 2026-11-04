// Partner brands featured in Industry LoogoBlog posts. A post about a partner
// gets the partner's logo in its header and on its blog card, and a floating
// rail with every one of the partner's links. Add a partner here and any post
// that matches it picks up the treatment automatically.

export const PARTNERS = {
  engentfy: {
    key: 'engentfy',
    name: 'Engentfy',
    url: 'https://engentfy.com',
    logo: '/partners/engentfy/horizontal-blue.svg',
    logoOnDark: '/partners/engentfy/horizontal-white.svg',
    mark: '/partners/engentfy/mark-two-tone.svg',
    tagline: 'AI for real estate, built in Florida. Every answer comes from a record.',
    taglineEs: 'IA para bienes raíces, hecha en Florida. Cada respuesta viene de un registro.',
    colors: { primary: '#2563EB', secondary: '#7C3AED', ink: '#16171B', assistant: '#25D366' },
    // Primary call to action at the top of the rail.
    cta: { label: 'Visit engentfy.com', labelEs: 'Visita engentfy.com', href: 'https://engentfy.com' },
    groups: [
      {
        title: 'Products', titleEs: 'Productos',
        links: [
          { label: 'Engentfy Assistant', note: 'WhatsApp back office · from $19.99/mo', noteEs: 'Back office en WhatsApp · desde $19.99/mes', href: 'https://engentfy.com/assistant' },
          { label: 'Plugins for ChatGPT & Claude', note: 'Free to install · from $4.99/mo', noteEs: 'Gratis para instalar · desde $4.99/mes', href: 'https://engentfy.com/plugins' },
          { label: 'Parcels', note: '10.8M Florida parcels in your assistant', noteEs: '10.8M de parcelas de Florida en tu asistente', href: 'https://engentfy.com/plugins/parcels' },
          { label: 'Lofty', note: 'Your Lofty CRM, worked from chat', noteEs: 'Tu CRM de Lofty, desde el chat', href: 'https://engentfy.com/plugins/lofty' },
          { label: 'Cadence', note: 'Leads, listings and contracts', noteEs: 'Prospectos, listados y contratos', href: 'https://engentfy.com/plugins/cadence' },
          { label: 'Aperture', note: 'Federal contracts and grants', noteEs: 'Contratos y subvenciones federales', href: 'https://engentfy.com/plugins/aperture' },
          { label: 'Solutions', note: 'Custom AI systems you own', noteEs: 'Sistemas de IA a la medida, tuyos', href: 'https://engentfy.com/solutions' },
          { label: 'Concierge', href: 'https://engentfy.com/concierge' },
        ],
      },
      {
        title: 'Free resources', titleEs: 'Recursos gratis',
        links: [
          { label: 'AI tools directory', href: 'https://engentfy.com/resources/ai-tools' },
          { label: 'AI prompt library', href: 'https://engentfy.com/resources/ai-prompts' },
          { label: 'Supplier directory', href: 'https://engentfy.com/suppliers' },
        ],
      },
      {
        title: 'Company', titleEs: 'Empresa',
        links: [
          { label: 'About Engentfy', href: 'https://engentfy.com/about' },
          { label: 'Talk to the team', href: 'https://engentfy.com/contact' },
          { label: 'Sign in', href: 'https://engentfy.com/account/login' },
        ],
      },
    ],
    newsletter: {
      title: 'The Engentfy newsletter', titleEs: 'El newsletter de Engentfy',
      text: 'AI for real estate, one practical note a week.', textEs: 'IA para bienes raíces, una nota práctica por semana.',
      label: 'Subscribe', labelEs: 'Suscríbete',
      href: 'https://engentfy.com/newsletter',
    },
  },
};

// A post belongs to a partner when its slug, title or tags name the partner,
// or its body links to the partner's site.
export function partnerForPost(post) {
  if (!post) return null;
  const hay = [post.slug, post.title, post.tags, post.content].filter(Boolean).join(' ').toLowerCase();
  return Object.values(PARTNERS).find(p => hay.includes(p.key) || hay.includes(p.url.replace('https://', ''))) || null;
}

// Outbound partner links carry a referral tag so the partner can see the traffic.
export function partnerHref(href, slug) {
  try {
    const u = new URL(href);
    u.searchParams.set('utm_source', 'loogolabs');
    u.searchParams.set('utm_medium', 'blog');
    if (slug) u.searchParams.set('utm_campaign', slug);
    return u.toString();
  } catch { return href; }
}
