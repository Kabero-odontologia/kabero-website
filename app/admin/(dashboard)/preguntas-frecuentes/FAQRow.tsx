"use client";

import Link from "next/link";
import { useTransition } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteFAQ, toggleFAQVisibility, moveFAQ } from "./actions";

interface FAQRowProps {
  id: string;
  question: string;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export default function FAQRow({ id, question, visible, isFirst, isLast }: FAQRowProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            disabled={isFirst || pending}
            onClick={() => startTransition(() => { moveFAQ(id, "up"); })}
            className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-25 transition-colors"
            aria-label="Mover arriba"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast || pending}
            onClick={() => startTransition(() => { moveFAQ(id, "down"); })}
            className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-25 transition-colors"
            aria-label="Mover abajo"
          >
            ↓
          </button>
        </div>
        <span className="text-headline-sm font-medium text-white truncate">{question}</span>
        <span
          className={`shrink-0 text-title-md font-medium px-2.5 py-1 rounded-full ${
            visible ? "bg-green-500/15 text-green-400" : "bg-white/[0.06] text-white/40"
          }`}
        >
          {visible ? "Visible" : "Oculto"}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => { toggleFAQVisibility(id, !visible); })}
          className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
        <Link
          href={`/admin/preguntas-frecuentes/${id}`}
          className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          Editar
        </Link>
        <DeleteButton
          action={deleteFAQ.bind(null, id)}
          confirmMessage="¿Eliminar esta pregunta? Esta acción no se puede deshacer."
        />
      </div>
    </div>
  );
}
