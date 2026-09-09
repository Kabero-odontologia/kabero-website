"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteButton from "@/components/admin/DeleteButton";
import DragHandleIcon from "@/components/admin/DragHandleIcon";
import { deleteFAQ, toggleFAQVisibility } from "./actions";

interface FAQRowProps {
  id: string;
  question: string;
  visible: boolean;
}

export default function FAQRow({ id, question, visible }: FAQRowProps) {
  const [pending, startTransition] = useTransition();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 flex items-center justify-between gap-4 ${
        isDragging ? "opacity-60 z-10 relative" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="w-7 h-7 rounded flex items-center justify-center text-white/35 hover:bg-white/[0.08] hover:text-white/70 cursor-grab active:cursor-grabbing transition-colors touch-none"
          aria-label="Arrastrar para reordenar"
        >
          <DragHandleIcon />
        </button>
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
