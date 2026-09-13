"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import RepeatableItemList, { type RepeatableStepItem } from "@/components/admin/RepeatableItemList";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import { updateHowItWorksSection, type SectionFormState } from "../actions";
import type { HowItWorksContent } from "@/lib/page-sections/home";

const initialState: SectionFormState = {};

interface HowItWorksSectionFormProps {
  initial: HowItWorksContent;
  visible: boolean;
}

export default function HowItWorksSectionForm({ initial, visible: initialVisible }: HowItWorksSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateHowItWorksSection, initialState);

  const [values, setValues] = useState({ eyebrow: initial.eyebrow, title: initial.title });
  const [steps, setSteps] = useState<RepeatableStepItem[]>(initial.steps);
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleStepChange(index: number, field: "title" | "desc" | "alt", value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1200px]">
      <div className="flex flex-col gap-4">
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, esta sección desaparece del Home."
        />
        <div className="h-px bg-white/[0.08]" />
      </div>

      <FormSection title="Contenido principal" description="El texto que aparece antes de los 4 pasos." className="max-w-[640px]">
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
      </FormSection>

      <FormSection title="Los 4 pasos" description="Cada uno con su título, descripción e imagen.">
        <RepeatableItemList
          items={steps}
          namePrefix={(index, field) => `step${index + 1}${field.charAt(0).toUpperCase()}${field.slice(1)}`}
          onFieldChange={handleStepChange}
        />
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
