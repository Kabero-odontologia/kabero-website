"use client";

import { useActionState } from "react";
import BusinessHoursEditor from "@/components/admin/BusinessHoursEditor";
import FormSection from "@/components/admin/FormSection";
import SavedToast from "@/components/admin/SavedToast";
import { updateBusinessHours, type SiteSettingsFormState } from "./actions";
import type { BusinessHoursDay } from "@/lib/business-hours-shared";

const initialState: SiteSettingsFormState = {};

export default function BusinessHoursForm({ initial }: { initial: BusinessHoursDay[] }) {
  const [state, formAction, pending] = useActionState(updateBusinessHours, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[900px]">
      <FormSection
        title="Horario de atención"
        description={'Se muestra en Visitanos del Home y calcula el estado "Abierto ahora".'}
      >
        <BusinessHoursEditor initial={initial} />
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
        {pending ? "Guardando…" : "Guardar horario"}
      </button>
      <SavedToast state={state} />
    </form>
  );
}
