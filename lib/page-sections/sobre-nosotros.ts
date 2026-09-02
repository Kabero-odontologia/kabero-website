import "server-only";
import { z } from "zod";
import type { CenteredHeroContent } from "./shared";

export const sobreNosotrosEncabezadoDefault: CenteredHeroContent = {
  eyebrow: "SOBRE NOSOTROS",
  title: "Así trabajamos en Kabero",
  subtitle: "Conocé al equipo detrás de Kabero y cómo trabajamos en cada tratamiento.",
};

// --- Nuestra historia ----------------------------------------------------

export const historiaContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  photo: z.string().min(1),
});
export type HistoriaContent = z.infer<typeof historiaContentSchema>;

export const historiaDefault: HistoriaContent = {
  eyebrow: "NUESTRA HISTORIA",
  title: "Cómo nació Kabero",
  description:
    "Kabero nace de la idea de que la odontología estética necesita método: cada tratamiento arranca con un diagnóstico digital y un plan diseñado para vos. El Dr. Kevin Cabero formó su criterio clínico entre Bolivia y Brasil, combinando rehabilitación oral, cirugía e implantología con un enfoque estético real.",
  photo: "/sobre-nosotros/historia.jpg",
};

// --- Fundador --------------------------------------------------------------

export const fundadorContentSchema = z.object({
  eyebrow: z.string().min(1),
  sectionTitle: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  photo: z.string().min(1),
});
export type FundadorContent = z.infer<typeof fundadorContentSchema>;

export const fundadorDefault: FundadorContent = {
  eyebrow: "NUESTRO EQUIPO",
  sectionTitle: "Fundador",
  name: "Dr. Kevin Cabero",
  role: "Odontología estética · Fundador de Kabero",
  bio: "Especialista en Rehabilitación Oral y Estética (Bolivia), con formación en Cirugía e Implantología y Dentística (Brasil). Coordina un equipo de especialistas por área para que cada tratamiento tenga el criterio correcto.",
  tags: ["Rehabilitación Oral y Estética", "Cirugía e Implantología", "Dentística"],
  photo: "/dr-cabero-cta.png",
};

// --- Equipo (intro text only — the grid itself comes from TeamMember) -----

export const equipoIntroContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});
export type EquipoIntroContent = z.infer<typeof equipoIntroContentSchema>;

export const equipoIntroDefault: EquipoIntroContent = {
  eyebrow: "NUESTRO EQUIPO",
  title: "Conocé a quienes te van a atender",
  subtitle: "Profesionales dedicados a resultados reales para cada paciente.",
};

// --- Nuestro laboratorio (new) ---------------------------------------------

export const laboratorioContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  photo: z.string().min(1),
});
export type LaboratorioContent = z.infer<typeof laboratorioContentSchema>;

export const laboratorioDefault: LaboratorioContent = {
  eyebrow: "NUESTRO LABORATORIO",
  title: "Precisión de principio a fin",
  description:
    "Trabajamos con tecnología de escaneo y diseño digital propia, para que cada prótesis, carilla o alineador se fabrique con el mismo estándar de detalle que tu diagnóstico inicial.",
  photo: "/hero-team.jpg",
};

// --- Diferenciales -----------------------------------------------------

const differentiatorSchema = z.object({ title: z.string().min(1), desc: z.string().min(1) });

export const diferencialesContentSchema = z.object({
  title: z.string().min(1),
  items: z.array(differentiatorSchema).min(1),
});
export type DiferencialesContent = z.infer<typeof diferencialesContentSchema>;

export const diferencialesDefault: DiferencialesContent = {
  title: "Por qué elegir Kabero",
  items: [
    { title: "Diagnóstico digital", desc: "Escaneo y planificación antes de cualquier procedimiento" },
    { title: "Enfoque estético", desc: "Simulamos el resultado antes de empezar el tratamiento" },
    { title: "Seguimiento cercano", desc: "Control post-tratamiento incluido en el plan" },
    { title: "Bioseguridad certificada", desc: "Protocolos verificados en cada consulta" },
  ],
};

// --- Banner final (uses the shared plain CtaBandContent shape) -------------

export const sobreNosotrosCtaBandDefault = {
  headline: "¿Charlamos sobre tu caso?",
  subtitle: "Contanos qué te gustaría cambiar y te orientamos sin compromiso.",
  buttonLabel: "Agendar consulta",
  buttonHref: "https://wa.me/59171796997",
  backgroundImage: null,
  backgroundFrom: null,
  backgroundTo: null,
};
