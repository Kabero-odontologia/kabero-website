"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageCropField from "@/components/admin/ImageCropField";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import { updateLaboratorioSection, type SectionFormState } from "../actions";
import type { LaboratorioContent } from "@/lib/page-sections/sobre-nosotros";

const initialState: SectionFormState = {};

interface LaboratorioSectionFormProps {
  initial: LaboratorioContent;
  visible: boolean;
}

export default function LaboratorioSectionForm({ initial, visible: initialVisible }: LaboratorioSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateLaboratorioSection, initialState);

  const [values, setValues] = useState({
    eyebrow: initial.eyebrow,
    title: initial.title,
    description: initial.description,
  });
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1080px]">
      <div className="flex flex-col gap-4">
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, esta sección desaparece de la página."
        />
        <div className="h-px bg-white/[0.08]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <FormSection
          className="lg:col-span-3"
          title="Contenido principal"
          description="Se muestra debajo de la sección Equipo, arriba de las fotos."
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

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-title-lg font-medium text-white/60 tracking-wide">
              DESCRIPCIÓN
            </label>
            <textarea
              id="description"
              name="description"
              rows={9}
              value={values.description}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>
        </FormSection>

        <FormSection
          className="lg:col-span-2"
          title="Fotos"
          description="Se muestran como bento grid debajo del texto: una grande y dos chicas apiladas."
        >
          <ImageCropField
            name="photo1"
            label="FOTO GRANDE (izquierda)"
            defaultValue={initial.photos[0]}
            desktopAspect={0.91}
            mobileAspect={0.93}
          />
          <ImageCropField
            name="photo2"
            label="FOTO CHICA 1 (arriba derecha)"
            defaultValue={initial.photos[1]}
            desktopAspect={1.18}
            mobileAspect={1.22}
          />
          <ImageCropField
            name="photo3"
            label="FOTO CHICA 2 (abajo derecha)"
            defaultValue={initial.photos[2]}
            desktopAspect={1.18}
            mobileAspect={1.22}
          />
        </FormSection>
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
