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
    faq: [
      [
        "¿Un agente de IA sonará adecuado para los clientes de Celebration?",
        "Para eso lo configuramos con cuidado. Escribimos el saludo y el tono para que suene como tu mejor recepcionista, y revisamos llamadas reales en los primeros 30 días para corregir lo que no suene bien."
      ],
      [
        "¿Puede atender llamadas de huéspedes de rentas vacacionales?",
        "Sí. Puede confirmar la dirección de la propiedad, anotar el problema, agendar una visita y enviar una confirmación por texto, para que los huéspedes cerca del corredor de Disney reciban respuesta de noche y los fines de semana."
      ]
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
    faq: [
      [
        "¿El agente cambia a español por sí solo?",
        "Sí. Si quien llama habla español, el agente continúa en español, agenda la cita y envía la confirmación en el mismo idioma."
      ],
      [
        "¿Puede con la ola de llamadas de aire acondicionado en verano?",
        "Sí. Contesta todas las llamadas al mismo tiempo, así que diez personas durante una ola de calor reciben respuesta en vez de una línea ocupada o el buzón de voz. Las llamadas urgentes de aire que no enfría se pueden enviar a tu técnico de guardia."
      ]
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
    faq: [
      [
        "¿Vale la pena un agente de voz con IA para un equipo pequeño en St. Cloud?",
        "Muchas veces es más útil para equipos pequeños. Cuando el dueño está en un trabajo, las llamadas se quedan sin contestar. El agente las cubre y agenda el trabajo para que no tengas que parar lo que estás haciendo."
      ],
      [
        "¿Contesta las llamadas de la noche de quienes trabajan fuera?",
        "Sí. Funciona a toda hora, así que un propietario que llama a las 7 p. m. al llegar a casa puede agendar una cotización en ese momento."
      ]
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
    faq: [
      [
        "¿El agente puede agendar cotizaciones para casas nuevas en la US-27?",
        "Sí. Pide la dirección y el trabajo, revisa tu calendario y agenda la visita, para que los nuevos propietarios en zonas que crecen tengan una hora antes de llamar a la siguiente compañía."
      ],
      [
        "¿Funciona para clínicas y estudios de fitness?",
        "Sí. En clínicas puede agendar y cambiar citas y tomar los datos de pacientes nuevos; en estudios puede contestar preguntas sobre horarios y agendar clases de introducción. Todo lo médico o delicado pasa a tu personal."
      ]
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
    faq: [
      [
        "¿El agente puede contestar las preguntas que hacen los padres?",
        "Sí. Lo entrenamos con tu horario, tus servicios y las preguntas que más hacen las familias, para que conteste las comunes y agende la visita. Lo que no tenga claro pasa a tu equipo."
      ],
      [
        "¿Ayuda durante las mudanzas de entrada y salida de UCF?",
        "Sí. Esas semanas traen un pico de llamadas para limpieza, reparaciones y mudanzas. El agente las contesta todas a la vez y agenda lo que cabe en tu calendario."
      ]
    ],
  },
};
