import { getPageSection } from "@/lib/page-sections";
import { ctaBandContentSchema } from "@/lib/page-sections/shared";
import { sobreNosotrosCtaBandDefault } from "@/lib/page-sections/sobre-nosotros";
import CtaBandSectionForm from "@/components/admin/CtaBandSectionForm";
import { updateSobreNosotrosCtaBand } from "../actions";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "sobre-nosotros",
    "cta-band",
    ctaBandContentSchema,
    sobreNosotrosCtaBandDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Sobre nosotros — Banner final</h1>
      <CtaBandSectionForm
        action={updateSobreNosotrosCtaBand}
        initial={content}
        visible={visible}
        cancelHref="/admin/paginas/sobre-nosotros"
      />
    </div>
  );
}
