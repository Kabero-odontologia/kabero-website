import { prisma } from "@/lib/db";
import CaseStudyForm from "../CaseStudyForm";
import { createCaseStudy } from "../actions";

export default async function Page() {
  const treatments = await prisma.treatment.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Nuevo caso</h1>
      <CaseStudyForm action={createCaseStudy} treatments={treatments} submitLabel="Guardar caso" />
    </div>
  );
}
