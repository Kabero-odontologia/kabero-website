"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageCropField from "@/components/admin/ImageCropField";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import type { CaseStudyFormState } from "./actions";

interface CaseStudyFormProps {
  action: (prevState: CaseStudyFormState, formData: FormData) => Promise<CaseStudyFormState>;
  treatments: { id: string; title: string }[];
  initial?: {
    treatmentId: string | null;
    tagOverride: string | null;
    beforePhoto: string;
    afterPhoto: string;
    visible: boolean;
  };
  submitLabel: string;
}

const initialState: CaseStudyFormState = {};

export default function CaseStudyForm({ action, treatments, initial, submitLabel }: CaseStudyFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Controlled fields: React resets every uncontrolled input after a form
  // action runs (success OR error) — controlled values survive that reset.
  const [treatmentId, setTreatmentId] = useState(initial?.treatmentId ?? "");
  const [tagOverride, setTagOverride] = useState(initial?.tagOverride ?? "");
  const [visible, setVisible] = useState(initial?.visible ?? true);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1080px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormSection title="Detalles" description="Qué tratamiento representa este caso.">
          <div className="flex flex-col gap-2">
            <label htmlFor="treatmentId" className="text-title-lg font-medium text-white/60 tracking-wide">
              TRATAMIENTO ASOCIADO
            </label>
            <select
              id="treatmentId"
              name="treatmentId"
              value={treatmentId}
              onChange={(e) => setTreatmentId(e.target.value)}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 focus:bg-white/[0.09] transition-colors"
            >
              <option value="" className="bg-[#151517]">
                — Sin tratamiento (usar etiqueta personalizada) —
              </option>
              {treatments.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#151517]">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tagOverride" className="text-title-lg font-medium text-white/60 tracking-wide">
              ETIQUETA PERSONALIZADA (si no elegís un tratamiento)
            </label>
            <input
              id="tagOverride"
              name="tagOverride"
              value={tagOverride}
              onChange={(e) => setTagOverride(e.target.value)}
              placeholder="Ej: Blanqueamiento dental"
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 focus:bg-white/[0.09] transition-colors"
            />
          </div>
        </FormSection>

        <FormSection title="Fotos" description="Antes y después del mismo ángulo y encuadre, si es posible.">
          <div className="grid grid-cols-2 gap-4">
            <ImageCropField
              name="beforePhoto"
              label="ANTES"
              defaultValue={initial?.beforePhoto}
              desktopAspect={1.91}
              mobileAspect={1.51}
            />
            <ImageCropField
              name="afterPhoto"
              label="DESPUÉS"
              defaultValue={initial?.afterPhoto}
              desktopAspect={1.91}
              mobileAspect={1.51}
            />
          </div>
        </FormSection>
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, este caso desaparece del sitio."
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
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link
          href="/admin/casos-reales"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
