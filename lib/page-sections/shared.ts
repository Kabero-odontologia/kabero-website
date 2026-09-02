import { z } from "zod";

// Reused by every CTABand placement across pages (Home now; Tratamientos, Sobre
// Nosotros, Casos Reales in a later phase). New background fields are optional so
// placements not yet migrated to admin control keep using CTABand's hardcoded
// default gradient.
export const ctaBandContentSchema = z.object({
  headline: z.string().min(1),
  subtitle: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
  backgroundImage: z.string().nullable().default(null),
  backgroundFrom: z.string().nullable().default(null),
  backgroundTo: z.string().nullable().default(null),
});

export type CtaBandContent = z.infer<typeof ctaBandContentSchema>;

// Reused by every "Encabezado" (CenteredHero) placement across pages —
// Tratamientos, Sobre Nosotros, Casos Reales all use the same eyebrow/title/
// subtitle shape.
export const centeredHeroContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

export type CenteredHeroContent = z.infer<typeof centeredHeroContentSchema>;
