// Spanish <title> and meta description for every route's /es twin. Same rules
// as the English table in lib/seo.js: unique per page, written for the search,
// trimmed by fitTitle()/clamp() there. Framework-free so the build can import it.

import { CITIES_ES } from './cfl.es.js';
import { VOICE_CITIES_ES } from './voiceCities.es.js';
import { NICHE_QUIZZES_ES } from './nicheQuizzes.es.js';
import { SERVICE_PACKAGES_ES } from './servicePackages.es.js';
import { CITY_BY_SLUG, citySlugFromPage } from './cfl.js';
import { voiceCitySlugFromPage } from './voiceCities.js';
import { TOOL_BY_PAGE } from './tools.js';
import { BLOG_CATEGORY_BY_SLUG, categorySlugFromPage } from './blogCategories.js';

const BRAND = 'Loogo Labs';
const firstSentence = (s = '') => `${String(s).split('. ')[0].replace(/\.$/, '')}.`;

const STATIC = {
  Home: {
    title: `${BRAND} | Consultores de marketing`,
    description: 'Un socio de marketing para marcas SaaS y creadores. Un mismo equipo escribe la estrategia, corre los anuncios y el email, y construye el seguimiento, las automatizaciones y la IA que lo hacen funcionar.',
  },
  Mission: {
    title: `Nuestra misión: la mayoría de los planes de marketing nunca se construyen | ${BRAND}`,
    description: 'Una agencia escribe la estrategia, un desarrollador espera las especificaciones y los meses pasan. Loogo Labs es un solo equipo que planea tu marketing y luego construye y opera el sistema que lo hace funcionar.',
  },
  Company: {
    title: `A quién servimos: nuestros clientes | ${BRAND}`,
    description: `Las marcas SaaS, creadores y negocios locales para los que ${BRAND} planea y construye marketing, entre ellos Engentfy y Lugo’s Craft Distillery.`,
  },
  About: {
    title: `Nosotros: conoce al fundador | ${BRAND}`,
    description: `${BRAND} fue fundada por David Selva, profesional de Coamo, Puerto Rico, con experiencia en CLM, contratos gubernamentales, consultoría, gestión de proyectos y marketing, hoy en Celebration, Florida.`,
  },
  LoogoNews: {
    title: `LoogoBlog de la industria: guías de IA y marketing | ${BRAND}`,
    description: 'Guías prácticas para usar la IA en tu marketing: contenido, anuncios, búsqueda con IA, seguimiento y medición, para pequeños negocios. Artículos en inglés.',
  },
  GrowCFL: {
    title: `SEO local y automatización de marketing en la Florida Central | ${BRAND}`,
    description: 'SEO local, seguimiento automático de clientes y generación de reseñas para negocios en Orlando, Kissimmee, Celebration y toda la Florida Central.',
  },
  AIVoice: {
    title: `Agentes de voz con IA para negocios de servicios | ${BRAND}`,
    description: 'Un agente de voz con IA que contesta cada llamada, agenda el trabajo y nunca deja a un cliente en espera, configurado y administrado para negocios locales.',
  },
  AIReceptionist: {
    title: `Recepcionista con IA para negocios de servicios | ${BRAND}`,
    description: 'Una recepcionista con IA de tiempo completo que contesta cada llamada y agenda la cita, por una fracción del costo de un empleado. Haz la evaluación gratis de 60 segundos.',
  },
  ReputationAutopilot: {
    title: `Gestión automática de reseñas y reputación | ${BRAND}`,
    description: 'Cada trabajo terminado se convierte automáticamente en una solicitud de reseña: sin hojas de cálculo ni olvidos. Haz la evaluación gratis de 60 segundos.',
  },
  Quizzes: {
    title: `Evaluaciones gratis para tu negocio | ${BRAND}`,
    description: `Evaluaciones rápidas y gratuitas que te dicen si un sistema de ${BRAND} es adecuado para tu negocio, sin necesidad de una llamada.`,
  },
  Tools: {
    title: `Herramientas de marketing gratis para negocios locales | ${BRAND}`,
    description: 'Herramientas gratis para dueños de negocio: generador de enlace y QR para reseñas de Google, calculadora de llamadas perdidas y generador de enlaces UTM. Sin registro.',
  },
  Packages: {
    title: `Planes de software de marketing y servicios | ${BRAND}`,
    description: 'Planes de software (SaaS) Launch, Growth y Scale para automatizar tu marketing, más servicios hechos por nuestro equipo: contenido y redes, anuncios, SEO local, sitios web, reseñas y comunicados de prensa.',
  },
  PressRelease: {
    title: `Redacción y distribución de comunicados de prensa | ${BRAND}`,
    description: 'Redacción y distribución de comunicados de prensa en más de 350 sitios de noticias, afiliadas de televisión y Google News. Precios fijos desde $149.',
  },
  BrandPartners: {
    title: `Alianzas con marcas: estrategia de marketing y consultoría de IA | ${BRAND}`,
    description: `Asóciate con ${BRAND} en estrategia de marketing y consultoría de IA. Proyectos a la medida de tu marca: postúlate en un minuto.`,
  },
  Newsletter: {
    title: `La carta de Loogo Labs: newsletter mensual de marketing | ${BRAND}`,
    description: 'Un email al mes para dueños de negocio: lo que funciona en marketing, una herramienta de IA que ahorra horas y una cosa para mejorar esta semana. Gratis.',
  },
  Privacy: {
    title: `Política de privacidad | ${BRAND}`,
    description: `Cómo ${BRAND} recopila, usa y protege la información que compartes con nosotros.`,
  },
  Terms: {
    title: `Términos de servicio | ${BRAND}`,
    description: `Los términos que rigen el uso de los servicios de ${BRAND} y de este sitio web.`,
  },
};

