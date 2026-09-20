"use client";

import Link from "next/link";
import { useActionState } from "react";
import PasswordField from "@/components/admin/PasswordField";
import { resetPassword, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-headline-sm text-white/70 bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-center">
          Listo, tu contraseña se actualizó.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5"
        >
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <PasswordField id="password" label="CONTRASEÑA NUEVA" autoComplete="new-password" required />
      <PasswordField id="confirmPassword" label="REPETIR CONTRASEÑA" autoComplete="new-password" required />

      {state.error && (
        <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Guardando…" : "Guardar contraseña"}
      </button>
    </form>
  );
}
