"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import { updateCasosDeExitoSection, type SectionFormState } from "../actions";
import type { CasosDeExitoContent } from "@/lib/page-sections/home";

const initialState: SectionFormState = {};

interface CasosDeExitoSectionFormProps {
  initial: CasosDeExitoContent;
  visible: boolean;
}

export default function CasosDeExitoSectionForm({ initial, visible: initialVisible }: CasosDeExitoSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateCasosDeExitoSection, initialState);

  const [values, setValues] = useState({ eyebrow: initial.eyebrow, title: initial.title });
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[640px]">
      <FormSection
        title="Contenido principal"
        description="Las fotos que se muestran acá son las primeras 3 visibles de Casos reales — para cambiar cuáles aparecen, reordená o mostrá/ocultá casos ahí."
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="eyebrow" className="text-title-lg font-medium text-white/60 tracking-wide">
            ANTETÍTULO
          </label>
          <input
            id="eyebrow"
            name="eyebrow"
            value={values.eyebrow}
            onChange={handleChange}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-title-lg font-medium text-white/60 tracking-wide">
            TÍTULO
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <Link
          href="/admin/casos-reales"
          className="text-title-md text-white/50 underline hover:text-white/80 transition-colors w-fit"
        >
          Ir a Casos reales →
        </Link>
      </FormSection>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, esta sección desaparece del Home."
        />
      </div>

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
          href="/admin/paginas/home"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
      <SavedToast state={state} />
    </form>
  );
}
