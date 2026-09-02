import { getPageSection } from "@/lib/page-sections";
import { laboratorioContentSchema, laboratorioDefault } from "@/lib/page-sections/sobre-nosotros";
import LaboratorioSectionForm from "./LaboratorioSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "sobre-nosotros",
    "laboratorio",
    laboratorioContentSchema,
    laboratorioDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Nuestro laboratorio</h1>
      <LaboratorioSectionForm initial={content} visible={visible} />
    </div>
  );
}
