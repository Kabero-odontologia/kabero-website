import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { casosDeExitoContentSchema, casosDeExitoDefault } from "@/lib/page-sections/home";
import CasosDeExitoSectionForm from "./CasosDeExitoSectionForm";

export default async function Page() {
  const [{ content, visible }, allCaseStudies, allTreatments] = await Promise.all([
    getPageSection("home", "casos-de-exito-intro", casosDeExitoContentSchema, casosDeExitoDefault),
    prisma.caseStudy.findMany({
      orderBy: { order: "asc" },
      select: { id: true, beforePhoto: true, tagOverride: true, treatmentId: true, treatment: { select: { title: true } } },
    }),
    prisma.treatment.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);

  const caseStudies = allCaseStudies.map((c) => ({
    id: c.id,
    photo: c.beforePhoto,
    tag: c.treatment?.title ?? c.tagOverride ?? "Sin etiqueta",
    treatmentId: c.treatmentId,
  }));

  const defaultSelectedIds =
    content.caseStudyIds.length > 0 ? content.caseStudyIds : caseStudies.slice(0, 3).map((c) => c.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Casos de éxito</h1>
      <CasosDeExitoSectionForm
        initial={content}
        visible={visible}
        caseStudies={caseStudies}
        treatments={allTreatments}
        defaultSelectedIds={defaultSelectedIds}
      />
    </div>
  );
}
