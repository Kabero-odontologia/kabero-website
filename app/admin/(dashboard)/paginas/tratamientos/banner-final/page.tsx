import { getPageSection } from "@/lib/page-sections";
import { tratamientosCtaBandContentSchema, tratamientosCtaBandDefault } from "@/lib/page-sections/tratamientos";
import CtaBandForm from "./CtaBandForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "tratamientos",
    "cta-band",
    tratamientosCtaBandContentSchema,
    tratamientosCtaBandDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Tratamientos — Banner final</h1>
      <CtaBandForm initial={content} visible={visible} />
    </div>
  );
}
