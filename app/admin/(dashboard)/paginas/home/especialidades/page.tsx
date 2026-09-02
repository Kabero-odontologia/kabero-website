import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { especialidadesContentSchema, especialidadesDefault } from "@/lib/page-sections/home";
import EspecialidadesSectionForm from "./EspecialidadesSectionForm";

export default async function Page() {
  const [{ content, visible }, allTreatments] = await Promise.all([
    getPageSection("home", "especialidades-intro", especialidadesContentSchema, especialidadesDefault),
    prisma.treatment.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true, photo: true } }),
  ]);

  const defaultSelectedIds =
    content.treatmentIds.length > 0 ? content.treatmentIds : allTreatments.slice(0, 4).map((t) => t.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Especialidades</h1>
      <EspecialidadesSectionForm
        initial={content}
        visible={visible}
        treatments={allTreatments}
        defaultSelectedIds={defaultSelectedIds}
      />
    </div>
  );
}
