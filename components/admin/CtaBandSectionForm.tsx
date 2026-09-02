"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SavedToast from "@/components/admin/SavedToast";
import type { CtaBandContent } from "@/lib/page-sections/shared";

interface SectionFormState {
  error?: string;
  success?: boolean;
}

interface CtaBandSectionFormProps {
  action: (prevState: SectionFormState, formData: FormData) => Promise<SectionFormState>;
  initial: CtaBandContent;
  visible: boolean;
  cancelHref: string;
}

const initialState: SectionFormState = {};

// Shared by every plain (photo-less) CTABand placement — Home today, Sobre
// Nosotros too. Tratamientos' banner uses its own form since it has an extra
// `photo` field for TreatmentsCTABanner.
export default function CtaBandSectionForm({ action, initial, visible: initialVisible, cancelHref }: CtaBandSectionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [backgroundFrom, setBackgroundFrom] = useState(initial.backgroundFrom ?? "#161616");
  const [backgroundTo, setBackgroundTo] = useState(initial.backgroundTo ?? "#FFFFFF");
  const [visible, setVisible] = useState(initialVisible);

  const [values, setValues] = useState({
    headline: initial.headline,
    subtitle: initial.subtitle,
    buttonLabel: initial.buttonLabel,
    buttonHref: initial.buttonHref,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[560px]">
      <div className="flex flex-col gap-2">
        <label htmlFor="headline" className="text-title-lg font-medium text-white/60 tracking-wide">
          TÍTULO
        </label>
        <input
          id="headline"
          name="headline"
          value={values.headline}
          onChange={handleChange}
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subtitle" className="text-title-lg font-medium text-white/60 tracking-wide">
          DESCRIPCIÓN
        </label>
        <input
          id="subtitle"
          name="subtitle"
          value={values.subtitle}
          onChange={handleChange}
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
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

      <ImageUploadField name="backgroundImage" label="IMAGEN DE FONDO (opcional)" defaultValue={initial.backgroundImage} clearable />

      <div className="flex flex-col gap-2">
        <span className="text-title-lg font-medium text-white/60 tracking-wide">
          DEGRADÉ (se usa solo si no hay imagen de fondo)
        </span>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="color"
              name="backgroundFrom"
              value={backgroundFrom}
              onChange={(e) => setBackgroundFrom(e.target.value)}
              className="w-10 h-10 rounded-md border border-white/10 bg-transparent cursor-pointer"
            />
            <span className="text-title-md text-white/50">Arriba</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="color"
              name="backgroundTo"
              value={backgroundTo}
              onChange={(e) => setBackgroundTo(e.target.value)}
              className="w-10 h-10 rounded-md border border-white/10 bg-transparent cursor-pointer"
            />
            <span className="text-title-md text-white/50">Abajo</span>
          </label>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          name="visible"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          className="w-5 h-5 rounded accent-white"
        />
        <span className="text-headline-sm text-white/70">Visible en el sitio público</span>
      </label>

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
          href={cancelHref}
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
      <SavedToast state={state} />
    </form>
  );
}
