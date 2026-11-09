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
export const CUSTOMERS = [
  {
    name: 'Engentfy',
    kind: 'AI assistants and plugins',
    kindEs: 'Asistentes y plugins de IA',
    accent: '#2563EB',
    logo: '/partners/engentfy/horizontal-blue.svg', w: 5913, h: 1456, tint: false,
    url: 'https://www.engentfy.com',
    blurb: "Loogo Labs LLC is Engentfy's marketing consultant. We shape how Engentfy speaks to the people its AI assistants and plugins are built for, then plan and produce the content that reaches them: UGC videos, social posts and launch campaigns.",
    blurbEs: "Loogo Labs LLC es el consultor de marketing de Engentfy. Definimos cómo Engentfy le habla a las personas para quienes construye sus asistentes y plugins de IA, y luego planeamos y producimos el contenido que las alcanza: videos UGC, publicaciones en redes y campañas de lanzamiento.",
  },
  {
    name: 'Lugo’s Craft Distillery',
    kind: 'Craft distillery',
    kindEs: 'Destilería artesanal',
    accent: '#C79A2E',
    logo: '/clients/ticker/lugos-craft.png', w: 392, h: 160, tint: true,
    url: 'https://www.lugoscraftdistillery.com',
    blurb: "We led the promotion for Lugo's Cards and Cocktails event from start to finish: the campaign plan, the content and the social media push behind it.",
    blurbEs: "Dirigimos la promoción del evento Cards and Cocktails de Lugo's de principio a fin: el plan de campaña, el contenido y el impulso en redes sociales.",
  },
  {
    name: 'Feche Consulting',
    kind: 'Consulting',
    kindEs: 'Consultoría',
    accent: '#4A6396',
    logo: '/clients/ticker/feche-consulting.png', w: 600, h: 160, tint: true,
    url: null,
    blurb: "We served as business automation consultant on several Feche Consulting engagements in the healthcare industry, mapping manual workflows and designing the automations that take repetitive work off their teams.",
    blurbEs: "Fuimos consultores de automatización de negocios en varios proyectos de Feche Consulting en la industria de la salud, mapeando procesos manuales y diseñando las automatizaciones que le quitan el trabajo repetitivo a sus equipos.",
  },
  {
    name: 'Reef Ntwrks',
    kind: 'IT and networks',
    kindEs: 'TI y redes',
    accent: '#1B17FB',
    logo: '/clients/ticker/reef-consulting.png', w: 230, h: 104, tint: true,
    url: null,
    blurb: "We provided business process automation consulting for Reef Ntwrks, finding the repetitive steps in their operations and designing the workflows to automate them.",
    blurbEs: "Brindamos consultoría en automatización de procesos de negocio a Reef Ntwrks, identificando los pasos repetitivos de su operación y diseñando los flujos para automatizarlos.",
  },
  {
    name: 'Riel Compliance Suite',
    kind: 'Compliance software',
    kindEs: 'Software de cumplimiento',
    accent: '#0F1E35',
    logo: '/clients/ticker/riel-compliance-suite.png', w: 372, h: 131, tint: true,
    url: 'https://rielhealthcaresolutions.com/',
    blurb: "We consulted with Riel Compliance Suite on its go-to-market strategy and collaborated on RFP opportunities, from positioning the product to shaping the response.",
    blurbEs: "Asesoramos a Riel Compliance Suite en su estrategia de entrada al mercado y colaboramos en oportunidades de RFP, desde el posicionamiento del producto hasta la propuesta.",
  },
  {
    name: 'Pronomy.io',
    kind: 'SaaS',
    kindEs: 'SaaS',
    accent: '#5F7458',
    logo: '/clients/ticker/pronomy.png', w: 156, h: 160, tint: true,
    url: 'https://pronomy.io',
    blurb: "A partnership to take Pronomy.io to market and lay its foundation in the customer service space, from positioning to the go-to-market plan.",
    blurbEs: "Una alianza para llevar Pronomy.io al mercado y sentar sus bases en el espacio de servicio al cliente, desde el posicionamiento hasta el plan de lanzamiento.",
  },
  {
    name: 'Geros Studio',
    kind: 'Creative studio',
    kindEs: 'Estudio creativo',
    accent: '#A53617',
    logo: '/clients/ticker/geros-studio.png', w: 447, h: 59, tint: true,
    url: null,
    blurb: "Six years of partnership. Together with Geros Studio we build brands from the ground up: design, branding, entity creation and the social media presence that carries it all.",
    blurbEs: "Seis años de alianza. Junto a Geros Studio construimos marcas desde cero: diseño, branding, creación de entidades y la presencia en redes sociales que lo sostiene todo.",
  },
  {
    name: 'Dalitzandra Padial',
    kind: 'Women’s empowerment',
    kindEs: 'Empoderamiento de la mujer',
    accent: '#8A6A3F',
    logo: null,
    wordmark: 'Dalitzandra Padial',
    url: null,
    blurb: "Dalitzandra is a creator and mentor in women's empowerment. We automated the back-end infrastructure of her business and set up the foundations of her creator workflow, so more of her time goes to her community.",
    blurbEs: "Dalitzandra es creadora y mentora en el empoderamiento de la mujer. Automatizamos la infraestructura interna de su negocio y establecimos las bases de su proceso como creadora, para que más de su tiempo vaya a su comunidad.",
  },
];
