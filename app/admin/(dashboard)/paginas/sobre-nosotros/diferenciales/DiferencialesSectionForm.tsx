"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import DynamicTextPairList from "@/components/admin/DynamicTextPairList";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import { updateDiferencialesSection, type SectionFormState } from "../actions";
import type { DiferencialesContent } from "@/lib/page-sections/sobre-nosotros";

const initialState: SectionFormState = {};

interface DiferencialesSectionFormProps {
  initial: DiferencialesContent;
  visible: boolean;
}

export default function DiferencialesSectionForm({ initial, visible: initialVisible }: DiferencialesSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateDiferencialesSection, initialState);

  const [title, setTitle] = useState(initial.title);
  const [visible, setVisible] = useState(initialVisible);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1080px]">
      <FormSection title="Título" className="max-w-[640px]">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-title-lg font-medium text-white/60 tracking-wide">
            TÍTULO
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </FormSection>

      <FormSection title="Diferenciales" description="Cada uno se muestra como una tarjeta con ícono, título y descripción.">
        <DynamicTextPairList
          titleName="itemTitle"
          descName="itemDesc"
          itemLabel="diferencial"
          defaultValues={initial.items}
        />
      </FormSection>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, esta sección desaparece de la página."
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
          href="/admin/paginas/sobre-nosotros"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
      <SavedToast state={state} />
    </form>
  );
}
