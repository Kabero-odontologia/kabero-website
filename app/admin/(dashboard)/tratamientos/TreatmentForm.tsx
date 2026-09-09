"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ImageCropField from "@/components/admin/ImageCropField";
import DynamicImageList from "@/components/admin/DynamicImageList";
import DynamicTextPairList from "@/components/admin/DynamicTextPairList";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import FocalPointPicker from "@/components/admin/FocalPointPicker";
import type { TreatmentFormState } from "./actions";

export interface TreatmentInitial {
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  gradient: string;
  photo: string | null;
  heroPhoto: string | null;
  teamPhoto: string | null;
  heroFocalPosition: string | null;
  visible: boolean;
  gallery: string[];
  offers: { title: string; desc: string }[];
}

interface TreatmentFormProps {
  action: (prevState: TreatmentFormState, formData: FormData) => Promise<TreatmentFormState>;
  initial?: TreatmentInitial;
  submitLabel: string;
}

const initialState: TreatmentFormState = {};

const emptyInitial: TreatmentInitial = {
  title: "",
  slug: "",
  shortDesc: "",
  fullDesc: "",
  gradient: "bg-gradient-to-br from-orange-3 to-orange-6",
  photo: null,
  heroPhoto: null,
  teamPhoto: null,
  heroFocalPosition: null,
  visible: true,
  gallery: [],
  offers: [],
};

export default function TreatmentForm({ action, initial = emptyInitial, submitLabel }: TreatmentFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Controlled text fields: React 19 clears every uncontrolled `defaultValue`
  // input after a form action runs (success OR error) — a controlled value
  // survives that reset since React re-asserts it on the next render.
  const [values, setValues] = useState({
    title: initial.title,
    slug: initial.slug,
    shortDesc: initial.shortDesc,
    fullDesc: initial.fullDesc,
    gradient: initial.gradient,
    heroFocalPosition: initial.heroFocalPosition ?? "",
  });
  const [visible, setVisible] = useState(initial.visible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1200px]">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <FormSection
          className="lg:col-span-2"
          title="Información básica"
          description="Lo que se muestra en tarjetas, listados y en la página del tratamiento."
        >
          <div className="grid grid-cols-2 gap-3">
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
              <label htmlFor="slug" className="text-title-lg font-medium text-white/60 tracking-wide">
                SLUG (URL)
              </label>
              <input
                id="slug"
                name="slug"
                value={values.slug}
                onChange={handleChange}
                placeholder="mi-tratamiento"
                className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="shortDesc" className="text-title-lg font-medium text-white/60 tracking-wide">
              DESCRIPCIÓN CORTA (tarjetas y listados)
            </label>
            <input
              id="shortDesc"
              name="shortDesc"
              value={values.shortDesc}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullDesc" className="text-title-lg font-medium text-white/60 tracking-wide">
              DESCRIPCIÓN COMPLETA
            </label>
            <textarea
              id="fullDesc"
              name="fullDesc"
              rows={7}
              value={values.fullDesc}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="gradient" className="text-title-lg font-medium text-white/60 tracking-wide">
              DEGRADÉ DE RESPALDO (cuando no hay foto)
            </label>
            <input
              id="gradient"
              name="gradient"
              value={values.gradient}
              onChange={handleChange}
              placeholder="bg-gradient-to-br from-orange-3 to-orange-6"
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white/80 placeholder:text-white/30 outline-none focus:border-white/30 transition-colors font-mono text-[13px]"
            />
          </div>
        </FormSection>

        <FormSection className="lg:col-span-3" title="Imágenes" description="Las fotos que representan a este tratamiento.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ImageCropField
              name="photo"
              label="FOTO PRINCIPAL (tarjetas y listados)"
              defaultValue={initial.photo}
              desktopAspect={2.12}
              mobileAspect={2.18}
              clearable
            />
            <div className="flex flex-col gap-2">
              <ImageUploadField
                name="heroPhoto"
                label="FOTO DEL BANNER (si no hay, usa la principal)"
                defaultValue={initial.heroPhoto}
                clearable
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-title-md text-white/35 tracking-wide">PUNTO DE ENFOQUE (solo si el banner se ve mal recortado)</span>
                <FocalPointPicker
                  name="heroFocalPosition"
                  value={values.heroFocalPosition}
                  onChange={(v) => setValues((prev) => ({ ...prev, heroFocalPosition: v }))}
                />
              </div>
            </div>
            <ImageUploadField name="teamPhoto" label="FOTO DE EQUIPO (grilla en Sobre nosotros)" defaultValue={initial.teamPhoto} clearable />
          </div>
        </FormSection>
      </div>

      <FormSection title="Galería" description="Mínimo 5 fotos para que se muestre en la página del tratamiento.">
        <DynamicImageList name="gallery" defaultValues={initial.gallery} />
      </FormSection>

      <FormSection title="Qué incluye" description="La lista de ítems que se muestra en la página del tratamiento.">
        <DynamicTextPairList
          titleName="offerTitle"
          descName="offerDesc"
          itemLabel="ítem"
          defaultValues={initial.offers}
        />
      </FormSection>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, este tratamiento desaparece del sitio."
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
          href="/admin/tratamientos"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
