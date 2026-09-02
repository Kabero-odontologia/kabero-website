export interface Treatment {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  gradient: string;
  photo?: string;
  heroPhoto?: string;
  heroFocalPosition?: string;
  teamPhoto?: string;
  gallery?: string[];
  whatWeOffer: { title: string; desc: string }[];
}

export const treatments: Treatment[] = [
  {
    slug: "estetica-y-rehabilitacion",
    title: "Estética y rehabilitación",
    shortDesc: "Diseño de sonrisa y rehabilitación funcional",
    photo: "/treatments/estetica-y-rehabilitacion.jpg",
    teamPhoto: "/team/estetica-y-rehabilitacion.jpg",
    heroPhoto: "/treatments/hero-estetica-y-rehabilitacion.jpg",
    gallery: [
      "/treatments/about-estetica/1-large.jpg",
      "/treatments/about-estetica/2.jpg",
      "/treatments/about-estetica/3.jpg",
      "/treatments/about-estetica/4.jpg",
      "/treatments/about-estetica/5.jpg",
    ],
    fullDesc:
      "Combinamos diagnóstico digital con técnicas de rehabilitación funcional para devolver forma, color y alineación a tu sonrisa, sin perder naturalidad. Cada plan se diseña específicamente para tu rostro.",
    gradient: "bg-gradient-to-br from-orange-3 to-orange-6",
    whatWeOffer: [
      { title: "Diagnóstico digital", desc: "Escaneo y planificación antes de empezar" },
      { title: "Diseño de sonrisa", desc: "Simulación del resultado esperado" },
      { title: "Rehabilitación funcional", desc: "Corrección de mordida y estructura" },
      { title: "Seguimiento incluido", desc: "Controles post-tratamiento sin costo extra" },
    ],
  },
  {
    slug: "ortodoncia",
    title: "Ortodoncia",
    shortDesc: "Alineación dental con seguimiento digital",
    photo: "/treatments/ortodoncia.jpg",
    teamPhoto: "/team/ortodoncia.jpg",
    fullDesc:
      "Tratamientos de ortodoncia con planificación digital y controles periódicos para acompañar cada etapa del movimiento dental.",
    gradient: "bg-gradient-to-br from-black-6 to-black-9",
    whatWeOffer: [
      { title: "Evaluación inicial", desc: "Diagnóstico de la oclusión y el movimiento necesario" },
      { title: "Planificación digital", desc: "Simulación del recorrido del tratamiento" },
      { title: "Controles periódicos", desc: "Ajustes y seguimiento en cada etapa" },
      { title: "Retención incluida", desc: "Cuidado del resultado final" },
    ],
  },
  {
    slug: "endodoncia",
    title: "Endodoncia",
    shortDesc: "Tratamiento de conducto especializado",
    photo: "/treatments/endodoncia.jpg",
    heroFocalPosition: "50% 24%",
    teamPhoto: "/team/endodoncia.jpg",
    fullDesc:
      "Tratamientos de conducto con tecnología de precisión para conservar la pieza dental y evitar procedimientos más invasivos.",
    gradient: "bg-gradient-to-br from-green-4 to-green-8",
    whatWeOffer: [
      { title: "Diagnóstico preciso", desc: "Evaluación clínica y radiográfica" },
      { title: "Tratamiento de conducto", desc: "Con tecnología de precisión" },
      { title: "Control del dolor", desc: "Protocolo pensado para tu comodidad" },
      { title: "Seguimiento incluido", desc: "Revisión posterior al procedimiento" },
    ],
  },
  {
    slug: "odontopediatria",
    title: "Odontopediatría",
    shortDesc: "Atención dental para niños y adolescentes",
    photo: "/treatments/odontopediatria.jpg",
    heroFocalPosition: "50% 29%",
    teamPhoto: "/team/odontopediatria.jpg",
    fullDesc:
      "Atención pensada para las infancias, con un enfoque cercano que prioriza que cada visita sea una buena experiencia.",
    gradient: "bg-gradient-to-br from-orange-2 to-orange-5",
    whatWeOffer: [
      { title: "Primera consulta amigable", desc: "Pensada para que el niño se sienta cómodo" },
      { title: "Prevención", desc: "Controles y cuidado temprano" },
      { title: "Tratamientos específicos", desc: "Adaptados a cada edad" },
      { title: "Acompañamiento a la familia", desc: "Guía sobre hábitos de cuidado en casa" },
    ],
  },
  {
    slug: "cirugia-e-implantologia",
    title: "Cirugía e implantología",
    shortDesc: "Implantes y cirugía oral avanzada",
    photo: "/treatments/cirugia-e-implantologia.jpg",
    teamPhoto: "/team/cirugia-e-implantologia.jpg",
    fullDesc:
      "Cirugía oral e implantes dentales con planificación digital, para reponer piezas perdidas con resultados funcionales y estéticos.",
    gradient: "bg-gradient-to-br from-black-8 to-black-11",
    whatWeOffer: [
      { title: "Planificación digital", desc: "Estudio previo de la zona a tratar" },
      { title: "Colocación de implantes", desc: "Con tecnología de precisión" },
      { title: "Rehabilitación protésica", desc: "Reposición funcional y estética" },
      { title: "Seguimiento post-quirúrgico", desc: "Controles incluidos" },
    ],
  },
  {
    slug: "periodoncia",
    title: "Periodoncia",
    shortDesc: "Salud de encías y tejido de soporte",
    photo: "/treatments/periodoncia.jpg",
    teamPhoto: "/team/periodoncia.jpg",
    fullDesc:
      "Tratamiento y prevención de enfermedades de las encías, para cuidar la base que sostiene toda tu sonrisa.",
    gradient: "bg-gradient-to-br from-green-3 to-green-7",
    whatWeOffer: [
      { title: "Diagnóstico periodontal", desc: "Evaluación de encías y tejido de soporte" },
      { title: "Limpieza profunda", desc: "Tratamiento de base según cada caso" },
      { title: "Control de la enfermedad", desc: "Seguimiento continuo" },
      { title: "Mantenimiento", desc: "Controles periódicos incluidos" },
    ],
  },
];

export const faqs = [
  {
    question: "¿Necesito una evaluación antes de elegir tratamiento?",
    answer:
      "Sí, siempre arrancamos con un diagnóstico digital para armar un plan a tu medida antes de cualquier procedimiento.",
  },
  { question: "¿Atienden urgencias dentales?", answer: "Sí, contactanos por WhatsApp y coordinamos según disponibilidad." },
  { question: "¿Los tratamientos incluyen seguimiento?", answer: "Sí, todos nuestros tratamientos incluyen controles posteriores." },
  { question: "¿Atienden niños?", answer: "Sí, contamos con especialidad de Odontopediatría." },
  { question: "¿Cómo agendo una consulta?", answer: "Escribinos por WhatsApp y coordinamos el horario que mejor te convenga." },
];
