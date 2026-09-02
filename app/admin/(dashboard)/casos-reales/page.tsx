import Link from "next/link";
import { prisma } from "@/lib/db";
import CaseStudyRow from "./CaseStudyRow";

export default async function Page() {
  const cases = await prisma.caseStudy.findMany({
    orderBy: { order: "asc" },
    include: { treatment: { select: { title: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-white">Casos reales</h1>
          <p className="text-headline-sm text-white/45 mt-1">
            Fotos de antes y después que se muestran en el inicio y en la página de casos reales.
          </p>
        </div>
        <Link
          href="/admin/casos-reales/nuevo"
          className="shrink-0 inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] text-white hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold px-6 py-3.5"
        >
          + Agregar caso
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-10 flex flex-col items-center gap-2 text-center">
          <span className="text-headline-md font-semibold text-white/80">Todavía no hay casos cargados</span>
          <span className="text-headline-sm text-white/45 max-w-[420px]">
            Agregá el primero con fotos reales de antes y después de un paciente.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <CaseStudyRow
              key={c.id}
              id={c.id}
              tag={c.treatment?.title ?? c.tagOverride ?? "Sin etiqueta"}
              beforePhoto={c.beforePhoto}
              afterPhoto={c.afterPhoto}
              visible={c.visible}
              isFirst={i === 0}
              isLast={i === cases.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
