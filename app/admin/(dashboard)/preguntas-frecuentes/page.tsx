import Link from "next/link";
import { prisma } from "@/lib/db";
import SortableList from "@/components/admin/SortableList";
import FAQRow from "./FAQRow";
import { reorderFAQs } from "./actions";

export default async function Page() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-white">Preguntas frecuentes</h1>
          <p className="text-headline-sm text-white/45 mt-1">Se muestran en la página de Tratamientos.</p>
        </div>
        <Link
          href="/admin/preguntas-frecuentes/nuevo"
          className="shrink-0 inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] text-white hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold px-6 py-3.5"
        >
          + Agregar pregunta
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-10 flex flex-col items-center gap-2 text-center">
          <span className="text-headline-md font-semibold text-white/80">Todavía no hay preguntas cargadas</span>
        </div>
      ) : (
        <SortableList ids={faqs.map((f) => f.id)} onReorder={reorderFAQs} className="flex flex-col gap-3">
          {faqs.map((f) => (
            <FAQRow key={f.id} id={f.id} question={f.question} visible={f.visible} />
          ))}
        </SortableList>
      )}
    </div>
  );
}
