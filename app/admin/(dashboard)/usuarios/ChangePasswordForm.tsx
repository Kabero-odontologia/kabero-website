"use client";

import { useActionState, useRef, useEffect } from "react";
import FormSection from "@/components/admin/FormSection";
import PasswordField from "@/components/admin/PasswordField";
import { changeOwnPassword, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {};

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <FormSection title="Cambiar mi contraseña" description="Solo afecta al usuario con el que estás conectado ahora.">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        {/* ids prefixed to stay unique on this page — CreateAdminForm above
            already uses "password"/"confirmPassword" as element ids */}
        <PasswordField
          id="changeCurrentPassword"
          name="currentPassword"
          label="CONTRASEÑA ACTUAL"
          autoComplete="current-password"
        />
        <PasswordField
          id="changeNewPassword"
          name="newPassword"
          label="CONTRASEÑA NUEVA"
          autoComplete="new-password"
        />
        <PasswordField
          id="changeConfirmPassword"
          name="confirmPassword"
          label="REPETIR CONTRASEÑA NUEVA"
          autoComplete="new-password"
        />

        {state.error && (
          <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
            {state.error}
          </p>
        )}

        {state.success && (
          <p className="text-headline-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-md px-4 py-3">
            ✓ Contraseña actualizada.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="self-start inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Guardando…" : "Cambiar contraseña"}
        </button>
      </form>
    </FormSection>
  );
}
