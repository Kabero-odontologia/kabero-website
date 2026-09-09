"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteButton from "@/components/admin/DeleteButton";
import DragHandleIcon from "@/components/admin/DragHandleIcon";
import { deleteCaseStudy, toggleCaseStudyVisibility } from "./actions";

interface CaseStudyRowProps {
  id: string;
  tag: string;
  beforePhoto: string;
  afterPhoto: string;
  visible: boolean;
}

export default function CaseStudyRow({ id, tag, beforePhoto, afterPhoto, visible }: CaseStudyRowProps) {
  const [pending, startTransition] = useTransition();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 flex flex-col gap-4 ${
        isDragging ? "opacity-60 z-10 relative" : ""
      }`}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-white/[0.03]">
          <Image src={beforePhoto} alt="Antes" fill sizes="(max-width: 1280px) 45vw, 220px" className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-white/[0.03]">
          <Image src={afterPhoto} alt="Después" fill sizes="(max-width: 1280px) 45vw, 220px" className="object-cover" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-headline-sm font-medium text-white/80 truncate">{tag}</span>
        <span
          className={`shrink-0 text-title-md font-medium px-2.5 py-1 rounded-full ${
            visible ? "bg-green-500/15 text-green-400" : "bg-white/[0.06] text-white/40"
          }`}
        >
          {visible ? "Visible" : "Oculto"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="w-8 h-8 rounded flex items-center justify-center text-white/35 hover:bg-white/[0.08] hover:text-white/70 cursor-grab active:cursor-grabbing transition-colors touch-none"
          aria-label="Arrastrar para reordenar"
        >
          <DragHandleIcon />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(() => {
                toggleCaseStudyVisibility(id, !visible);
              })
            }
            className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
          <Link
            href={`/admin/casos-reales/${id}`}
            className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            Editar
          </Link>
          <DeleteButton
            action={deleteCaseStudy.bind(null, id)}
            confirmMessage="¿Eliminar este caso? Esta acción no se puede deshacer."
          />
        </div>
      </div>
    </div>
  );
}
