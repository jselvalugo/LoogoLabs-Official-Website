// Customers shown on the Who We Serve page (/company), one thin branded band each.
//
// Each band takes the customer's own colours so it reads as *their* brand:
//   accent   — the rail on the left edge and the link colour
//   chipBg   — the background behind the logo
//   logo     — image in /public (null = show `wordmark` as script text instead)
//   fit      — 'contain' pads the logo inside the chip; 'cover' lets an image
//              that carries its own background fill the chip edge to edge
//   blurb    — the short paragraph (2–3 sentences). blurbEs is the Spanish copy;
//              when it is empty the English copy is shown on /es.
//   url      — optional; adds a "Visit site" link
//
// TODO(david): replace every `blurb` below with the paragraph for that customer.
export const CUSTOMERS = [
  {
    name: 'Engentfy',
    kind: 'AI assistants and plugins',
    kindEs: 'Asistentes y plugins de IA',
    accent: '#2563EB',
    chipBg: '#2563EB',
    logo: '/partners/engentfy/horizontal-white.svg',
    fit: 'contain',
    url: 'https://www.engentfy.com',
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Lugo’s Craft Distillery',
    kind: 'Craft distillery',
    kindEs: 'Destilería artesanal',
    accent: '#C79A2E',
    chipBg: '#1B1A17',
    logo: '/blog/lugos-craft-logo-on-dark.png',
    fit: 'contain',
    url: 'https://www.lugoscraftdistillery.com',
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Feche Consulting',
    kind: 'Consulting',
    kindEs: 'Consultoría',
    accent: '#4A6396',
    chipBg: '#FFFFFF',
    logo: '/clients/feche-consulting.jpg',
    fit: 'contain',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Reef Ntwrks',
    kind: 'IT and networks',
    kindEs: 'TI y redes',
    accent: '#1B17FB',
    chipBg: '#FFFFFF',
    logo: '/clients/reef-consulting.png',
    fit: 'contain',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Riel Compliance Suite',
    kind: 'Compliance software',
    kindEs: 'Software de cumplimiento',
    accent: '#0F1E35',
    chipBg: '#0F1E35',
    logo: '/clients/riel-compliance-suite.jpg',
    fit: 'contain',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Pronomy.io',
    kind: 'SaaS',
    kindEs: 'SaaS',
    accent: '#5F7458',
    chipBg: '#050706',
    logo: '/clients/pronomy.jpg',
    fit: 'contain',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Geros Studio',
    kind: 'Creative studio',
    kindEs: 'Estudio creativo',
    accent: '#A53617',
    chipBg: '#A53617',
    logo: '/clients/geros-studio.jpg',
    fit: 'cover',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Dalitzandra Padial',
    kind: 'Women mentorship',
    kindEs: 'Mentoría para mujeres',
    accent: '#8A6A3F',
    chipBg: '#1B2A12',
    logo: null,
    wordmark: 'Dalitzandra Padial',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
];
