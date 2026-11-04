// Funnel content for the five niche fit checks, so each one follows the same
// structure as the AI Receptionist and Reputation Autopilot funnels:
// hero (with stats) → problem → what it does → side-by-side → reviews → quiz.
// The explainer screens are optional: the hero's Start button goes straight to
// the questions. Keyed by page, parallel to lib/nicheQuizzes.js.
//
// Claims describe what the system does; no invented statistics.
// `icon` names map to Phosphor icons in pages/NicheQuiz.jsx.

export const NICHE_FUNNELS = {
  QuizHomeServices: {
    en: {
      h1: ['Every missed call', 'is a job your competitor books.'],
      stats: [['< 60 s', 'Text-back after a missed call'], ['24/7', 'Nights & weekends covered'], ['EN / ES', 'Bilingual replies'], ['~2 weeks', 'To go live']],
      problem: {
        eyebrow: 'The real cost of a missed call',
        title: 'The phone rings while your hands are full.',
        items: [
          ['Your crew is on a roof, not by the phone', 'Calls come in while everyone is on a job. By the time someone checks voicemail, the customer has already called the next company.'],
          ['Voicemail is where jobs go to die', "Someone with a leaking pipe or a dead AC unit isn't waiting for a call-back. They keep dialing until someone picks up."],
          ['Call-backs happen when you get to them', 'At the end of a long day, returning calls slips. A lead that was hot at 10 a.m. is booked with someone else by 6 p.m.'],
        ],
      },
      caps: {
        title: 'Every caller hears back. Even when no one picks up.',
        items: [
          ['Texts back every missed call', 'Seconds after a missed call, the customer gets a text from your business number asking how you can help.', 'ChatCircleText'],
          ['Books the job by text', 'Customers reply with the details and get a booking link, so the job lands on your calendar without phone tag.', 'CalendarCheck'],
          ['One inbox for calls, texts and forms', 'Every conversation in one place on your phone, so nothing slips between the office and the truck.', 'Tray'],
          ['Asks for the review when the job is done', 'A review request goes out automatically after each finished job.', 'Star'],
        ],
      },
      compare: {
        eyebrow: 'Missed-call text-back vs. voicemail', us: 'Text-back', them: 'Voicemail',
        rows: [
          ['First response', 'Within seconds, automatically', 'Whenever someone calls back'],
          ['After hours & weekends', 'Covered', 'Voicemail box'],
          ['Customer effort', 'Reply to a text', 'Wait, or call someone else'],
          ['Booking', 'Link sent in the thread', 'Phone tag'],
          ['Tracking', 'Every lead logged', 'Notes, if anyone remembers'],
        ],
      },
    },
    es: {
      h1: ['Cada llamada perdida', 'es un trabajo que se lleva tu competencia.'],
      stats: [['< 60 s', 'Mensaje tras una llamada perdida'], ['24/7', 'Noches y fines de semana'], ['EN / ES', 'Respuestas bilingües'], ['~2 semanas', 'Para estar activo']],
      problem: {
        eyebrow: 'El costo real de una llamada perdida',
        title: 'El teléfono suena cuando tienes las manos ocupadas.',
        items: [
          ['Tu equipo está en un techo, no junto al teléfono', 'Las llamadas entran mientras todos están en un trabajo. Cuando alguien revisa el buzón de voz, el cliente ya llamó a la siguiente empresa.'],
          ['El buzón de voz es donde se pierden los trabajos', 'Alguien con una tubería rota o un aire acondicionado dañado no espera a que le devuelvan la llamada. Sigue marcando hasta que alguien conteste.'],
          ['Las llamadas se devuelven cuando se puede', 'Al final de un día largo, devolver llamadas se queda para después. Un cliente interesado a las 10 a.m. ya contrató a otro a las 6 p.m.'],
        ],
      },
      caps: {
        title: 'Cada cliente recibe respuesta. Aunque nadie conteste.',
        items: [
          ['Responde por texto cada llamada perdida', 'Segundos después de una llamada perdida, el cliente recibe un mensaje desde el número de tu negocio preguntando en qué puedes ayudar.', 'ChatCircleText'],
          ['Agenda el trabajo por texto', 'El cliente responde con los detalles y recibe un enlace para agendar, sin estar llamándose de un lado a otro.', 'CalendarCheck'],
          ['Una sola bandeja para llamadas, textos y formularios', 'Todas las conversaciones en un solo lugar en tu teléfono, para que nada se pierda entre la oficina y el camión.', 'Tray'],
          ['Pide la reseña al terminar el trabajo', 'Una solicitud de reseña sale automáticamente después de cada trabajo terminado.', 'Star'],
        ],
      },
      compare: {
        eyebrow: 'Mensaje automático vs. buzón de voz', us: 'Mensaje automático', them: 'Buzón de voz',
        rows: [
          ['Primera respuesta', 'En segundos, automática', 'Cuando alguien devuelve la llamada'],
          ['Noches y fines de semana', 'Cubiertos', 'Buzón de voz'],
          ['Esfuerzo del cliente', 'Responder un texto', 'Esperar o llamar a otro'],
          ['Agendar', 'Enlace en la conversación', 'Llamadas de ida y vuelta'],
          ['Seguimiento', 'Cada cliente registrado', 'Notas, si alguien se acuerda'],
        ],
      },
    },
  },

  QuizDental: {
    en: {
      h1: ['Empty chairs are the most expensive thing', 'in your practice.'],
      stats: [['24/7', 'Confirmations run themselves'], ['2-way', 'Patients reply by text'], ['Auto', 'Recall reminders'], ['~2 weeks', 'To go live']],
      problem: {
        eyebrow: 'The real cost of an empty chair',
        title: 'No-shows and overdue recalls add up fast.',
        items: [
          ["A no-show is an hour you can't sell twice", 'The hygienist is paid, the room is ready and the hour is gone. Fill it the same day or lose it.'],
          ['Confirming by phone eats the front desk', "Every confirmation call is a call your team isn't taking from a new patient."],
          ['Overdue patients drift away quietly', 'Patients who miss their six-month visit rarely call to rebook on their own. Without recall, they slip away.'],
        ],
      },
      caps: {
        title: 'A full schedule without more phone calls.',
        items: [
          ['Confirms every appointment by text', 'Patients confirm or reschedule with a reply, and the schedule updates without a call.', 'CalendarCheck'],
          ['Sends reminders at the right times', 'Reminders go out ahead of each visit, timed so patients actually see them.', 'Bell'],
          ['Brings overdue patients back', 'Recall texts go to patients who are due or overdue, with a link to book.', 'ArrowsClockwise'],
          ['Answers new patient inquiries fast', "Form fills and missed calls get an instant reply, so new patients don't book elsewhere.", 'UserPlus'],
        ],
      },
      compare: {
        eyebrow: 'Automated vs. by phone', us: 'Automated', them: 'By phone',
        rows: [
          ['Confirmations', 'Every patient, automatically', 'When the front desk has time'],
          ['Patient effort', 'Reply to confirm', 'Call back during office hours'],
          ['Recall', 'Due patients get a text', 'Pulled from a list, if at all'],
          ['Same-day openings', 'Waitlist texted right away', 'Phone calls one by one'],
          ['Front desk time', 'Freed up', 'Spent dialing'],
        ],
      },
    },
    es: {
      h1: ['Una silla vacía es lo más caro', 'de tu consultorio.'],
      stats: [['24/7', 'Confirmaciones automáticas'], ['2 vías', 'Pacientes responden por texto'], ['Auto', 'Recordatorios de control'], ['~2 semanas', 'Para estar activo']],
      problem: {
        eyebrow: 'El costo real de una silla vacía',
        title: 'Las ausencias y los controles atrasados suman rápido.',
        items: [
          ['Una ausencia es una hora que no puedes vender dos veces', 'La higienista ya cobró, el consultorio está listo y la hora se perdió. Se llena el mismo día o se pierde.'],
          ['Confirmar por teléfono consume a la recepción', 'Cada llamada de confirmación es una llamada de un paciente nuevo que tu equipo no está contestando.'],
          ['Los pacientes atrasados se alejan sin avisar', 'Quien se salta su cita de seis meses casi nunca llama solo para reagendar. Sin un sistema de control, se pierde.'],
        ],
      },
      caps: {
        title: 'Una agenda llena sin más llamadas.',
        items: [
          ['Confirma cada cita por texto', 'El paciente confirma o reprograma con una respuesta, y la agenda se actualiza sin llamar.', 'CalendarCheck'],
          ['Envía recordatorios en el momento justo', 'Los recordatorios salen antes de cada cita, a la hora en que el paciente sí los ve.', 'Bell'],
          ['Trae de vuelta a los pacientes atrasados', 'Los pacientes que ya toca o que están atrasados reciben un texto con un enlace para agendar.', 'ArrowsClockwise'],
          ['Responde rápido a pacientes nuevos', 'Los formularios y las llamadas perdidas reciben respuesta al instante, para que no agenden en otro lugar.', 'UserPlus'],
        ],
      },
      compare: {
        eyebrow: 'Automatizado vs. por teléfono', us: 'Automatizado', them: 'Por teléfono',
        rows: [
          ['Confirmaciones', 'Cada paciente, automáticamente', 'Cuando la recepción tiene tiempo'],
          ['Esfuerzo del paciente', 'Responder para confirmar', 'Llamar en horario de oficina'],
          ['Citas de control', 'Texto a quien le toca', 'De una lista, si acaso'],
          ['Espacios del mismo día', 'Texto a la lista de espera', 'Llamadas una por una'],
          ['Tiempo de la recepción', 'Liberado', 'Marcando teléfonos'],
        ],
      },
    },
  },

  QuizSalon: {
    en: {
      h1: ['Your best clients are one forgotten rebook', 'away from someone else.'],
      stats: [['24/7', 'Clients can book'], ['Auto', 'Rebook reminders'], ['Same day', 'Gaps filled by text'], ['Every visit', 'Asks for a review']],
      problem: {
        eyebrow: 'The real cost of a quiet regular',
        title: "Regulars don't leave. They just stop booking.",
        items: [
          ['Clients forget to rebook at checkout', "If the next visit isn't on the calendar before they leave, weeks easily turn into months."],
          ['Last-minute openings sit empty', 'A cancellation at 9 a.m. is an empty chair at 2 p.m. unless someone texts the right clients fast.'],
          ['Nobody notices a regular going quiet', "There's no alert when a six-week client hits twelve weeks. By then they may have found someone new."],
        ],
      },
      caps: {
        title: 'Your regulars, back on schedule automatically.',
        items: [
          ['Reminds clients when they are due', 'A rebook text goes out when each client is due, based on their usual visit rhythm.', 'ArrowsClockwise'],
          ['Fills last-minute openings', 'When a slot opens, a text goes to clients who want an earlier spot.', 'Lightning'],
          ['Wins back clients who drifted', "Clients who haven't been in for a while get a friendly note and an easy way to book.", 'Heart'],
          ['Turns happy visits into reviews', 'A review request goes out after each appointment, while the new look is still fresh.', 'Star'],
        ],
      },
      compare: {
        eyebrow: 'Automated vs. remembering', us: 'Automated', them: 'By memory',
        rows: [
          ['Rebooking', 'Every client, on time', 'When you remember'],
          ['Open slots', 'Texted to the waitlist', 'Posted on social, maybe'],
          ['Lapsed clients', 'Win-back text sent', 'Noticed months later'],
          ['Reviews', 'Asked after every visit', 'Asked now and then'],
          ['Your time', 'Spent on clients', 'Spent on your phone'],
        ],
      },
    },
    es: {
      h1: ['Tus mejores clientas están a una cita olvidada', 'de irse con alguien más.'],
      stats: [['24/7', 'Reservas en línea'], ['Auto', 'Recordatorios para volver'], ['Mismo día', 'Huecos llenados por texto'], ['Cada visita', 'Pide una reseña']],
      problem: {
        eyebrow: 'El costo real de una clienta que se aleja',
        title: 'Las clientas fieles no se van. Solo dejan de reservar.',
        items: [
          ['Se olvidan de reservar al pagar', 'Si la próxima cita no queda en el calendario antes de que se vayan, las semanas se vuelven meses.'],
          ['Los espacios de último minuto quedan vacíos', 'Una cancelación a las 9 a.m. es una silla vacía a las 2 p.m., a menos que alguien les escriba rápido a las clientas indicadas.'],
          ['Nadie nota cuando una clienta se aleja', 'No hay aviso cuando una clienta de cada seis semanas llega a doce. Para entonces, quizás ya encontró a alguien más.'],
        ],
      },
      caps: {
        title: 'Tus clientas, de vuelta en la agenda automáticamente.',
        items: [
          ['Les recuerda cuando les toca', 'Un texto para reservar sale cuando a cada clienta le toca, según su ritmo de visitas.', 'ArrowsClockwise'],
          ['Llena los espacios de último minuto', 'Cuando se abre un espacio, un texto les llega a las clientas que quieren adelantar su cita.', 'Lightning'],
          ['Recupera a las clientas que se alejaron', 'Quien no ha venido en un tiempo recibe un mensaje amable y una forma fácil de reservar.', 'Heart'],
          ['Convierte visitas felices en reseñas', 'Una solicitud de reseña sale después de cada cita, mientras el nuevo look está fresco.', 'Star'],
        ],
      },
      compare: {
        eyebrow: 'Automatizado vs. de memoria', us: 'Automatizado', them: 'De memoria',
        rows: [
          ['Volver a reservar', 'Cada clienta, a tiempo', 'Cuando te acuerdas'],
          ['Espacios libres', 'Texto a la lista de espera', 'Publicado en redes, quizás'],
          ['Clientas alejadas', 'Mensaje para recuperarlas', 'Lo notas meses después'],
          ['Reseñas', 'Pedidas en cada visita', 'De vez en cuando'],
          ['Tu tiempo', 'Con tus clientas', 'En tu teléfono'],
        ],
      },
    },
  },

  QuizRealEstate: {
    en: {
      h1: ['The agent who answers first', 'usually gets the listing.'],
      stats: [['< 60 s', 'First reply to new leads'], ['24/7', 'Nights & weekends covered'], ['Months', 'Of nurture follow-up'], ['1', 'Pipeline for every lead']],
      problem: {
        eyebrow: 'The real cost of a slow reply',
        title: "Leads go cold while you're at a showing.",
        items: [
          ['New leads wait while you are busy', 'An inquiry at 8 p.m. or during a closing waits for you. The next agent on their list may answer first.'],
          ["Most leads aren't ready today", "Many leads are months out. Without steady follow-up, they forget who you are by the time they're ready to move."],
          ['Leads are scattered across apps', 'Portal leads, texts, emails and DMs live in different places, so some never get a reply at all.'],
        ],
      },
      caps: {
        title: 'Every lead hears from you first, and keeps hearing from you.',
        items: [
          ['Replies to new leads instantly', 'Every new inquiry gets a personal text and email right away, day or night.', 'Lightning'],
          ['Nurtures leads for months', 'Long-term follow-up keeps you in touch until they are ready to buy or sell.', 'ChatCircleText'],
          ['Pulls every lead into one place', 'Portal leads, forms and texts land in one pipeline with the full history.', 'Tray'],
          ['Stays in touch with past clients', 'Home anniversaries and check-ins keep your name in front of past clients for referrals.', 'House'],
        ],
      },
      compare: {
        eyebrow: 'Automated vs. by hand', us: 'Automated', them: 'By hand',
        rows: [
          ['First reply', 'Within a minute, 24/7', 'After the showing'],
          ['Follow-up', 'Months, on schedule', 'Until you get busy'],
          ['Lead sources', 'One pipeline', 'Several apps'],
          ['Past clients', 'Regular check-ins', 'A holiday card, maybe'],
          ['Your time', 'On appointments', 'On your inbox'],
        ],
      },
    },
    es: {
      h1: ['El agente que responde primero', 'casi siempre se queda con la propiedad.'],
      stats: [['< 60 s', 'Primera respuesta a prospectos'], ['24/7', 'Noches y fines de semana'], ['Meses', 'De seguimiento'], ['1', 'Pipeline para todos']],
      problem: {
        eyebrow: 'El costo real de responder tarde',
        title: 'Los prospectos se enfrían mientras enseñas una casa.',
        items: [
          ['Los prospectos nuevos esperan mientras estás ocupado', 'Una consulta a las 8 p.m. o durante un cierre te espera a ti. El siguiente agente de su lista puede responder primero.'],
          ['La mayoría no está lista hoy', 'Muchos prospectos se mudarán en meses. Sin seguimiento constante, olvidan quién eres cuando por fin están listos.'],
          ['Los prospectos están regados en varias apps', 'Portales, textos, correos y mensajes directos viven en lugares distintos, y algunos nunca reciben respuesta.'],
        ],
      },
      caps: {
        title: 'Cada prospecto sabe de ti primero, y sigue sabiendo de ti.',
        items: [
          ['Responde al instante a cada prospecto', 'Cada consulta nueva recibe un texto y un correo personal enseguida, de día o de noche.', 'Lightning'],
          ['Da seguimiento por meses', 'El seguimiento a largo plazo te mantiene en contacto hasta que estén listos para comprar o vender.', 'ChatCircleText'],
          ['Junta a todos los prospectos en un lugar', 'Portales, formularios y textos llegan a un solo pipeline con todo el historial.', 'Tray'],
          ['Mantiene el contacto con clientes anteriores', 'Aniversarios de compra y mensajes de seguimiento mantienen tu nombre presente para recibir referidos.', 'House'],
        ],
      },
      compare: {
        eyebrow: 'Automatizado vs. a mano', us: 'Automatizado', them: 'A mano',
        rows: [
          ['Primera respuesta', 'En menos de un minuto, 24/7', 'Después de la visita'],
          ['Seguimiento', 'Meses, a tiempo', 'Hasta que te ocupas'],
          ['Fuentes de prospectos', 'Un solo pipeline', 'Varias apps'],
          ['Clientes anteriores', 'Contacto regular', 'Una tarjeta en Navidad, quizás'],
          ['Tu tiempo', 'En citas', 'En tu bandeja de entrada'],
        ],
      },
    },
  },

  QuizVacationRental: {
    en: {
      h1: ['Stop paying platform fees', 'on guests who already love you.'],
      stats: [['24/7', 'Guest questions answered'], ['Auto', 'Check-in details sent'], ['Every stay', 'Asks for a review'], ['Direct', 'Rebooking invites']],
      problem: {
        eyebrow: 'The real cost of every booking',
        title: 'You earn the guest. The platform keeps the relationship.',
        items: [
          ['Fees come out of every stay', 'Even guests who already know and love your place book through the platform, and you pay for it every time.'],
          ['The same questions, every stay', 'Wi-Fi, parking, door codes, pool heat. Answering them by hand eats your evenings.'],
          ['Past guests never hear from you', "Once they check out, there's no easy way to invite them back to book direct next season."],
        ],
      },
      caps: {
        title: 'Guests looked after, and coming back to you directly.',
        items: [
          ['Answers the common questions', 'Check-in details, house rules and local tips go out automatically at the right moment.', 'ChatsCircle'],
          ['Sends every message on schedule', 'Pre-arrival, check-in, mid-stay and checkout messages run for every booking.', 'Clock'],
          ['Asks every guest for a review', 'A review request goes out after checkout, while the stay is still fresh.', 'Star'],
          ['Invites past guests to book direct', 'Past guests get an invitation to book their next trip directly with you.', 'Key'],
        ],
      },
      compare: {
        eyebrow: 'Automated vs. by hand', us: 'Automated', them: 'By hand',
        rows: [
          ['Guest questions', 'Answered automatically', 'Texted one by one'],
          ['Check-in info', 'Sent on schedule', 'Sent when you remember'],
          ['Reviews', 'Asked after every stay', 'Hit or miss'],
          ['Repeat guests', 'Invited to book direct', 'Rebook on the platform'],
          ['Your evenings', 'Yours again', 'On your phone'],
        ],
      },
    },
    es: {
      h1: ['Deja de pagar comisiones', 'por huéspedes que ya te quieren.'],
      stats: [['24/7', 'Preguntas respondidas'], ['Auto', 'Datos de llegada enviados'], ['Cada estadía', 'Pide una reseña'], ['Directo', 'Invitaciones para volver']],
      problem: {
        eyebrow: 'El costo real de cada reserva',
        title: 'Tú te ganas al huésped. La plataforma se queda con la relación.',
        items: [
          ['Las comisiones salen de cada estadía', 'Hasta los huéspedes que ya conocen y aman tu propiedad reservan por la plataforma, y lo pagas cada vez.'],
          ['Las mismas preguntas en cada estadía', 'Wi-Fi, estacionamiento, códigos de la puerta, la piscina climatizada. Contestarlas a mano se come tus noches.'],
          ['Los huéspedes anteriores no vuelven a saber de ti', 'Después de la salida, no hay una forma fácil de invitarlos a reservar directo la próxima temporada.'],
        ],
      },
      caps: {
        title: 'Huéspedes bien atendidos, que vuelven directo contigo.',
        items: [
          ['Responde las preguntas comunes', 'Datos de llegada, reglas de la casa y recomendaciones locales salen automáticamente en el momento justo.', 'ChatsCircle'],
          ['Envía cada mensaje a tiempo', 'Mensajes antes de llegar, al llegar, durante la estadía y a la salida, en cada reserva.', 'Clock'],
          ['Pide una reseña a cada huésped', 'Una solicitud de reseña sale después de la salida, mientras la estadía está fresca.', 'Star'],
          ['Invita a reservar directo', 'Los huéspedes anteriores reciben una invitación para reservar su próximo viaje directamente contigo.', 'Key'],
        ],
      },
      compare: {
        eyebrow: 'Automatizado vs. a mano', us: 'Automatizado', them: 'A mano',
        rows: [
          ['Preguntas de huéspedes', 'Respondidas automáticamente', 'Una por una por texto'],
          ['Datos de llegada', 'Enviados a tiempo', 'Cuando te acuerdas'],
          ['Reseñas', 'Pedidas en cada estadía', 'A veces sí, a veces no'],
          ['Huéspedes que repiten', 'Invitados a reservar directo', 'Reservan en la plataforma'],
          ['Tus noches', 'Tuyas otra vez', 'En tu teléfono'],
        ],
      },
    },
  },
};
