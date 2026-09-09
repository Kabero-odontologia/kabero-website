import { getPageSection } from "@/lib/page-sections";
import { ctaBandContentSchema } from "@/lib/page-sections/shared";
import { casosRealesCtaBandDefault } from "@/lib/page-sections/casos-reales";
import CtaBandSectionForm from "@/components/admin/CtaBandSectionForm";
import { updateCasosRealesCtaBand } from "../actions";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "casos-reales",
    "cta-band",
    ctaBandContentSchema,
    casosRealesCtaBandDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Casos reales — Banner final</h1>
      <CtaBandSectionForm
        action={updateCasosRealesCtaBand}
        initial={content}
        visible={visible}
        cancelHref="/admin/paginas/casos-reales"
      />
    </div>
  );
}
