"use client";

import { useActionState, useState } from "react";
import FormSection from "@/components/admin/FormSection";
import SavedToast from "@/components/admin/SavedToast";
import { updateFooterContacto, type SiteSettingsFormState } from "../horario-contacto/actions";
import type { SiteSettings } from "@/lib/generated/prisma/client";

const initialState: SiteSettingsFormState = {};

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-title-lg font-medium text-white/60 tracking-wide">
        {label}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );
}

export default function FooterSettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateFooterContacto, initialState);

  const [values, setValues] = useState({
    whatsappNumber: initial.whatsappNumber,
    facebookUrl: initial.facebookUrl ?? "",
    instagramUrl: initial.instagramUrl ?? "",
    linkedinUrl: initial.linkedinUrl ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1080px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormSection title="Contacto" description="El número que reciben los botones de WhatsApp del sitio.">
          <Field
            id="whatsappNumber"
            label="WHATSAPP (con código de país, ej. +591...)"
            value={values.whatsappNumber}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection title="Redes sociales" description="Dejá el campo vacío para que no se muestre el ícono.">
          <Field
            id="facebookUrl"
            label="FACEBOOK"
            value={values.facebookUrl}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
          <Field
            id="instagramUrl"
            label="INSTAGRAM"
            value={values.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
          <Field
            id="linkedinUrl"
            label="LINKEDIN"
            value={values.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/..."
          />
        </FormSection>
      </div>

      {state.error && (
        <p className="text-headline-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
      <SavedToast state={state} />
    </form>
  );
}
