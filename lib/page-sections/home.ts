import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { localize, type PageSectionResult } from "@/lib/page-sections";
import { ctaBandContentSchema, type CtaBandContent } from "./shared";

const labelTuple = z.tuple([z.string().min(1), z.string().min(1)]);

// --- Hero ---------------------------------------------------------------

export const heroContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  photo: z.string().min(1),
  badgeNumber: z.string().min(1),
  badgeLabel: labelTuple,
});
export type HeroContent = z.infer<typeof heroContentSchema>;

export const heroDefault: HeroContent = {
  eyebrow: "ODONTOLOGÍA ESTÉTICA · DR. CABERO",
  title: "Tu sonrisa, rediseñada con precisión",
  subtitle: "Diagnóstico digital y planificación milimétrica, con un enfoque estético pensado para tu sonrisa.",
  photo: "/hero-team.jpg?dx=47&dy=39&mx=47&my=39",
  badgeNumber: "3",
  badgeLabel: ["especialidades", "certificadas"],
};

// --- Especialidades -------------------------------------------------------
// treatmentIds: [] is a sentinel meaning "no admin selection yet" — the public
// component falls back to the first 4 visible treatments by `order` in that
// case, rather than this file hardcoding treatment IDs that don't exist yet
// at import time (they're created by the seed script, not known statically).

export const especialidadesContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  treatmentIds: z.array(z.string()).min(2).max(4),
});
export type EspecialidadesContent = z.infer<typeof especialidadesContentSchema>;

export const especialidadesDefault: EspecialidadesContent = {
  eyebrow: "ESPECIALIDADES",
  title: "Un equipo, distintas especialidades",
  subtitle: "Cada área tiene un especialista dedicado, coordinados bajo el mismo estándar de precisión del Dr. Cabero.",
  // Intentionally invalid against the schema's min(2) — this exact object is only
  // ever used as a pre-validated fallback (see getHomeSections below), never
  // parsed, so the empty-array sentinel above still applies.
  treatmentIds: [],
};

// --- Casos de éxito (home teaser) -----------------------------------------

export const casosDeExitoContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
});
export type CasosDeExitoContent = z.infer<typeof casosDeExitoContentSchema>;

export const casosDeExitoDefault: CasosDeExitoContent = {
  eyebrow: "CASOS DE ÉXITO",
  title: "Casos reales de nuestros pacientes",
};

// --- Video section ----------------------------------------------------

const statSchema = z.object({
  value: z.string().min(1),
  label: labelTuple,
});

export const videoSectionContentSchema = z.object({
  heading: z.string().min(1),
  eyebrowDesktop: z.string().min(1),
  mediaType: z.enum(["image", "video"]),
  backgroundPhoto: z.string().min(1),
  videoUrl: z.string().nullable(),
  stats: z.tuple([statSchema, statSchema, statSchema]),
  locationLine1: z.string().min(1),
  locationLine2: z.string().min(1),
});
export type VideoSectionContent = z.infer<typeof videoSectionContentSchema>;

export const videoSectionDefault: VideoSectionContent = {
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
};

// --- Cómo trabajamos --------------------------------------------------

const stepSchema = z.object({
  num: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
  photo: z.string().min(1),
  alt: z.string().min(1),
});

export const howItWorksContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  steps: z.tuple([stepSchema, stepSchema, stepSchema, stepSchema]),
});
export type HowItWorksContent = z.infer<typeof howItWorksContentSchema>;

export const howItWorksDefault: HowItWorksContent = {
  eyebrow: "CÓMO TRABAJAMOS",
  title: "Cómo trabajamos, paso a paso",
  steps: [
    {
      num: "01",
      title: "Diagnóstico",
      desc: "Escaneo y evaluación clínica completa",
      photo: "/hero-team.jpg",
      alt: "Equipo Kabero durante una evaluación clínica",
    },
    {
      num: "02",
      title: "Diseño",
      desc: "Planificación del resultado antes de empezar",
      photo: "/treatments/about-estetica/3.jpg",
      alt: "Selección de tono y diseño de carillas dentales",
    },
    {
      num: "03",
      title: "Tratamiento",
      desc: "Ejecución con tecnología de precisión",
      photo: "/treatments/about-estetica/4.jpg",
      alt: "Elaboración de prótesis dental de precisión",
    },
    {
      num: "04",
      title: "Seguimiento",
      desc: "Control post-tratamiento incluido",
      photo: "/treatments/about-estetica/5.jpg",
      alt: "Paciente satisfecha revisando su resultado",
    },
  ],
};

// --- Contacto (intro text only — map/whatsapp/social live in SiteSettings) --

export const contactoContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
});
export type ContactoContent = z.infer<typeof contactoContentSchema>;

export const contactoDefault: ContactoContent = {
  eyebrow: "VISITANOS",
  title: "Te esperamos en Cochabamba",
};

// --- CTA band (home placement) -----------------------------------------

export const homeCtaBandDefault: CtaBandContent = {
  headline: "¿Empezamos con tu diagnóstico?",
  subtitle: "Agendá una consulta y te decimos, con un plan claro, qué necesita tu sonrisa.",
  buttonLabel: "Agendar por WhatsApp",
  buttonHref: "https://wa.me/59171796997",
  backgroundImage: null,
  backgroundFrom: null,
  backgroundTo: null,
};

// --- Batched read for the whole Home page --------------------------------

export interface HomeSections {
  hero: PageSectionResult<HeroContent>;
  especialidades: PageSectionResult<EspecialidadesContent>;
  casosDeExito: PageSectionResult<CasosDeExitoContent>;
  videoSection: PageSectionResult<VideoSectionContent>;
  howItWorks: PageSectionResult<HowItWorksContent>;
  contacto: PageSectionResult<ContactoContent>;
  ctaBand: PageSectionResult<CtaBandContent>;
}

export async function getHomeSections(locale: string = "es"): Promise<HomeSections> {
  const rows = await prisma.pageSection.findMany({ where: { page: "home" } });
  const byKey = new Map(rows.map((r) => [r.key, r]));

  function parse<T>(key: string, schema: z.ZodType<T>, fallback: T): PageSectionResult<T> {
    const row = byKey.get(key);
    if (!row) return { content: fallback, visible: true };
    const parsed = schema.safeParse(row.content);
    const content = parsed.success ? parsed.data : fallback;
    return { content: localize(content, row.translations, locale), visible: row.visible };
  }

  return {
    hero: parse("hero", heroContentSchema, heroDefault),
    especialidades: parse("especialidades-intro", especialidadesContentSchema, especialidadesDefault),
    casosDeExito: parse("casos-de-exito-intro", casosDeExitoContentSchema, casosDeExitoDefault),
    videoSection: parse("video-section", videoSectionContentSchema, videoSectionDefault),
    howItWorks: parse("how-it-works", howItWorksContentSchema, howItWorksDefault),
    contacto: parse("contacto-intro", contactoContentSchema, contactoDefault),
    ctaBand: parse("cta-band", ctaBandContentSchema, homeCtaBandDefault),
  };
}
