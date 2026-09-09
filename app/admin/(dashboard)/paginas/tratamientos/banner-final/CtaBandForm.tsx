"use client";

import { useActionState, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import { updateTratamientosCtaBand, type SectionFormState } from "../actions";
import type { TratamientosCtaBandContent } from "@/lib/page-sections/tratamientos";

const initialState: SectionFormState = {};

interface CtaBandFormProps {
  initial: TratamientosCtaBandContent;
  visible: boolean;
}

export default function CtaBandForm({ initial, visible: initialVisible }: CtaBandFormProps) {
  const [state, formAction, pending] = useActionState(updateTratamientosCtaBand, initialState);

  const [values, setValues] = useState({
    headline: initial.headline,
    subtitle: initial.subtitle,
    buttonLabel: initial.buttonLabel,
    buttonHref: initial.buttonHref,
  });
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1080px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormSection title="Texto y botón" description="En mobile este mismo texto se muestra en un banner simple, sin la foto.">
          <div className="flex flex-col gap-2">
            <label htmlFor="headline" className="text-title-lg font-medium text-white/60 tracking-wide">
              TÍTULO
            </label>
            <textarea
              id="headline"
              name="headline"
              rows={2}
              value={values.headline}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
            />
            <span className="text-title-md text-white/35">
              Podés dejar un salto de línea donde quieras que corte el título.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="subtitle" className="text-title-lg font-medium text-white/60 tracking-wide">
              DESCRIPCIÓN
            </label>
            <textarea
              id="subtitle"
              name="subtitle"
              rows={3}
              value={values.subtitle}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="buttonLabel" className="text-title-lg font-medium text-white/60 tracking-wide">
                TEXTO DEL BOTÓN
              </label>
              <input
                id="buttonLabel"
                name="buttonLabel"
                value={values.buttonLabel}
                onChange={handleChange}
                className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="buttonHref" className="text-title-lg font-medium text-white/60 tracking-wide">
                LINK DEL BOTÓN
              </label>
              <input
                id="buttonHref"
                name="buttonHref"
                value={values.buttonHref}
                onChange={handleChange}
                className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Foto" description="Recorte con fondo transparente, se apoya sobre el banner.">
          <ImageUploadField name="photo" label="FOTO" defaultValue={initial.photo} />
        </FormSection>
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, este banner desaparece de la página."
        />
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
