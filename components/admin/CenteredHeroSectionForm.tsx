"use client";

import { useActionState, useState } from "react";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import type { CenteredHeroContent } from "@/lib/page-sections/shared";

interface SectionFormState {
  error?: string;
  success?: boolean;
}

interface CenteredHeroSectionFormProps {
  action: (prevState: SectionFormState, formData: FormData) => Promise<SectionFormState>;
  initial: CenteredHeroContent;
  visible: boolean;
}

const initialState: SectionFormState = {};

// Shared by every page's "Encabezado" (CenteredHero) section — same
// eyebrow/title/subtitle shape everywhere it's used.
export default function CenteredHeroSectionForm({ action, initial, visible: initialVisible }: CenteredHeroSectionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Controlled fields: React 19 clears every uncontrolled `defaultValue` input
  // after a form action runs (success OR error) — a controlled value survives
  // that reset since React re-asserts it on the next render.
  const [values, setValues] = useState({
    eyebrow: initial.eyebrow,
    title: initial.title,
    subtitle: initial.subtitle,
  });
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[640px]">
      <FormSection title="Encabezado" description="El texto que aparece en la parte superior de la página.">
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
          <textarea
            id="subtitle"
            name="subtitle"
            rows={3}
            value={values.subtitle}
            onChange={handleChange}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>
      </FormSection>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, el encabezado desaparece de la página."
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