/** Spanish { title, description } for a route's page key, or null if none. */
export function metaEs(page) {
  if (STATIC[page]) return STATIC[page];

  const citySlug = citySlugFromPage(page);
  if (citySlug && CITIES_ES[citySlug]) {
    const name = CITY_BY_SLUG.get(citySlug).name;
    return {
      title: `SEO local y automatización de marketing en ${name}, FL | ${BRAND}`,
      description: `SEO local, Perfil de Empresa en Google, reseñas automáticas y seguimiento instantáneo para negocios de ${name}. ${firstSentence(CITIES_ES[citySlug].intro)}`,
    };
  }

  const voiceSlug = voiceCitySlugFromPage(page);
  if (voiceSlug) {
    const name = CITY_BY_SLUG.get(voiceSlug)?.name ?? voiceSlug;
    const intro = VOICE_CITIES_ES[voiceSlug]?.intro;
    return {
      title: `Agente de voz con IA para negocios en ${name}, FL | ${BRAND}`,
      description: `Un agente de voz con IA 24/7 que contesta, califica y agenda llamadas para negocios de ${name}, en inglés y español.${intro ? ` ${firstSentence(intro)}` : ''}`,
    };
  }

  const cat = BLOG_CATEGORY_BY_SLUG.get(categorySlugFromPage(page));
  if (cat) return { title: `${cat.nameEs}: guías para pequeños negocios | ${BRAND}`, description: `${cat.blurbEs} Guías prácticas de LoogoBlog de la industria. Artículos en inglés.` };

  const tool = TOOL_BY_PAGE.get(page);
  if (tool) return { title: `${tool.es.title}: gratis, sin registro | ${BRAND}`, description: tool.es.description };

  const quiz = NICHE_QUIZZES_ES[page];
  if (quiz) return { title: `${quiz.label}: evaluación gratis de 60 segundos | ${BRAND}`, description: quiz.description };

  const pkg = SERVICE_PACKAGES_ES[page];
  if (pkg) return { title: `${pkg.cardTitle} | ${BRAND}`, description: `${pkg.summary}`.trim() };

  return null;
}
