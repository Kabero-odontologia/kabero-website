import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// ---- Treatments (verbatim from lib/treatments.ts) ----
const treatments = [
  {
    slug: "estetica-y-rehabilitacion",
    title: "Estética y rehabilitación",
    shortDesc: "Diseño de sonrisa y rehabilitación funcional",
    fullDesc:
      "Combinamos diagnóstico digital con técnicas de rehabilitación funcional para devolver forma, color y alineación a tu sonrisa, sin perder naturalidad. Cada plan se diseña específicamente para tu rostro.",
    gradient: "bg-gradient-to-br from-orange-3 to-orange-6",
    photo: "/treatments/estetica-y-rehabilitacion.jpg",
    heroPhoto: "/treatments/hero-estetica-y-rehabilitacion.jpg",
    teamPhoto: "/team/estetica-y-rehabilitacion.jpg",
    gallery: [
      "/treatments/about-estetica/1-large.jpg",
      "/treatments/about-estetica/2.jpg",
      "/treatments/about-estetica/3.jpg",
      "/treatments/about-estetica/4.jpg",
      "/treatments/about-estetica/5.jpg",
    ],
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
    fullDesc:
      "Tratamientos de ortodoncia con planificación digital y controles periódicos para acompañar cada etapa del movimiento dental.",
    gradient: "bg-gradient-to-br from-black-6 to-black-9",
    photo: "/treatments/ortodoncia.jpg",
    teamPhoto: "/team/ortodoncia.jpg",
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
    fullDesc:
      "Tratamientos de conducto con tecnología de precisión para conservar la pieza dental y evitar procedimientos más invasivos.",
    gradient: "bg-gradient-to-br from-green-4 to-green-8",
    photo: "/treatments/endodoncia.jpg",
    heroFocalPosition: "50% 24%",
    teamPhoto: "/team/endodoncia.jpg",
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
    fullDesc:
      "Atención pensada para las infancias, con un enfoque cercano que prioriza que cada visita sea una buena experiencia.",
    gradient: "bg-gradient-to-br from-orange-2 to-orange-5",
    photo: "/treatments/odontopediatria.jpg",
    heroFocalPosition: "50% 29%",
    teamPhoto: "/team/odontopediatria.jpg",
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
    fullDesc:
      "Cirugía oral e implantes dentales con planificación digital, para reponer piezas perdidas con resultados funcionales y estéticos.",
    gradient: "bg-gradient-to-br from-black-8 to-black-11",
    photo: "/treatments/cirugia-e-implantologia.jpg",
    teamPhoto: "/team/cirugia-e-implantologia.jpg",
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
    fullDesc:
      "Tratamiento y prevención de enfermedades de las encías, para cuidar la base que sostiene toda tu sonrisa.",
    gradient: "bg-gradient-to-br from-green-3 to-green-7",
    photo: "/treatments/periodoncia.jpg",
    teamPhoto: "/team/periodoncia.jpg",
    whatWeOffer: [
      { title: "Diagnóstico periodontal", desc: "Evaluación de encías y tejido de soporte" },
      { title: "Limpieza profunda", desc: "Tratamiento de base según cada caso" },
      { title: "Control de la enfermedad", desc: "Seguimiento continuo" },
      { title: "Mantenimiento", desc: "Controles periódicos incluidos" },
    ],
  },
];

const faqs = [
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

// weekday keys match Intl.DateTimeFormat(...).formatToParts() output used elsewhere in the app
const businessHours: { weekday: string; isClosed: boolean; ranges: { start: string; end: string }[] }[] = [
  { weekday: "Mon", isClosed: false, ranges: [{ start: "08:00", end: "16:00" }] },
  { weekday: "Tue", isClosed: false, ranges: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "19:00" }] },
  { weekday: "Wed", isClosed: false, ranges: [{ start: "08:00", end: "16:00" }] },
  { weekday: "Thu", isClosed: false, ranges: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "19:00" }] },
  { weekday: "Fri", isClosed: false, ranges: [{ start: "08:00", end: "16:00" }] },
  { weekday: "Sat", isClosed: false, ranges: [{ start: "09:00", end: "13:00" }] },
  { weekday: "Sun", isClosed: true, ranges: [] },
];

