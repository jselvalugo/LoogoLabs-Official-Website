// Customers shown on the Who We Serve page (/company), one thin branded band each.
//
// Each band takes the customer's own colours so it reads as *their* brand:
//   accent   — brand colour: the glow behind the glass tile, the logo tint and the link
//   logo     — transparent image in /public, w/h its pixel size (null = show
//              `wordmark` as script text instead)
//   tint     — true paints a one-colour logo in `accent`; false keeps its own colours
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
    logo: '/partners/engentfy/horizontal-blue.svg', w: 5913, h: 1456, tint: false,
    url: 'https://www.engentfy.com',
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Lugo’s Craft Distillery',
    kind: 'Craft distillery',
    kindEs: 'Destilería artesanal',
    accent: '#C79A2E',
    logo: '/clients/ticker/lugos-craft.png', w: 392, h: 160, tint: true,
    url: 'https://www.lugoscraftdistillery.com',
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Feche Consulting',
    kind: 'Consulting',
    kindEs: 'Consultoría',
    accent: '#4A6396',
    logo: '/clients/ticker/feche-consulting.png', w: 600, h: 160, tint: true,
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Reef Ntwrks',
    kind: 'IT and networks',
    kindEs: 'TI y redes',
    accent: '#1B17FB',
    logo: '/clients/ticker/reef-consulting.png', w: 230, h: 104, tint: true,
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Riel Compliance Suite',
    kind: 'Compliance software',
    kindEs: 'Software de cumplimiento',
    accent: '#0F1E35',
    logo: '/clients/ticker/riel-compliance-suite.png', w: 372, h: 131, tint: true,
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Pronomy.io',
    kind: 'SaaS',
    kindEs: 'SaaS',
    accent: '#5F7458',
    logo: '/clients/ticker/pronomy.png', w: 156, h: 160, tint: true,
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Geros Studio',
    kind: 'Creative studio',
    kindEs: 'Estudio creativo',
    accent: '#A53617',
    logo: '/clients/ticker/geros-studio.png', w: 447, h: 59, tint: true,
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
  {
    name: 'Dalitzandra Padial',
    kind: 'Women mentorship',
    kindEs: 'Mentoría para mujeres',
    accent: '#8A6A3F',
    logo: null,
    wordmark: 'Dalitzandra Padial',
    url: null,
    blurb: 'Paragraph coming from David.',
    blurbEs: '',
  },
];
