import { getPageSection } from "@/lib/page-sections";
import { fundadorContentSchema, fundadorDefault } from "@/lib/page-sections/sobre-nosotros";
import FundadorSectionForm from "./FundadorSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection("sobre-nosotros", "fundador", fundadorContentSchema, fundadorDefault);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Fundador</h1>
      <FundadorSectionForm initial={content} visible={visible} />
    </div>
  );
}
