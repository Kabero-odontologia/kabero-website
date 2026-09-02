"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteTreatment, toggleTreatmentVisibility, moveTreatment } from "./actions";

interface TreatmentRowProps {
  id: string;
  title: string;
  shortDesc: string;
  photo: string | null;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export default function TreatmentRow({
  id,
  title,
  shortDesc,
  photo,
  visible,
  isFirst,
  isLast,
}: TreatmentRowProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 flex items-center gap-4">
      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white/[0.06] shrink-0">
        {photo && <Image src={photo} alt="" fill sizes="64px" className="object-cover" />}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-headline-sm font-medium text-white truncate">{title}</span>
        <span className="text-title-md text-white/45 truncate">{shortDesc}</span>
      </div>

      <span
        className={`shrink-0 text-title-md font-medium px-2.5 py-1 rounded-full ${
          visible ? "bg-green-500/15 text-green-400" : "bg-white/[0.06] text-white/40"
        }`}
      >
        {visible ? "Visible" : "Oculto"}
      </span>

      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          disabled={isFirst || pending}
          onClick={() => startTransition(() => { moveTreatment(id, "up"); })}
          className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-25 transition-colors"
          aria-label="Mover arriba"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={isLast || pending}
          onClick={() => startTransition(() => { moveTreatment(id, "down"); })}
          className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-25 transition-colors"
          aria-label="Mover abajo"
        >
          ↓
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => { toggleTreatmentVisibility(id, !visible); })}
          className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
        <Link
          href={`/admin/tratamientos/${id}`}
          className="px-3 py-2 rounded text-title-md font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          Editar
        </Link>
        <DeleteButton
          action={deleteTreatment.bind(null, id)}
          confirmMessage="¿Eliminar este tratamiento? También se borra su galería y su lista de qué incluye. Esta acción no se puede deshacer."
        />
      </div>
    </div>
  );
}
