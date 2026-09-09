import { getPageSection } from "@/lib/page-sections";
import { centeredHeroContentSchema } from "@/lib/page-sections/shared";
import { casosRealesEncabezadoDefault } from "@/lib/page-sections/casos-reales";
import CenteredHeroSectionForm from "@/components/admin/CenteredHeroSectionForm";
import { updateCasosRealesEncabezado } from "../actions";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "casos-reales",
    "centered-hero",
    centeredHeroContentSchema,
    casosRealesEncabezadoDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Casos reales — Encabezado</h1>
      <CenteredHeroSectionForm action={updateCasosRealesEncabezado} initial={content} visible={visible} />
    </div>
  );
}
