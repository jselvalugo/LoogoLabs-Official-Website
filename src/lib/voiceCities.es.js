// Spanish copy for the /ai-voice/<city> pages, keyed by slug. Merged over the
// English entry from lib/voiceCities.js when the visitor picks ES. City names
// and neighborhoods stay as they are.

export const VOICE_CITIES_ES = {
  celebration: {
    headline: 'Un agente de voz con IA que contesta las llamadas en Celebration como lo haría tu mejor recepcionista.',
    intro:
      'En un pueblo que vive de las recomendaciones, la forma en que se contesta tu teléfono es parte de tu reputación. Los residentes esperan una respuesta profesional, y los visitantes que se hospedan cerca del corredor de Disney llaman a quien conteste primero.',
    moments: [
      ['Los visitantes llaman en horario de vacaciones', 'Los huéspedes de rentas cercanas llaman por reparaciones de piscina, limpiezas y arreglos urgentes de noche y los fines de semana. El agente contesta, agenda y envía una confirmación por texto mientras tú descansas.'],
      ['Una llamada perdida se vuelve chisme', 'En un pueblo pequeño, "nunca me devolvieron la llamada" se riega rápido. Cada persona que llama recibe una respuesta cálida al primer timbre, siempre.'],
      ['Recepciones al límite', 'Los med spas y consultorios familiares de Market Street pierden llamadas mientras registran pacientes. El agente atiende el exceso para que nadie espere en línea.'],
    ],
    calls: ['Servicio de piscina', 'Cita de paciente nuevo', 'Reparación en renta vacacional', 'Cambiar una cita'],
    sample: [
      ['caller', 'Hola, nos estamos quedando en una renta en Celebration y el calentador de la piscina dejó de funcionar.'],
      ['agent', 'Lamento escuchar eso, sobre todo en vacaciones. Te puedo mandar un técnico. ¿Te sirve mañana en la mañana o necesitas a alguien esta noche?'],
      ['caller', 'Mañana en la mañana está bien.'],
      ['agent', 'Listo. Quedas agendado de 9 a 11 a. m. y te llegará un texto con el nombre del técnico.'],
    ],
  },
  kissimmee: {
    headline: 'En Kissimmee la gente llama en inglés y en español. Tu agente de voz con IA también debería hablar ambos.',
    intro:
      'Kissimmee tiene una de las comunidades bilingües más grandes de la Florida Central y una economía de rentas vacacionales que llama a toda hora. El negocio que contesta en el idioma del cliente, a las 11 p. m., se queda con el trabajo.',
    moments: [
      ['Quienes hablan español cuelgan ante un buzón en inglés', 'Una gran parte de las llamadas en Kissimmee empiezan en español. El agente saluda, califica y agenda en inglés o español para que ningún cliente se pierda por el idioma.'],
      ['Los administradores de propiedades necesitan respuestas de noche', 'Las fallas de aire acondicionado y los cierres de puerta en rentas por la US-192 no esperan al horario de oficina. El agente toma el trabajo y avisa a tu técnico de guardia.'],
      ['Diez llamadas a la vez en verano', 'Cuando sube el calor, las líneas de aire acondicionado y plomería se saturan. El agente contesta todas las llamadas al mismo tiempo, sin música de espera.'],
    ],
    calls: ['Emergencia: el aire no enfría', 'Llamada en español', 'Limpieza entre huéspedes', 'Filtración de techo tras una tormenta'],
  },
  orlando: {
    headline: 'Los clientes en Orlando cuestan demasiado para mandarlos al buzón de voz. Contesta cada uno.',
    intro:
      'Los clics en Orlando cuestan más que en casi cualquier otro lugar de la región. Cuando un cliente que pagaste llama y cae en el buzón, pagaste por el cliente de tu competencia. Un agente de voz con IA se asegura de que cada llamada que pagas sea contestada.',
    moments: [
      ['Llamadas pagadas sin contestar', 'Las llamadas de Google Ads y Local Services entran todo el día. El agente contesta en menos de un segundo y agenda el trabajo antes de que la persona pruebe el siguiente anuncio.'],
      ['Bufetes y clínicas fuera de horario', 'Las llamadas por lesiones y atención urgente pasan de noche. El agente recoge los detalles, agenda una consulta y avisa a tu equipo de cualquier urgencia.'],
      ['Clientes que llaman por vecindario', 'Alguien de Lake Nona o Dr. Phillips quiere saber si atiendes su zona. El agente confirma la cobertura por vecindario y agenda en el momento.'],
    ],
    calls: ['Consulta gratis', 'Servicio el mismo día', 'Pregunta sobre seguro', 'Solicitud de cotización'],
    sample: [
      ['caller', 'Hola, ayer tuve un accidente de carro en la I-4 y necesito hablar con alguien.'],
      ['agent', 'Siento mucho que te haya pasado. Primero, ¿estás bien y ya te vio un médico? Te puedo agendar hoy una consulta gratis con un abogado.'],
      ['caller', 'Estoy bien. Hoy sería perfecto.'],
      ['agent', 'Te tengo para hoy a las 4 p. m. Te llegará un texto con la dirección y lo que debes traer.'],
    ],
  },
  'st-cloud': {
    headline: 'St. Cloud crece más rápido de lo que tu teléfono puede seguir. Deja que la IA conteste.',
    intro:
      'Los nuevos vecindarios por Narcoossee Road traen un flujo constante de primeras llamadas de dueños de casa que todavía no han escogido a sus proveedores. Muchos viajan al trabajo y llaman después de salir, cuando las oficinas pequeñas ya cerraron.',
    moments: [
      ['Los nuevos dueños llaman después de las 6 p. m.', 'La gente llega a casa y empieza a llamar por jardinería, control de plagas y reparaciones. El agente contesta en la noche y agenda el primer espacio disponible.'],
      ['Equipos pequeños en la obra', 'Cuando el dueño está en un techo o debajo de un fregadero, nadie contesta el teléfono. El agente cubre cada llamada para que puedas terminar el trabajo.'],
      ['La primera llamada gana el cliente', 'Un residente nuevo que te contacta primero muchas veces se queda por años. Contestar al primer timbre es el mercadeo más barato que puedes comprar.'],
    ],
    calls: ['Estimado de jardinería', 'Cita de control de plagas', 'Pregunta sobre reparación en garantía', 'Cotización de lavado a presión'],
    sample: [
      ['caller', 'Hola, nos acabamos de mudar a una casa nueva por Narcoossee y necesitamos servicio de jardinería.'],
      ['agent', '¡Bienvenidos al vecindario! Te puedo agendar un estimado gratis. ¿Te sirve el sábado en la mañana?'],
      ['caller', 'El sábado está perfecto.'],
      ['agent', 'Quedas agendado para el sábado a las 10. Te mando un recordatorio por texto el viernes en la noche.'],
    ],
  },
  'winter-garden': {
    headline: 'Las familias de Winter Garden investigan con cuidado. Haz que la primera llamada se sienta de primera.',
    intro:
      'Entre Horizon West y la histórica Plant Street, los dueños de casa en Winter Garden comparan proveedores de cerca y juzgan a un negocio por cómo contesta el teléfono. Un agente de voz con IA le da a cada persona una primera impresión tranquila y profesional.',
    moments: [
      ['Llamadas por proyectos de alto valor', 'La construcción de piscinas y áreas exteriores empieza con una llamada. El agente hace las preguntas correctas y agenda una consulta de diseño en vez de prometer que alguien devolverá la llamada.'],
      ['Consultorios pediátricos y familiares ocupados', 'Los padres llaman durante la recogida escolar y la hora del almuerzo. El agente agenda, cambia citas y contesta preguntas comunes sin fila de espera.'],
      ['Reservaciones de restaurante el fin de semana', 'Los restaurantes de Plant Street se llenan los viernes en la noche. El agente toma llamadas de reservaciones y catering mientras el personal atiende el salón.'],
    ],
    calls: ['Consulta de diseño de piscina', 'Cita pediátrica', 'Consulta de catering', 'Plan de mantenimiento de aire acondicionado'],
    sample: [
      ['caller', 'Hola, estamos en Horizon West y queremos hablar sobre construir una piscina.'],
      ['agent', 'Excelente. ¿Ya tienen un diseño en mente o prefieren que un diseñador vaya a recorrer el patio con ustedes?'],
      ['caller', 'Un diseñador sería ideal.'],
      ['agent', 'Tengo disponible el jueves a las 5:30. Te envío un texto con el nombre del diseñador y un cuestionario corto.'],
    ],
  },
  clermont: {
    headline: 'Negocios de Clermont: contesten cada llamada sin contratar otra recepcionista.',
    intro:
      'El crecimiento de Clermont por la US-27 y su población activa y amante del aire libre mantienen ocupados los teléfonos de clínicas, oficios y negocios de fitness. Muchos son equipos pequeños donde el dueño contesta entre un trabajo y otro, o entre sesiones.',
    moments: [
      ['Recepciones de terapia física y medicina deportiva', 'Las clínicas que atienden a ciclistas y atletas hacen malabares entre registros y llamadas. El agente agenda evaluaciones y contesta las preguntas de seguro para las que fue entrenado.'],
      ['Temporada de riego y jardinería', 'La primavera y el verano traen una ola de llamadas por reparación de rociadores y trabajo de jardín. El agente califica el trabajo y lo agenda mientras las cuadrillas están afuera.'],
      ['Llamadas desde Four Corners hasta Minneola', 'El agente confirma si atiendes la zona de quien llama antes de agendar, para que tu equipo nunca maneje a un trabajo fuera de su área.'],
    ],
    calls: ['Evaluación de terapia física', 'Reparación de rociadores', 'Inspección de techo', 'Pregunta sobre membresía de gimnasio'],
    sample: [
      ['caller', 'Hola, me lastimé la rodilla entrenando para un triatlón y quiero que me la revisen.'],
      ['agent', 'Lamento escuchar eso. Te puedo agendar una evaluación de terapia física. ¿Prefieres temprano en la mañana o después del trabajo?'],
      ['caller', 'Temprano en la mañana.'],
      ['agent', 'Quedas para el martes a las 7 a. m. Te envío ahora por texto el formulario de admisión.'],
    ],
  },
  'winter-park': {
    headline: 'Los clientes de Winter Park esperan una respuesta impecable. Tu agente de voz con IA se la da.',
    intro:
      'Winter Park es un mercado establecido y acomodado donde los clientes eligen por reputación y notan cada detalle, empezando por cómo se contesta el teléfono. Un agente de voz con IA bien entrenado suena sereno, nunca apurado, y nunca deja a un cliente en espera.',
    moments: [
      ['Estudios boutique en pleno servicio', 'El personal de salones y spas no puede dejar a un cliente para contestar. El agente agenda citas y responde preguntas sobre servicios con tu mismo tono.'],
      ['Servicios profesionales fuera de horario', 'Los posibles clientes de bufetes y firmas financieras muchas veces llaman en la noche. El agente recoge los detalles y agenda una consulta.'],
      ['Proyectos especializados en el hogar', 'Los dueños de casas históricas y frente al lago llaman con preguntas detalladas. El agente reúne los datos para que tu especialista devuelva la llamada preparado.'],
    ],
    calls: ['Cita de spa o salón', 'Consulta de planificación patrimonial', 'Consulta de diseño de interiores', 'Reservación de restaurante'],
    sample: [
      ['caller', 'Buenas noches, quisiera reservar un facial para el sábado si tienen algo disponible.'],
      ['agent', 'Claro que sí. Tengo a las 11 a. m. o a las 2:30 p. m. con María. ¿Cuál prefieres?'],
      ['caller', 'A las 2:30, por favor.'],
      ['agent', 'Perfecto. Quedas confirmada para el sábado a las 2:30 y te enviaré un recordatorio el día antes.'],
    ],
  },
  'lake-mary': {
    headline: 'Los profesionales de Lake Mary no dejan mensajes de voz. Agendan con quien conteste.',
    intro:
      'Lake Mary está lleno de hogares de altos ingresos con poco tiempo y de parques de oficinas por la I-4. Aquí la gente quiere una respuesta y una cita agendada en una llamada corta. Un agente de voz con IA les da exactamente eso, a cualquier hora.',
    moments: [
      ['Llamadas entre reunión y reunión', 'Los profesionales llaman en un descanso de cinco minutos. El agente contesta al instante y agenda antes de que los vuelvan a llamar al trabajo.'],
      ['Compradores B2B por la I-4', 'Los gerentes de oficina que llaman por soporte de IT, limpieza o catering esperan una respuesta de nivel empresarial. El agente califica la solicitud y la dirige a la persona correcta.'],
      ['Exceso de llamadas en med spas y clínicas', 'Las clínicas estéticas y de especialidad compiten fuerte aquí. El agente agenda consultas aunque la recepción esté llena.'],
    ],
    calls: ['Consulta de Botox', 'Solicitud de soporte de IT', 'Cita de impuestos para cliente nuevo', 'Consulta de odontología estética'],
    sample: [
      ['caller', 'Hola, nuestra oficina en Lake Mary necesita ayuda de IT, la red está caída desde esta mañana.'],
      ['agent', 'Entendido, eso es urgente. ¿Cuántas personas están afectadas y alguien puede trabajar en este momento?'],
      ['caller', 'Unas veinte personas, nadie puede trabajar.'],
      ['agent', 'Lo estoy marcando como urgente y avisando a un técnico ahora mismo. Te devolverán la llamada en menos de quince minutos.'],
    ],
  },
  sanford: {
    headline: 'Negocios de Sanford: no pierdan ni una llamada, desde el downtown hasta el aeropuerto.',
    intro:
      'Sanford combina un downtown histórico renovado con una demanda constante de servicios para el hogar y un aeropuerto que trae visitantes todos los días. Muchos negocios locales todavía dependen de una sola línea telefónica, y eso convierte las horas ocupadas en llamadas perdidas.',
    moments: [
      ['Llamadas por daños de agua a las 2 a. m.', 'Las emergencias de restauración en casas antiguas del downtown no esperan a la mañana. El agente contesta, reúne los detalles y avisa a tu cuadrilla de guardia.'],
      ['Viajeros del aeropuerto buscando servicio', 'Los visitantes que llegan a Sanford llaman por reparaciones de carro, transporte y servicios rápidos. El agente contesta y agenda mientras todavía están en la acera.'],
      ['Eventos en First Street y fiestas privadas', 'Los locales y cervecerías reciben llamadas de eventos en sus horas más ocupadas. El agente toma fechas, número de invitados y datos de contacto.'],
    ],
    calls: ['Emergencia por daños de agua', 'Cita de mecánica', 'Reservación de evento privado', 'Estimado de plomería'],
    sample: [
      ['caller', 'Hola, se reventó una tubería en la cocina y hay agua por todos lados.'],
      ['agent', 'Lo siento mucho. Primero, si puedes, cierra la válvula principal del agua. Estoy avisando ahora a nuestra cuadrilla de guardia. ¿Cuál es la dirección?'],
      ['caller', 'Es cerca del downtown de Sanford, por First Street.'],
      ['agent', 'Entendido. Ya va un técnico en camino y te llegará un texto con su hora de llegada.'],
    ],
  },
  'altamonte-springs': {
    headline: 'Los consultorios de Altamonte Springs pierden pacientes en espera. Un agente de voz con IA acaba con la espera.',
    intro:
      'Altamonte Springs es un centro médico y comercial muy concurrido por la SR-436, donde pacientes y clientes llegan de todo el norte del área metropolitana. Cuando alguien espera en línea, el consultorio a una milla está a un toque de distancia.',
    moments: [
      ['Consultorios médicos con filas de llamadas llenas', 'Los pacientes que llaman para agendar o cambiar citas esperan en línea mientras el personal registra a otros. El agente contesta todas las llamadas a la vez y deja la fila en cero.'],
      ['Ausencias y cambios de cita', 'El agente maneja los cambios de cita en el momento para que los espacios libres se llenen en vez de desperdiciarse.'],
      ['La competencia a una salida de distancia', 'Con tantos negocios parecidos por la SR-436, gana el primero que contesta. El agente se asegura de que seas tú.'],
    ],
    calls: ['Cita de paciente nuevo', 'Cambiar una visita', 'Turno sin cita en barbería', 'Cotización de servicio de carro'],
    sample: [
      ['caller', 'Hola, necesito cambiar mi limpieza dental del jueves.'],
      ['agent', 'Sin problema. Te puedo ofrecer el próximo lunes a las 10 o el martes a las 3. ¿Cuál te funciona mejor?'],
      ['caller', 'El martes a las 3.'],
      ['agent', 'Listo. Tu limpieza ahora es el martes a las 3 p. m. y te enviaré un recordatorio por texto el día antes.'],
    ],
  },
  oviedo: {
    headline: 'Los padres de Oviedo llaman desde la fila de la escuela y la práctica. Contesta cada llamada.',
    intro:
      'Oviedo es un suburbio familiar junto a UCF donde los padres llaman entre viajes a la escuela, prácticas y el trabajo. Investigan con cuidado y recuerdan qué negocio contestó y cuál los mandó al buzón de voz.',
    moments: [
      ['Llamadas desde la fila de recogida', 'Los padres llaman a pediatras y tutores desde la fila de la escuela. El agente agenda rápido para que la llamada quepa en unos minutos.'],
      ['La mudanza de entrada y salida en UCF', 'Los administradores de propiedades y negocios de servicio cerca del campus reciben una avalancha de llamadas en agosto y mayo. El agente maneja el pico sin personal extra.'],
      ['Inscripciones de deportes juveniles y actividades', 'Las preguntas de inscripción se acumulan al inicio de cada temporada. El agente contesta preguntas comunes y toma inscripciones a toda hora.'],
    ],
    calls: ['Visita de odontología pediátrica', 'Inscripción a tutorías', 'Mantenimiento de renta estudiantil', 'Mantenimiento de aire acondicionado'],
    sample: [
      ['caller', 'Hola, busco un tutor de matemáticas para mi hijo, está en octavo grado.'],
      ['agent', 'Con gusto te ayudo. ¿Prefieres las sesiones en tu casa en Oviedo o en nuestro centro, y qué tardes te funcionan mejor?'],
      ['caller', 'En el centro, los martes y jueves.'],
      ['agent', 'Te agendé una evaluación gratis para este martes a las 4:30. Te envío los detalles por texto ahora.'],
    ],
  },
  apopka: {
    headline: 'Los oficios de Apopka están demasiado ocupados para contestar el teléfono. Deja que un agente de voz con IA lo haga.',
    intro:
      'Los nuevos vecindarios de Apopka por la Wekiva Parkway siguen generando llamadas por jardinería, control de plagas y techos, mientras muchos negocios locales establecidos todavía trabajan con una cuadrilla pequeña y un solo teléfono.',
    moments: [
      ['Cuadrillas en el campo todo el día', 'Los equipos de jardinería y techos no pueden contestar desde una escalera. El agente agenda estimados para que la cuadrilla nunca pierda un trabajo por una llamada perdida.'],
      ['Nuevos dueños comparando opciones', 'Las familias en desarrollos nuevos llaman a varias compañías seguidas. La que contesta y agenda primero casi siempre gana.'],
      ['Pedidos de viveros y B2B', 'Los viveros y suplidores reciben llamadas de contratistas sobre pedidos y disponibilidad. El agente toma los detalles del pedido y los pasa a tu equipo.'],
    ],
    calls: ['Estimado de jardinería', 'Servicio de control de plagas', 'Reparación de techo', 'Pedido de plantas al por mayor'],
    sample: [
      ['caller', 'Hola, nos acabamos de mudar cerca de Wekiva y necesitamos a alguien que rehaga el jardín.'],
      ['agent', 'Felicidades por la casa nueva. Te puedo agendar un estimado gratis. ¿Hay algún día de esta semana que te funcione?'],
      ['caller', 'El miércoles en la tarde.'],
      ['agent', 'Quedas para el miércoles a las 3. Te envío por texto la confirmación y el nombre de nuestro estimador.'],
    ],
  },
};
