"use client";

import { useActionState, useState } from "react";
import FormSection from "@/components/admin/FormSection";
import SavedToast from "@/components/admin/SavedToast";
import { updateSeo, type SiteSettingsFormState } from "./actions";
import type { SiteSettings } from "@/lib/generated/prisma/client";

const initialState: SiteSettingsFormState = {};

export default function SiteSettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSeo, initialState);

  const [values, setValues] = useState({
    seoTitle: initial.seoTitle,
    seoDescription: initial.seoDescription,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[900px]">
      <FormSection
        title="SEO"
        description="Cómo aparece el sitio en Google y al compartirlo — no se ve en el sitio en sí."
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="seoTitle" className="text-title-lg font-medium text-white/60 tracking-wide">
            TÍTULO PARA BUSCADORES
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            value={values.seoTitle}
            onChange={handleChange}
            placeholder="Kabero — Odontología estética en Cochabamba"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="seoDescription" className="text-title-lg font-medium text-white/60 tracking-wide">
            DESCRIPCIÓN PARA BUSCADORES
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={3}
            value={values.seoDescription}
            onChange={handleChange}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>
      </FormSection>

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
