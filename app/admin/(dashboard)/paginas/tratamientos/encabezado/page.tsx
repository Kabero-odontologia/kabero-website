import { getPageSection } from "@/lib/page-sections";
import { centeredHeroContentSchema } from "@/lib/page-sections/shared";
import { tratamientosEncabezadoDefault } from "@/lib/page-sections/tratamientos";
import CenteredHeroSectionForm from "@/components/admin/CenteredHeroSectionForm";
import { updateTratamientosEncabezado } from "../actions";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "tratamientos",
    "centered-hero",
    centeredHeroContentSchema,
    tratamientosEncabezadoDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Tratamientos — Encabezado</h1>
      <CenteredHeroSectionForm action={updateTratamientosEncabezado} initial={content} visible={visible} />
    </div>
  );
}
