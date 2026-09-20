"use client";

import { useActionState } from "react";
import Link from "next/link";
import FormSection from "@/components/admin/FormSection";
import PasswordField from "@/components/admin/PasswordField";
import type { AdminUserFormState } from "./actions";

interface AdminUserFormProps {
  action: (prevState: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
  initial: { username: string; email: string | null };
  isSelf: boolean;
}

const initialState: AdminUserFormState = {};

export default function AdminUserForm({ action, initial, isSelf }: AdminUserFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[500px]">
      <FormSection title="Datos" description="Usuario y email de esta cuenta.">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-title-lg font-medium text-white/60 tracking-wide">
            USUARIO
          </label>
          <input
            id="username"
            name="username"
            defaultValue={initial.username}
            autoComplete="off"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-title-lg font-medium text-white/60 tracking-wide">
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={initial.email ?? ""}
            autoComplete="off"
            placeholder="Para recuperar la contraseña si la olvida"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </FormSection>

      <FormSection
        title="Cambiar contraseña"
        description={
          isSelf
            ? "Dejá estos campos vacíos si no querés cambiarla."
            : "Dejá estos campos vacíos si no querés cambiarla. No hace falta la contraseña actual de esta cuenta."
        }
      >
        {isSelf && <PasswordField id="currentPassword" label="CONTRASEÑA ACTUAL" autoComplete="current-password" />}
        <PasswordField id="newPassword" label="CONTRASEÑA NUEVA" autoComplete="new-password" />
        <PasswordField id="confirmPassword" label="REPETIR CONTRASEÑA NUEVA" autoComplete="new-password" />
      </FormSection>

      {state.error && (
        <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <Link
          href="/admin/usuarios"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
