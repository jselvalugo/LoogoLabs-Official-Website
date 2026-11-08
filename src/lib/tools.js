// Free tools (/tools and /tools/<slug>). One entry per tool drives the hub card,
// the route table and sitemap in lib/seo.js, the WebApplication + FAQPage schema,
// and the Spanish meta in lib/seo.es.js. Framework-free so the build can import it.
//
// Every tool runs entirely in the visitor's browser: no API keys, no third-party
// services, nothing stored on our side. Keep it that way so the tools never need
// maintenance. The only network call is the optional monthly-tips sign-up, which
// goes to the existing email-subscribe function tagged tool-<slug>.

export const TOOLS_BASE = '/tools';

export const TOOLS = [
  {
    page: 'ToolReviewLink',
    slug: 'google-review-link-generator',
    tag: 'tool-review-link',
    service: 'ReputationAutopilot',
    title: 'Google Review Link & QR Code Generator',
    short: 'Google review link + QR code',
    description:
      'Turn your Google Business Profile into a one-tap review link, a QR code and a printable counter card. Free, no sign-up, works in your browser.',
    blurb: 'A one-tap review link, a QR code and a printable card, plus ready-to-send text and email messages.',
    es: {
      title: 'Generador de enlace y código QR para reseñas de Google',
      short: 'Enlace de reseñas de Google + QR',
      description:
        'Convierte tu Perfil de Empresa en Google en un enlace directo para reseñas, un código QR y una tarjeta para imprimir. Gratis, sin registro, en tu navegador.',
      blurb: 'Un enlace directo para reseñas, un código QR y una tarjeta para imprimir, más mensajes listos para enviar.',
    },
    faq: [
      ['Is this review link the same one Google gives me?', 'Yes. If you paste the "Ask for reviews" link from your Business Profile, we keep it as it is. If you paste a Place ID, we build Google\'s standard write-a-review link from it. Either way the link opens Google\'s own review form for your business.'],
      ['Where do I find my Place ID?', 'Use Google\'s free Place ID Finder: search your business name and copy the ID that starts with "ChIJ". Or skip it and paste the "Ask for reviews" link from your Business Profile instead.'],
      ['Can I offer a discount for a review?', 'No. Google\'s policies don\'t allow paying for or rewarding reviews, and the FTC treats it as deceptive. Ask every customer the same way and never filter who gets asked.'],
      ['Does the QR code expire?', 'No. The QR code holds your review link directly, with no redirect service in between, so it keeps working as long as your Google listing does.'],
    ],
    faqEs: [
      ['¿Este enlace es el mismo que me da Google?', 'Sí. Si pegas el enlace "Pedir reseñas" de tu Perfil de Empresa, lo dejamos tal cual. Si pegas un Place ID, armamos con él el enlace estándar de Google para escribir una reseña. En ambos casos se abre el formulario de reseñas de Google para tu negocio.'],
      ['¿Dónde encuentro mi Place ID?', 'Usa el buscador gratuito de Place ID de Google: busca el nombre de tu negocio y copia el ID que empieza con "ChIJ". O sáltate ese paso y pega el enlace "Pedir reseñas" de tu Perfil de Empresa.'],
      ['¿Puedo dar un descuento a cambio de una reseña?', 'No. Las políticas de Google no permiten pagar ni premiar reseñas, y la FTC lo considera engañoso. Pide la reseña a todos tus clientes de la misma forma y nunca filtres a quién se la pides.'],
      ['¿El código QR caduca?', 'No. El código QR contiene tu enlace de reseñas directamente, sin un servicio de redirección de por medio, así que funciona mientras exista tu perfil de Google.'],
    ],
  },
  {
    page: 'ToolMissedCall',
    slug: 'missed-call-cost-calculator',
    tag: 'tool-missed-call',
    service: 'AIVoice',
    title: 'Missed Call Cost Calculator',
    short: 'Missed call cost calculator',
    description:
      'See how much revenue unanswered calls cost your business each month and year. Enter your missed calls, close rate and job value. Free, no sign-up.',
    blurb: 'Your missed calls, close rate and job value in, the monthly and yearly revenue they cost you out.',
    es: {
      title: 'Calculadora del costo de las llamadas perdidas',
      short: 'Calculadora de llamadas perdidas',
      description:
        'Descubre cuánto dinero te cuestan cada mes y cada año las llamadas que no contestas. Ingresa tus llamadas perdidas, tasa de cierre y valor por trabajo. Gratis.',
      blurb: 'Ingresa tus llamadas perdidas, tasa de cierre y valor por trabajo, y mira cuánto te cuestan al mes y al año.',
    },
    faq: [
      ['How do I find out how many calls I miss?', 'Check your phone carrier\'s call log or your business phone app for a normal week and count the calls that went unanswered or to voicemail. Most owners guess low, so count before you trust the number.'],
      ['Why only count new customers?', 'Existing customers usually call back. New callers are comparing businesses, and many of them try the next number instead of leaving a voicemail. That is the revenue this calculator estimates.'],
      ['What close rate should I use?', 'Use the share of new callers who book when you do answer. If you don\'t track it, start with a conservative number, like 30 percent, and adjust once you have a month of data.'],
      ['How can I stop missing calls?', 'Common fixes are a missed-call text-back that replies within seconds, a shared answering schedule, or an AI voice agent that answers every call, books the job and hands urgent ones to your team.'],
    ],
    faqEs: [
      ['¿Cómo sé cuántas llamadas pierdo?', 'Revisa el registro de llamadas de tu compañía telefónica o de la app de tu teléfono de negocio durante una semana normal y cuenta las llamadas sin contestar o que fueron al buzón. La mayoría de los dueños se quedan cortos, así que cuenta antes de confiar en el número.'],
      ['¿Por qué contar solo clientes nuevos?', 'Los clientes actuales suelen volver a llamar. Quienes llaman por primera vez están comparando negocios y muchos prueban el siguiente número en vez de dejar un mensaje. Ese es el dinero que estima esta calculadora.'],
      ['¿Qué tasa de cierre debo usar?', 'Usa la parte de los clientes nuevos que agenda cuando sí contestas. Si no la mides, empieza con un número conservador, como 30 por ciento, y ajústalo cuando tengas un mes de datos.'],
      ['¿Cómo dejo de perder llamadas?', 'Las soluciones comunes son un mensaje de texto automático que responde en segundos a cada llamada perdida, un horario compartido para contestar, o un agente de voz con IA que contesta cada llamada, agenda el trabajo y pasa las urgentes a tu equipo.'],
    ],
  },
  {
    page: 'ToolUtm',
    slug: 'utm-builder',
    tag: 'tool-utm-builder',
    service: 'Marketplace',
    title: 'UTM Link Builder',
    short: 'UTM link builder',
    description:
      'Build clean UTM tracking links for Google Business Profile, Meta and Google Ads, email and QR codes, so Google Analytics shows which marketing brings customers. Free.',
    blurb: 'Clean tracking links with presets for Google Business Profile, Meta, Google Ads, email and print QR codes.',
    es: {
      title: 'Generador de enlaces UTM',
      short: 'Generador de enlaces UTM',
      description:
        'Crea enlaces UTM limpios para tu Perfil de Empresa en Google, Meta, Google Ads, email y códigos QR, para que Google Analytics muestre qué marketing trae clientes.',
      blurb: 'Enlaces de seguimiento limpios con opciones listas para Google, Meta, Google Ads, email y códigos QR impresos.',
    },
    faq: [
      ['What are UTM parameters?', 'Short tags added to the end of a link (utm_source, utm_medium, utm_campaign and two optional ones) that tell Google Analytics where a visitor came from. The page looks the same to the visitor.'],
      ['Should I use UTMs on links inside my own website?', 'No. UTMs on internal links restart the visit\'s source in Analytics and hide where people really came from. Use them only on links that point at your site from somewhere else.'],
      ['Does capitalization matter?', 'Yes. Analytics treats "Facebook" and "facebook" as two different sources. This builder lowercases values and swaps spaces for hyphens by default so your reports stay clean.'],
      ['Where do I see the results?', 'In Google Analytics 4, open Reports, then Acquisition, then Traffic acquisition, and switch the table to Session source / medium or Session campaign.'],
    ],
    faqEs: [
      ['¿Qué son los parámetros UTM?', 'Etiquetas cortas que se añaden al final de un enlace (utm_source, utm_medium, utm_campaign y dos opcionales) y le dicen a Google Analytics de dónde vino un visitante. La página se ve igual para el visitante.'],
      ['¿Debo usar UTM en los enlaces dentro de mi propio sitio?', 'No. Los UTM en enlaces internos reinician el origen de la visita en Analytics y esconden de dónde vino la gente de verdad. Úsalos solo en enlaces que apuntan a tu sitio desde otro lugar.'],
      ['¿Importan las mayúsculas?', 'Sí. Analytics trata "Facebook" y "facebook" como dos orígenes distintos. Este generador pone los valores en minúsculas y cambia los espacios por guiones para que tus reportes queden limpios.'],
      ['¿Dónde veo los resultados?', 'En Google Analytics 4, abre Informes, luego Adquisición, luego Adquisición de tráfico, y cambia la tabla a Fuente / medio de la sesión o Campaña de la sesión.'],
    ],
  },
];

export const TOOL_BY_PAGE = new Map(TOOLS.map((t) => [t.page, t]));
export const toolPath = (t) => `${TOOLS_BASE}/${t.slug}`;
