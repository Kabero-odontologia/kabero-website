"use client";

import { useTransition } from "react";
import { deleteAdminUser } from "./actions";

export default function DeleteAdminButton({ id, username }: { id: string; username: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`¿Eliminar el usuario "${username}"? No se puede deshacer.`)) return;
        startTransition(async () => {
          const result = await deleteAdminUser(id);
          if (result.error) alert(result.error);
        });
      }}
      className="px-3 py-2 rounded text-title-md font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
