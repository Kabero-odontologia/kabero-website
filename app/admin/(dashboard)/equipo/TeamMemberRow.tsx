"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteButton from "@/components/admin/DeleteButton";
import DragHandleIcon from "@/components/admin/DragHandleIcon";
import { deleteTeamMember, toggleTeamMemberVisibility } from "./actions";

interface TeamMemberRowProps {
  id: string;
  name: string;
  specialty: string;
  photo: string | null;
  visible: boolean;
}

export default function TeamMemberRow({ id, name, specialty, photo, visible }: TeamMemberRowProps) {
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
          className="w-7 h-7 rounded flex items-center justify-center text-white/35 hover:bg-white/[0.08] hover:text-white/70 cursor-grab active:cursor-grabbing transition-colors touch-none shrink-0"
          aria-label="Arrastrar para reordenar"
        >
          <DragHandleIcon />
        </button>
        {photo && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/[0.06]">
            <Image src={photo} alt="" fill sizes="40px" className="object-cover" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-headline-sm font-medium text-white truncate">{name}</span>
          <span className="text-title-md text-white/45 truncate">{specialty}</span>
        </div>
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
          onClick={() => startTransition(() => { toggleTeamMemberVisibility(id, !visible); })}
          className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
        <Link
          href={`/admin/equipo/${id}`}
          className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          Editar
        </Link>
        <DeleteButton
          action={deleteTeamMember.bind(null, id)}
          confirmMessage="¿Eliminar a esta persona del equipo? Esta acción no se puede deshacer."
        />
      </div>
    </div>
  );
}
