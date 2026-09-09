"use client";

import { useActionState, useState } from "react";
import FormSection from "@/components/admin/FormSection";
import SavedToast from "@/components/admin/SavedToast";
import { updateUbicacion, type SiteSettingsFormState } from "@/app/admin/(dashboard)/horario-contacto/actions";
import type { SiteSettings } from "@/lib/generated/prisma/client";

const initialState: SiteSettingsFormState = {};

export default function UbicacionForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateUbicacion, initialState);

  const [values, setValues] = useState({
    mapsQuery: initial.mapsQuery,
    mapsLink: initial.mapsLink,
    address: initial.address,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[900px]">
      <FormSection title="Ubicación" description="El mapa y la dirección que se muestran en Visitanos y en el pie de página.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="mapsQuery" className="text-title-lg font-medium text-white/60 tracking-wide">
              TEXTO DE BÚSQUEDA EN GOOGLE MAPS
            </label>
            <input
              id="mapsQuery"
              name="mapsQuery"
              value={values.mapsQuery}
              onChange={handleChange}
              placeholder="Nombre de la clínica, ciudad, país"
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="mapsLink" className="text-title-lg font-medium text-white/60 tracking-wide">
              LINK DEL BOTÓN &quot;VER EN GOOGLE MAPS&quot;
            </label>
            <input
              id="mapsLink"
              name="mapsLink"
              value={values.mapsLink}
              onChange={handleChange}
              placeholder="https://maps.app.goo.gl/..."
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 max-w-[440px]">
          <label htmlFor="address" className="text-title-lg font-medium text-white/60 tracking-wide">
            DIRECCIÓN (pie de página)
          </label>
          <input
            id="address"
            name="address"
            value={values.address}
            onChange={handleChange}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
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
