import { getPageSection } from "@/lib/page-sections";
import { centeredHeroContentSchema } from "@/lib/page-sections/shared";
import { sobreNosotrosEncabezadoDefault } from "@/lib/page-sections/sobre-nosotros";
import CenteredHeroSectionForm from "@/components/admin/CenteredHeroSectionForm";
import { updateSobreNosotrosEncabezado } from "../actions";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "sobre-nosotros",
    "centered-hero",
    centeredHeroContentSchema,
    sobreNosotrosEncabezadoDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Sobre nosotros — Encabezado</h1>
      <CenteredHeroSectionForm action={updateSobreNosotrosEncabezado} initial={content} visible={visible} />
    </div>
  );
}