const siteSettings = {
  id: "singleton",
  whatsappNumber: "+59171796997",
  address: "Cochabamba, Bolivia",
  mapsQuery: "Kabero Odontología Estética, Cochabamba, Bolivia",
  mapsLink: "https://maps.app.goo.gl/6iPZDSWXkv3w5TPW9",
  facebookUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  seoTitle: "Kabero — Odontología estética en Cochabamba",
  seoDescription: "Diagnóstico digital y planificación milimétrica, con un enfoque estético pensado para tu cara.",
};

// ---- Generic per-page content blocks ----
const pageSections: { page: string; key: string; order: number; content: unknown }[] = [
  {
    page: "home",
    key: "hero",
    order: 0,
    content: {
      eyebrow: "ODONTOLOGÍA ESTÉTICA · DR. CABERO",
      title: "Tu sonrisa, rediseñada con precisión",
      subtitle: "Diagnóstico digital y planificación milimétrica, con un enfoque estético pensado para tu sonrisa.",
      photo: "/hero-team.jpg",
      badgeNumber: "3",
      badgeLabel: ["especialidades", "certificadas"],
    },
  },
  {
    page: "home",
    key: "especialidades-intro",
    order: 1,
    content: {
      eyebrow: "ESPECIALIDADES",
      title: "Un equipo, distintas especialidades",
      subtitle: "Cada área tiene un especialista dedicado, coordinados bajo el mismo estándar de precisión del Dr. Cabero.",
      // treatmentIds filled in main(), after treatments exist — see below.
      treatmentIds: [] as string[],
    },
  },
  {
    page: "home",
    key: "casos-de-exito-intro",
    order: 2,
    content: {
      eyebrow: "CASOS DE ÉXITO",
      title: "Casos reales de nuestros pacientes",
      linkLabel: "Ver todos los casos →",
    },
  },
  {
    page: "home",
    key: "video-section",
    order: 3,
    content: {
      heading: "Conocé a nuestro equipo y la clínica por dentro",
      eyebrowDesktop: "Mirá el video",
      mediaType: "image",
      backgroundPhoto: "/video-section-bg.jpg",
      videoUrl: null,
      stats: [
        { value: "3+", label: ["Especialidades", "certificadas"] },
        { value: "6", label: ["Áreas de", "tratamiento"] },
        { value: "100%", label: ["Atención", "personalizada"] },
      ],
      locationLine1: "Cochabamba",
      locationLine2: "Bolivia",
    },
  },
  {
    page: "home",
    key: "how-it-works",
    order: 4,
    content: {
      eyebrow: "CÓMO TRABAJAMOS",
      title: "Cómo trabajamos, paso a paso",
      steps: [
        { num: "01", title: "Diagnóstico", desc: "Escaneo y evaluación clínica completa", photo: "/hero-team.jpg", alt: "Equipo Kabero durante una evaluación clínica" },
        { num: "02", title: "Diseño", desc: "Planificación del resultado antes de empezar", photo: "/treatments/about-estetica/3.jpg", alt: "Selección de tono y diseño de carillas dentales" },
        { num: "03", title: "Tratamiento", desc: "Ejecución con tecnología de precisión", photo: "/treatments/about-estetica/4.jpg", alt: "Elaboración de prótesis dental de precisión" },
        { num: "04", title: "Seguimiento", desc: "Control post-tratamiento incluido", photo: "/treatments/about-estetica/5.jpg", alt: "Paciente satisfecha revisando su resultado" },
      ],
    },
  },
  {
    page: "home",
    key: "contacto-intro",
    order: 5,
    content: { eyebrow: "VISITANOS", title: "Te esperamos en Cochabamba" },
  },
  {
    page: "home",
    key: "cta-band",
    order: 6,
    content: {
      headline: "¿Empezamos con tu diagnóstico?",
      subtitle: "Agendá una consulta y te decimos, con un plan claro, qué necesita tu sonrisa.",
      buttonLabel: "Agendar por WhatsApp",
      buttonHref: "https://wa.me/59171796997",
      backgroundImage: null,
      backgroundFrom: null,
      backgroundTo: null,
    },
  },
  {
    page: "tratamientos",
    key: "centered-hero",
    order: 0,
    content: {
      eyebrow: "TRATAMIENTOS",
      title: "Todos los tratamientos que ofrecemos",
      subtitle: "Sea una consulta de rutina o un tratamiento completo, tenemos al especialista indicado.",
    },
  },
  {
    page: "tratamientos",
    key: "cta-band",
    order: 1,
    content: {
      headline: "¿No estás seguro qué\ntratamiento necesitás?",
      subtitle: "Contanos qué te preocupa y te orientamos hacia el especialista correcto — sin compromiso.",
      buttonLabel: "Consultar ahora",
      buttonHref: "https://wa.me/59171796997",
      photo: "/dr-cabero-cta.png",
    },
  },
  {
    page: "tratamiento-detail",
    key: "casos-reales-intro",
    order: 0,
    content: { eyebrow: "CASOS REALES", title: "Resultados de este tratamiento", linkLabel: "Ver más casos →" },
  },
  {
    page: "tratamiento-detail",
    key: "cta-band",
    order: 1,
    content: {
      headline: "¿Lista para dar el siguiente paso?",
      subtitle: "Agendá tu diagnóstico y salí con un plan claro para tu tratamiento.",
      buttonLabel: "Agendar por WhatsApp",
      buttonHref: "https://wa.me/59171796997",
    },
  },
  {
    page: "tratamiento-detail",
    key: "related-intro",
    order: 2,
    content: { eyebrow: "MÁS TRATAMIENTOS", title: "Otros tratamientos relacionados", linkLabel: "Ver todos →" },
  },
  {
    page: "sobre-nosotros",
    key: "centered-hero",
    order: 0,
    content: {
      eyebrow: "SOBRE NOSOTROS",
      title: "Así trabajamos en Kabero",
      subtitle: "Conocé al equipo detrás de Kabero y cómo trabajamos en cada tratamiento.",
    },
  },
  {
    page: "sobre-nosotros",
    key: "historia",
    order: 1,
    content: {
      eyebrow: "NUESTRA HISTORIA",
      title: "Cómo nació Kabero",
      body:
        "Kabero nace de la idea de que la odontología estética necesita método: cada tratamiento arranca con un diagnóstico digital y un plan diseñado para vos. El Dr. Kevin Cabero formó su criterio clínico entre Bolivia y Brasil, combinando rehabilitación oral, cirugía e implantología con un enfoque estético real.",
      photo: "/sobre-nosotros/historia.jpg",
    },
  },
  {
    page: "sobre-nosotros",
    key: "fundador",
    order: 2,
    content: {
      eyebrow: "NUESTRO EQUIPO",
      title: "Fundador",
      name: "Dr. Kevin Cabero",
      role: "Odontología estética · Fundador de Kabero",
      bio: "Especialista en Rehabilitación Oral y Estética (Bolivia), con formación en Cirugía e Implantología y Dentística (Brasil). Coordina un equipo de especialistas por área para que cada tratamiento tenga el criterio correcto.",
      photo: "/dr-cabero-cta.png",
      tags: ["Rehabilitación Oral y Estética", "Cirugía e Implantología", "Dentística"],
    },
  },
  {
    page: "sobre-nosotros",
    key: "equipo-intro",
    order: 3,
    content: {
      eyebrow: "NUESTRO EQUIPO",
      title: "Conocé a quienes te van a atender",
      subtitle: "Profesionales dedicados a resultados reales para cada paciente.",
    },
  },
  {
    page: "sobre-nosotros",
    key: "diferenciales",
    order: 4,
    content: {
      title: "Por qué elegir Kabero",
      items: [
        { title: "Diagnóstico digital", desc: "Escaneo y planificación antes de cualquier procedimiento" },
        { title: "Enfoque estético", desc: "Simulamos el resultado antes de empezar el tratamiento" },
        { title: "Seguimiento cercano", desc: "Control post-tratamiento incluido en el plan" },
        { title: "Bioseguridad certificada", desc: "Protocolos verificados en cada consulta" },
      ],
    },
  },
  {
    page: "sobre-nosotros",
    key: "cta-band",
    order: 5,
    content: {
      headline: "¿Charlamos sobre tu caso?",
      subtitle: "Contanos qué te gustaría cambiar y te orientamos sin compromiso.",
      buttonLabel: "Agendar consulta",
      buttonHref: "https://wa.me/59171796997",
    },
  },
  {
    page: "casos-reales",
    key: "centered-hero",
    order: 0,
    content: {
      eyebrow: "CASOS REALES",
      title: "Antes y después de pacientes reales",
      subtitle: "Cada caso pasó por el mismo proceso de diagnóstico y diseño — así se ven los resultados.",
    },
  },
  {
    page: "casos-reales",
    key: "cta-band",
    order: 1,
    content: {
      headline: "¿Querés resultados así?",
      subtitle: "Agendá tu diagnóstico y arrancamos con tu plan.",
      buttonLabel: "Agendar consulta",
      buttonHref: "https://wa.me/59171796997",
    },
  },
  {
    page: "global",
    key: "header",
    order: 0,
    content: {
      logo: "/logo.png",
      navLinks: [
        { label: "Home", href: "/" },
        { label: "Tratamientos", href: "/tratamientos" },
        { label: "Sobre nosotros", href: "/sobre-nosotros" },
        { label: "Casos reales", href: "/casos-reales" },
      ],
      ctaLabel: "Agendar consulta",
      ctaHref: "https://wa.me/59171796997",
    },
  },
  {
    page: "global",
    key: "footer",
    order: 1,
    content: {
      logo: "/logo.png",
      addressLine1: "Odontología estética",
      addressLine2: "Cochabamba, Bolivia",
      whatsappLabel: "WhatsApp +591 71796997",
      scheduleLinkLabel: "Lun–Sáb, ver horario",
      brandName: "Clínica Kabero",
    },
  },
];

