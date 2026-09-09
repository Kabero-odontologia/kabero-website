import Link from "next/link";
import { prisma } from "@/lib/db";
import SortableList from "@/components/admin/SortableList";
import TreatmentRow from "./TreatmentRow";
import { reorderTreatments } from "./actions";

export default async function Page() {
  const treatments = await prisma.treatment.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-white">Tratamientos</h1>
          <p className="text-headline-sm text-white/45 mt-1">
            Se muestran en Home, en el listado de tratamientos y en cada página de detalle.
          </p>
        </div>
        <Link
          href="/admin/tratamientos/nuevo"
          className="shrink-0 inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] text-white hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold px-6 py-3.5"
        >
          + Agregar tratamiento
        </Link>
      </div>

      {treatments.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-10 flex flex-col items-center gap-2 text-center">
          <span className="text-headline-md font-semibold text-white/80">Todavía no hay tratamientos cargados</span>
        </div>
      ) : (
        <SortableList ids={treatments.map((t) => t.id)} onReorder={reorderTreatments} className="flex flex-col gap-3">
          {treatments.map((t) => (
            <TreatmentRow key={t.id} id={t.id} title={t.title} shortDesc={t.shortDesc} photo={t.photo} visible={t.visible} />
          ))}
        </SortableList>
      )}
    </div>
  );
}
