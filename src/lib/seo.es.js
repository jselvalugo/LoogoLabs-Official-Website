// Spanish <title> and meta description for every route's /es twin. Same rules
// as the English table in lib/seo.js: unique per page, written for the search,
// trimmed by fitTitle()/clamp() there. Framework-free so the build can import it.

import { CITIES_ES } from './cfl.es.js';
import { VOICE_CITIES_ES } from './voiceCities.es.js';
import { NICHE_QUIZZES_ES } from './nicheQuizzes.es.js';
import { SERVICE_PACKAGES_ES } from './servicePackages.es.js';
import { CITY_BY_SLUG, citySlugFromPage } from './cfl.js';
import { voiceCitySlugFromPage } from './voiceCities.js';

const BRAND = 'Loogo Labs';
const firstSentence = (s = '') => `${String(s).split('. ')[0].replace(/\.$/, '')}.`;

const STATIC = {
  Home: {
    title: `Agencia de marketing y automatización en Orlando | ${BRAND}`,
    description: 'Una sola plataforma para lanzar, hacer crecer y automatizar tu negocio: CRM, seguimiento automático, reseñas y marketing, configurado y administrado por nosotros.',
  },
  Mission: {
    title: `Nuestra misión: una plataforma, no 15 herramientas | ${BRAND}`,
    description: 'La mayoría de los dueños manejan su negocio con 10 a 15 herramientas desconectadas. Creamos una sola plataforma que las reemplaza, y nos encargamos de la configuración, la capacitación y el soporte.',
  },
  Company: {
    title: `La empresa: conoce al fundador | ${BRAND}`,
    description: `${BRAND} fue fundada por David Selva, profesional de Coamo, Puerto Rico, con experiencia en CLM, contratos gubernamentales, consultoría, gestión de proyectos y marketing, hoy en Celebration, Florida.`,
  },
  LoogoNews: {
    title: `LoogoBlog de la industria: guías de automatización | ${BRAND}`,
    description: 'Guías sobre seguimiento de clientes, mensajes por llamada perdida, reseñas y automatización para dueños de negocios de servicios. Artículos en inglés.',
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
  Packages: {
    title: `Paquetes de crecimiento y arranques rápidos | ${BRAND}`,
    description: 'Paquetes de crecimiento hechos por nosotros (Launch, Growth y Scale) y arranques rápidos a precio fijo para reseñas, Perfil de Empresa en Google, páginas por ciudad y comunicados de prensa.',
  },
  PressRelease: {
    title: `Redacción y distribución de comunicados de prensa | ${BRAND}`,
    description: 'Redacción y distribución de comunicados de prensa en más de 350 sitios de noticias, afiliadas de televisión y Google News. Precios fijos desde $149.',
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

  const quiz = NICHE_QUIZZES_ES[page];
  if (quiz) return { title: `${quiz.label}: evaluación gratis de 60 segundos | ${BRAND}`, description: quiz.description };

  const pkg = SERVICE_PACKAGES_ES[page];
  if (pkg) return { title: `${pkg.cardTitle} | ${BRAND}`, description: `${pkg.summary}`.trim() };

  return null;
}
