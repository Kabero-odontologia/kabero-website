import { getPageSection } from "@/lib/page-sections";
import { historiaContentSchema, historiaDefault } from "@/lib/page-sections/sobre-nosotros";
import HistoriaSectionForm from "./HistoriaSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection("sobre-nosotros", "historia", historiaContentSchema, historiaDefault);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Nuestra historia</h1>
      <HistoriaSectionForm initial={content} visible={visible} />
    </div>
  );
}