async function main() {
  console.log("Seeding...");

  await prisma.treatment.deleteMany();
  for (const [i, t] of treatments.entries()) {
    const { gallery, whatWeOffer, ...rest } = t;
    await prisma.treatment.create({
      data: {
        ...rest,
        order: i,
        gallery: { create: (gallery ?? []).map((url, order) => ({ url, order })) },
        offers: { create: whatWeOffer.map((o, order) => ({ ...o, order })) },
      },
    });
  }
  console.log(`  Treatments: ${treatments.length}`);

  // Real, freshly-created treatment IDs to feature on the home page's
  // "Especialidades" section by default (first 4 by order) — can't be known
  // statically since cuid()s are generated at create time.
  const featuredTreatments = await prisma.treatment.findMany({ orderBy: { order: "asc" }, take: 4 });
  const especialidadesSection = pageSections.find(
    (s) => s.page === "home" && s.key === "especialidades-intro"
  );
  if (especialidadesSection) {
    (especialidadesSection.content as { treatmentIds: string[] }).treatmentIds = featuredTreatments.map(
      (t) => t.id
    );
  }

  await prisma.fAQ.deleteMany();
  for (const [i, f] of faqs.entries()) {
    await prisma.fAQ.create({ data: { ...f, order: i } });
  }
  console.log(`  FAQs: ${faqs.length}`);

  // Team grid currently just mirrors treatment title/photo — seed placeholder
  // names so the admin owner sees exactly what's live today, ready to personalize.
  await prisma.teamMember.deleteMany();
  for (const [i, t] of treatments.entries()) {
    await prisma.teamMember.create({
      data: { name: t.title, specialty: "Especialista certificado", photo: t.teamPhoto, order: i },
    });
  }
  console.log(`  Team members: ${treatments.length}`);

  await prisma.businessHours.deleteMany();
  for (const h of businessHours) {
    await prisma.businessHours.create({ data: h });
  }
  console.log(`  Business hours: ${businessHours.length}`);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: siteSettings,
    create: siteSettings,
  });
  console.log("  Site settings: 1");

  for (const s of pageSections) {
    await prisma.pageSection.upsert({
      where: { page_key: { page: s.page, key: s.key } },
      update: { order: s.order, content: s.content as object },
      create: { page: s.page, key: s.key, order: s.order, content: s.content as object },
    });
  }
  console.log(`  Page sections: ${pageSections.length}`);

  // CaseStudy intentionally starts empty — see plan notes (no fake before/after
  // photos on a live clinic site, even as placeholders).
  const caseCount = await prisma.caseStudy.count();
  console.log(`  Case studies: ${caseCount} (starts empty by design)`);

  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    const username = "admin";
    const password = randomBytes(9).toString("base64url");
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, passwordHash } });
    console.log("\n  Admin user created:");
    console.log(`    username: ${username}`);
    console.log(`    password: ${password}`);
    console.log("  (save this now — it will not be shown again by the seed script)");
  } else {
    console.log("  Admin user already exists, skipped.");
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
