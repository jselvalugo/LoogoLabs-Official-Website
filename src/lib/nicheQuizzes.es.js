// Spanish copy for the niche fit checks in lib/nicheQuizzes.js, keyed by page.
// Question/option arrays run parallel to the English ones; the English option
// text is still what gets stored on the lead, only the display is translated.

export const DECISION_ES = {
  question: '¿Eres el dueño, o la persona que decide sobre herramientas como esta?',
  options: ['Sí, soy yo', 'No, tendría que consultarlo con alguien'],
};

export const NICHE_QUIZZES_ES = {
  QuizHomeServices: {
    label: 'Evaluación de llamadas perdidas para servicios del hogar',
    product: 'El mensaje automático por llamada perdida',
    headline: 'Cada llamada perdida es un trabajo que se lleva tu competencia.',
    lede: 'Para profesionales de aire acondicionado, plomería, electricidad, techos y piscinas. Descubre cuántos trabajos se te escapan mientras tu equipo está en la escalera.',
    description: 'Para profesionales de aire acondicionado, plomería, techos y piscinas: descubre cuántos trabajos pierdes por llamadas sin contestar y respuestas lentas.',
    questions: [
      { question: '¿Qué tipo de servicio para el hogar ofreces?',
        options: ['Aire acondicionado (HVAC)', 'Plomería', 'Electricidad', 'Techos', 'Piscinas y jardinería', 'Otro'] },
      { question: '¿Aproximadamente cuántas llamadas quedan sin contestar en una semana normal?',
        options: ['0–5', '6–15', '16–30', '30+', 'La verdad, no tengo idea'] },
      { question: '¿Qué pasa hoy con una llamada perdida?',
        options: ['Devolvemos la llamada cuando podemos', 'Se va al buzón de voz y casi siempre se pierde', 'Alguien en la oficina se encarga', 'No tenemos ningún sistema'] },
      DECISION_ES,
    ],
    result: 'El mensaje automático por llamada perdida responde en segundos, así el cliente te espera a ti en vez de llamar a la siguiente empresa.',
  },
  QuizDental: {
    label: 'Evaluación de ausencias para dentistas y med spas',
    product: 'El sistema de recordatorios y citas de control',
    headline: 'Una silla vacía es lo más caro de tu consultorio.',
    lede: 'Para consultorios dentales, med spas y clínicas. Descubre cuánto te cuestan realmente las ausencias y los pacientes atrasados en sus citas de control.',
    description: 'Para consultorios dentales, med spas y clínicas: descubre cuánto te cuestan las ausencias y los pacientes atrasados en sus citas de control.',
    questions: [
      { question: '¿Qué tipo de consultorio tienes?',
        options: ['Odontología general', 'Ortodoncia / especialidad dental', 'Med spa', 'Quiropráctica / fisioterapia', 'Otro'] },
      { question: '¿Cuántas ausencias o cancelaciones tardías tienes en una semana normal?',
        options: ['0–2', '3–5', '6–10', '10+'] },
      { question: '¿Qué es lo que más afecta tu agenda?',
        options: ['Ausencias y cancelaciones de último minuto', 'Pacientes atrasados en sus citas de control', 'La recepción está muy ocupada para confirmar', 'Consultas de pacientes nuevos que se enfrían'] },
      DECISION_ES,
    ],
    result: 'Las confirmaciones, recordatorios y mensajes de seguimiento automáticos mantienen tu agenda llena sin darle más trabajo a la recepción.',
  },
  QuizSalon: {
    label: 'Evaluación de citas repetidas para salones y spas',
    product: 'La automatización de citas repetidas y recuperación de clientes',
    headline: 'Tus mejores clientes están a una cita olvidada de irse con otro.',
    lede: 'Para salones, barberías, estudios de uñas y spas. Descubre cuántos clientes habituales se alejan sin decir nada cada mes.',
    description: 'Para salones, barberías, estudios de uñas y spas: descubre cuántos clientes habituales se alejan sin un sistema para volver a agendar.',
    questions: [
      { question: '¿Qué tipo de estudio tienes?',
        options: ['Salón de belleza', 'Barbería', 'Estudio de uñas', 'Spa / masajes', 'Pestañas, cejas y estética'] },
      { question: '¿Cuántas citas agendas en una semana normal?',
        options: ['Menos de 25', '25–60', '61–120', '120+'] },
      { question: '¿Cuál es el mayor problema ahora mismo?',
        options: ['Los clientes no agendan su próxima cita antes de irse', 'Huecos y cancelaciones de último minuto', 'Clientes habituales que dejan de venir', 'No hay suficientes reseñas ni referidos'] },
      DECISION_ES,
    ],
    result: 'Los recordatorios para volver a agendar, los mensajes para llenar huecos y las campañas de recuperación traen de vuelta a tus clientes habituales de forma automática.',
  },
  QuizRealEstate: {
    label: 'Evaluación de respuesta a prospectos inmobiliarios',
    product: 'El seguimiento inmediato de prospectos',
    headline: 'El agente que responde primero suele quedarse con la propiedad.',
    lede: 'Para agentes, equipos y corredurías. Descubre qué tan rápido reciben respuesta tus prospectos, y cuántos nunca la reciben.',
    description: 'Para agentes, equipos y corredurías: descubre qué tan rápido reciben respuesta tus prospectos y cuántos se pierden sin seguimiento.',
    questions: [
      { question: '¿Qué te describe mejor?',
        options: ['Agente independiente', 'Líder de equipo', 'Correduría', 'Administración de propiedades', 'Hipotecas / títulos'] },
      { question: '¿Cuántos prospectos nuevos te llegan por semana?',
        options: ['Menos de 5', '5–15', '16–40', '40+'] },
      { question: '¿Dónde se te pierden los prospectos?',
        options: ['La primera respuesta es lenta', 'No hay seguimiento a largo plazo', 'Los prospectos están regados en demasiadas apps', 'Los clientes anteriores nunca vuelven a saber de nosotros'] },
      DECISION_ES,
    ],
    result: 'Las respuestas instantáneas y los mensajes de seguimiento a largo plazo mantienen a cada prospecto interesado hasta que esté listo para mudarse.',
  },
  QuizVacationRental: {
    label: 'Evaluación de reservas directas para alquileres vacacionales',
    product: 'La mensajería con huéspedes para reservas directas',
    headline: 'Deja de pagar comisiones por huéspedes que ya te adoran.',
    lede: 'Para anfitriones y administradores de alquileres de corto plazo en Orlando, Kissimmee y Celebration. Descubre cuántos huéspedes recurrentes podrías reservar directamente.',
    description: 'Para anfitriones y administradores de alquileres de corto plazo en la Florida Central: descubre cuántos huéspedes recurrentes podrías reservar directamente.',
    questions: [
      { question: '¿Cuántas propiedades administras?',
        options: ['1 propiedad', '2–5 propiedades', '6–20 propiedades', 'Más de 20 propiedades'] },
      { question: '¿Cuántas llegadas de huéspedes tienes en un mes normal?',
        options: ['Menos de 5', '5–15', '16–40', '40+'] },
      { question: '¿Qué te está costando más tiempo o dinero?',
        options: ['Comisiones de la plataforma en cada reserva', 'Responder las mismas preguntas de los huéspedes', 'Los huéspedes anteriores nunca reservan directo', 'Conseguir suficientes reseñas de 5 estrellas'] },
      DECISION_ES,
    ],
    result: 'La mensajería automática con huéspedes responde las preguntas, recoge reseñas e invita a los huéspedes anteriores a reservar directo la próxima vez.',
  },
};
