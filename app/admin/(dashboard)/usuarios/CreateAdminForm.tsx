"use client";

import { useActionState, useRef, useEffect } from "react";
import FormSection from "@/components/admin/FormSection";
import PasswordField from "@/components/admin/PasswordField";
import { createAdminUser, type AdminUserFormState } from "./actions";

const initialState: AdminUserFormState = {};

export default function CreateAdminForm() {
  const [state, formAction, pending] = useActionState(createAdminUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <FormSection title="Agregar usuario" description="Va a poder entrar al admin con este usuario y contraseña.">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-title-lg font-medium text-white/60 tracking-wide">
            USUARIO
          </label>
          <input
            id="username"
            name="username"
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
            autoComplete="off"
            placeholder="Para recuperar la contraseña si la olvida"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <PasswordField id="password" label="CONTRASEÑA" autoComplete="new-password" />
        <PasswordField id="confirmPassword" label="REPETIR CONTRASEÑA" autoComplete="new-password" />

        {state.error && (
          <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
            {state.error}
          </p>
        )}

        {state.success && (
          <p className="text-headline-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-md px-4 py-3">
            ✓ Usuario creado — ya aparece en la lista de la izquierda.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="self-start inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Creando…" : "Crear usuario"}
        </button>
      </form>
    </FormSection>
  );
}
