import { getPageSection } from "@/lib/page-sections";
import { equipoIntroContentSchema, equipoIntroDefault } from "@/lib/page-sections/sobre-nosotros";
import EquipoIntroSectionForm from "./EquipoIntroSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "sobre-nosotros",
    "equipo-intro",
    equipoIntroContentSchema,
    equipoIntroDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Equipo (texto)</h1>
      <EquipoIntroSectionForm initial={content} visible={visible} />
    </div>
  );
}
