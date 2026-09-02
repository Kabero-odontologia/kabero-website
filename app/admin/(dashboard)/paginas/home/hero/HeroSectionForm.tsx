"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SavedToast from "@/components/admin/SavedToast";
import { updateHeroSection, type SectionFormState } from "../actions";
import type { HeroContent } from "@/lib/page-sections/home";

const initialState: SectionFormState = {};

interface HeroSectionFormProps {
  initial: HeroContent;
  visible: boolean;
}

export default function HeroSectionForm({ initial, visible: initialVisible }: HeroSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateHeroSection, initialState);

  // Controlled fields: React 19 clears every uncontrolled `defaultValue` input
  // after a form action runs (success OR error) — a controlled value survives
  // that reset since React re-asserts it on the next render.
  const [values, setValues] = useState({
    eyebrow: initial.eyebrow,
    title: initial.title,
    subtitle: initial.subtitle,
    badgeNumber: initial.badgeNumber,
    badgeLabelLine1: initial.badgeLabel[0],
    badgeLabelLine2: initial.badgeLabel[1],
  });
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[560px]">
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

      <ImageUploadField name="photo" label="IMAGEN" defaultValue={initial.photo} />

      <div className="flex flex-col gap-2">
        <span className="text-title-lg font-medium text-white/60 tracking-wide">TARJETA (ej. &quot;3&quot;)</span>
        <div className="grid grid-cols-3 gap-3">
          <input
            name="badgeNumber"
            value={values.badgeNumber}
            onChange={handleChange}
            placeholder="3"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
          <input
            name="badgeLabelLine1"
            value={values.badgeLabelLine1}
            onChange={handleChange}
            placeholder="especialidades"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
          <input
            name="badgeLabelLine2"
            value={values.badgeLabelLine2}
            onChange={handleChange}
            placeholder="certificadas"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
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
