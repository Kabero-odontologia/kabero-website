"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}

export default function DeleteButton({
  action,
  confirmMessage = "¿Seguro que querés eliminar esto? No se puede deshacer.",
  label = "Eliminar",
}: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="px-3 py-2 rounded text-title-md font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {pending ? "Eliminando…" : label}
    </button>
  );
}
