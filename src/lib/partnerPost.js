// Partner posts: announcements of a service Loogo Labs resells, rendered in the
// partner's own branding (see .lb-page--<key> in src/styles/pages/blog.css)
// with the Loogo Labs logo kept in a co-brand lockup at the top.

export const PARTNER_POSTS = {
  'loogo-labs-partners-with-pronomy-ai-support-agent': {
    key: 'pronomy',
    name: 'Pronomy',
    logo: '/blog/pronomy-mark.png',
    kicker: 'Partnership · AI support agent',
    ctaTitle: { en: 'See which of your tickets Pronomy can take.', es: 'Descubre qué tickets puede resolver Pronomy.' },
    ctaShort: { en: 'Loogo Labs × Pronomy', es: 'Loogo Labs × Pronomy' },
    ctaText: {
      en: 'Bring 20–50 recent tickets to a call with Loogo Labs. You leave with a launch plan and a per-ticket pricing estimate.',
      es: 'Trae de 20 a 50 tickets recientes a una llamada con Loogo Labs. Sales con un plan de lanzamiento y un estimado de precio por ticket.',
    },
    ctaButton: { en: 'Book a ticket review', es: 'Agenda una revisión de tickets' },
    ctaButtonShort: { en: 'Book a call', es: 'Agendar' },
  },
};

export const partnerFor = (post) => (post && PARTNER_POSTS[post.slug]) || null;
