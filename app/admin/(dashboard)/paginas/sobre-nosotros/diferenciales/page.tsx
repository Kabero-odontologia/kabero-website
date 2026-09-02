import { getPageSection } from "@/lib/page-sections";
import { diferencialesContentSchema, diferencialesDefault } from "@/lib/page-sections/sobre-nosotros";
import DiferencialesSectionForm from "./DiferencialesSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "sobre-nosotros",
    "diferenciales",
    diferencialesContentSchema,
    diferencialesDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Diferenciales</h1>
      <DiferencialesSectionForm initial={content} visible={visible} />
    </div>
  );
}
