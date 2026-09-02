"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import VideoUploadField from "@/components/admin/VideoUploadField";
import SavedToast from "@/components/admin/SavedToast";
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
    <form action={formAction} className="flex flex-col gap-6 max-w-[560px]">
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

      <ImageUploadField
        name="backgroundPhoto"
        label="IMAGEN DE FONDO (también se usa como portada del video)"
        defaultValue={initial.backgroundPhoto}
      />

      <div className="flex flex-col gap-2">
        <span className="text-title-lg font-medium text-white/60 tracking-wide">CONTENIDO</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mediaType"
              value="image"
              checked={mediaType === "image"}
              onChange={() => setMediaType("image")}
              className="w-4 h-4 accent-white"
            />
            <span className="text-headline-sm text-white/80">Solo imagen (sin botón de play)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mediaType"
              value="video"
              checked={mediaType === "video"}
              onChange={() => setMediaType("video")}
              className="w-4 h-4 accent-white"
            />
            <span className="text-headline-sm text-white/80">Video (se reproduce al tocar play)</span>
          </label>
        </div>
      </div>

      {mediaType === "video" && (
        <VideoUploadField name="videoUrl" label="VIDEO" defaultValue={initial.videoUrl} />
      )}

      <div className="flex flex-col gap-3">
        <span className="text-title-lg font-medium text-white/60 tracking-wide">FRANJA DE ESTADÍSTICAS</span>
        {([1, 2, 3] as const).map((n) => (
          <div key={n} className="grid grid-cols-3 gap-3">
            <input
              name={`stat${n}Value`}
              value={values[`stat${n}Value`]}
              onChange={handleChange}
              placeholder="3+"
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-2.5 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
            <input
              name={`stat${n}Label1`}
              value={values[`stat${n}Label1`]}
              onChange={handleChange}
              placeholder="Línea 1"
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-2.5 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
            <input
              name={`stat${n}Label2`}
              value={values[`stat${n}Label2`]}
              onChange={handleChange}
              placeholder="Línea 2"
              className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-2.5 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <input
            name="locationLine1"
            value={values.locationLine1}
            onChange={handleChange}
            placeholder="Cochabamba"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-2.5 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
          />
          <input
            name="locationLine2"
            value={values.locationLine2}
            onChange={handleChange}
            placeholder="Bolivia"
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-2.5 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
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
