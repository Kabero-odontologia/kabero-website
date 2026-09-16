import "server-only";
import { z } from "zod";
import type { CenteredHeroContent } from "./shared";

export const tratamientosEncabezadoDefault: CenteredHeroContent = {
  eyebrow: "TRATAMIENTOS",
  title: "Todos los tratamientos que ofrecemos",
  subtitle: "Sea una consulta de rutina o un tratamiento completo, tenemos al especialista indicado.",
};

export const tratamientosCtaBandContentSchema = z.object({
  headline: z.string().min(1),
  subtitle: z.string(),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
  photo: z.string().min(1),
});
export type TratamientosCtaBandContent = z.infer<typeof tratamientosCtaBandContentSchema>;

export const tratamientosCtaBandDefault: TratamientosCtaBandContent = {
  headline: "¿No estás seguro qué\ntratamiento necesitás?",
  subtitle: "Contanos qué te preocupa y te orientamos hacia el especialista correcto — sin compromiso.",
  buttonLabel: "Consultar ahora",
  buttonHref: "https://wa.me/59171796997",
  photo: "/dr-cabero-cta.png",
};
