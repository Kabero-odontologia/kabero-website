import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CaseStudyForm from "../CaseStudyForm";
import { updateCaseStudy } from "../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [caseStudy, treatments] = await Promise.all([
    prisma.caseStudy.findUnique({ where: { id } }),
    prisma.treatment.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);

  if (!caseStudy) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Editar caso</h1>
      <CaseStudyForm
        action={updateCaseStudy.bind(null, id)}
        treatments={treatments}
        initial={caseStudy}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
