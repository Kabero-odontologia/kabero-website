"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SavedToast from "@/components/admin/SavedToast";
import { updateFundadorSection, type SectionFormState } from "../actions";
import type { FundadorContent } from "@/lib/page-sections/sobre-nosotros";

const initialState: SectionFormState = {};

interface FundadorSectionFormProps {
  initial: FundadorContent;
  visible: boolean;
}

let tagIdCounter = 0;

export default function FundadorSectionForm({ initial, visible: initialVisible }: FundadorSectionFormProps) {
  const [state, formAction, pending] = useActionState(updateFundadorSection, initialState);

  const [values, setValues] = useState({
    eyebrow: initial.eyebrow,
    sectionTitle: initial.sectionTitle,
    name: initial.name,
    role: initial.role,
    bio: initial.bio,
  });
  const [tags, setTags] = useState(() => initial.tags.map((value) => ({ id: tagIdCounter++, value })));
  const [visible, setVisible] = useState(initialVisible);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function updateTag(id: number, value: string) {
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, value } : t)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[560px]">
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
        <label htmlFor="sectionTitle" className="text-title-lg font-medium text-white/60 tracking-wide">
          TÍTULO DE LA SECCIÓN
        </label>
        <input
          id="sectionTitle"
          name="sectionTitle"
          value={values.sectionTitle}
          onChange={handleChange}
          placeholder="Fundador"
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="h-px bg-white/[0.08]" />

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-title-lg font-medium text-white/60 tracking-wide">
          NOMBRE
        </label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="text-title-lg font-medium text-white/60 tracking-wide">
          CARGO
        </label>
        <input
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          placeholder="Odontología estética · Fundador de Kabero"
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bio" className="text-title-lg font-medium text-white/60 tracking-wide">
          BIOGRAFÍA
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={values.bio}
          onChange={handleChange}
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
        />
      </div>

      <ImageUploadField name="photo" label="FOTO" defaultValue={initial.photo} />

      <div className="flex flex-col gap-2">
        <span className="text-title-lg font-medium text-white/60 tracking-wide">ETIQUETAS (especialidades)</span>
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2">
              <input
                name="tag"
                value={tag.value}
                onChange={(e) => updateTag(tag.id, e.target.value)}
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-md px-4 py-2.5 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setTags((prev) => prev.filter((t) => t.id !== tag.id))}
                className="px-3 py-2 rounded text-title-md font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTags((prev) => [...prev, { id: tagIdCounter++, value: "" }])}
          className="self-start px-4 py-2.5 rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium"
        >
          + Agregar etiqueta
        </button>
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
