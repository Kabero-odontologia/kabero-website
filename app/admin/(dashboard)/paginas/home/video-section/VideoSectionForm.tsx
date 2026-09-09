"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageCropField from "@/components/admin/ImageCropField";
import VideoUploadField from "@/components/admin/VideoUploadField";
import SavedToast from "@/components/admin/SavedToast";
import FormSection from "@/components/admin/FormSection";
import SegmentedControl from "@/components/admin/SegmentedControl";
import Switch from "@/components/admin/Switch";
import { updateVideoSectionSection, type SectionFormState } from "../actions";
import type { VideoSectionContent } from "@/lib/page-sections/home";

const initialState: SectionFormState = {};

interface VideoSectionFormProps {
  initial: VideoSectionContent;
  visible: boolean;
}

export default function VideoSectionForm({ initial, visible: initialVisible }: VideoSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateVideoSectionSection, initialState);
  const [mediaType, setMediaType] = useState(initial.mediaType);
  const [visible, setVisible] = useState(initialVisible);

  const [values, setValues] = useState({
    eyebrowDesktop: initial.eyebrowDesktop,
    heading: initial.heading,
    stat1Value: initial.stats[0].value,
    stat1Label1: initial.stats[0].label[0],
    stat1Label2: initial.stats[0].label[1],
    stat2Value: initial.stats[1].value,
    stat2Label1: initial.stats[1].label[0],
    stat2Label2: initial.stats[1].label[1],
    stat3Value: initial.stats[2].value,
    stat3Label1: initial.stats[2].label[0],
    stat3Label2: initial.stats[2].label[1],
    locationLine1: initial.locationLine1,
    locationLine2: initial.locationLine2,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[1080px]">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <FormSection
          className="lg:col-span-2"
          title="Contenido principal"
          description="El texto que aparece sobre la imagen o el video."
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="eyebrowDesktop" className="text-title-lg font-medium text-white/60 tracking-wide">
              ANTETÍTULO (solo escritorio)
            </label>
            <input
              id="eyebrowDesktop"
              name="eyebrowDesktop"
              value={values.eyebrowDesktop}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="heading" className="text-title-lg font-medium text-white/60 tracking-wide">
              TÍTULO
            </label>
            <input
              id="heading"
              name="heading"
              value={values.heading}
              onChange={handleChange}
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-title-lg font-medium text-white/60 tracking-wide">CONTENIDO</span>
            <SegmentedControl
              value={mediaType}
              onChange={(v) => setMediaType(v as "image" | "video")}
              options={[
                { value: "image", label: "Solo imagen" },
                { value: "video", label: "Video" },
              ]}
            />
            <input type="hidden" name="mediaType" value={mediaType} />
            <span className="text-title-md text-white/35">
              {mediaType === "image" ? "No se muestra botón de play." : "Se reproduce al tocar play."}
            </span>
          </div>
        </FormSection>

        <FormSection
          className="lg:col-span-3"
          title="Multimedia"
          description="La imagen (y el video, si elegís esa opción) que se ve en la sección."
        >
          <ImageCropField
            name="backgroundPhoto"
            label="IMAGEN DE FONDO (también se usa como portada del video)"
            defaultValue={initial.backgroundPhoto}
            desktopAspect={2.74}
            mobileAspect={1.48}
          />

          {mediaType === "video" && (
            <VideoUploadField name="videoUrl" label="VIDEO" defaultValue={initial.videoUrl} />
          )}
        </FormSection>
      </div>

      <FormSection title="Franja de estadísticas" description="Se muestran en fila, debajo de la imagen o el video.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {([1, 2, 3] as const).map((n) => (
            <fieldset key={n} className="flex flex-col gap-3 bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
              <legend className="px-1 text-title-md font-semibold text-white/45 tracking-wide">
                ESTADÍSTICA {n}
              </legend>
              <div className="flex flex-col gap-1.5">
                <label className="text-title-md text-white/35 tracking-wide">VALOR</label>
                <input
                  name={`stat${n}Value`}
                  value={values[`stat${n}Value`]}
                  onChange={handleChange}
                  placeholder="3+"
                  className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-title-md text-white/35 tracking-wide">LÍNEA 1</label>
                <input
                  name={`stat${n}Label1`}
                  value={values[`stat${n}Label1`]}
                  onChange={handleChange}
                  placeholder="Especialidades"
                  className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-title-md text-white/35 tracking-wide">LÍNEA 2</label>
                <input
                  name={`stat${n}Label2`}
                  value={values[`stat${n}Label2`]}
                  onChange={handleChange}
                  placeholder="certificadas"
                  className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </fieldset>
          ))}

          <fieldset className="flex flex-col gap-3 bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
            <legend className="px-1 text-title-md font-semibold text-white/45 tracking-wide">UBICACIÓN</legend>
            <div className="flex flex-col gap-1.5">
              <label className="text-title-md text-white/35 tracking-wide">LÍNEA 1</label>
              <input
                name="locationLine1"
                value={values.locationLine1}
                onChange={handleChange}
                placeholder="Cochabamba"
                className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-title-md text-white/35 tracking-wide">LÍNEA 2</label>
              <input
                name="locationLine2"
                value={values.locationLine2}
                onChange={handleChange}
                placeholder="Bolivia"
                className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <span className="text-title-md text-white/30">Se muestra al final de la franja.</span>
          </fieldset>
        </div>
      </FormSection>

      <div className="flex flex-col gap-4">
        <div className="h-px bg-white/[0.08]" />
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, esta sección desaparece del Home."
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
