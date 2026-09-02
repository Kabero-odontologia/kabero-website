import { getPageSection } from "@/lib/page-sections";
import { casosDeExitoContentSchema, casosDeExitoDefault } from "@/lib/page-sections/home";
import CasosDeExitoSectionForm from "./CasosDeExitoSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "home",
    "casos-de-exito-intro",
    casosDeExitoContentSchema,
    casosDeExitoDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Casos de éxito (texto)</h1>
      <CasosDeExitoSectionForm initial={content} visible={visible} />
    </div>
  );
}
