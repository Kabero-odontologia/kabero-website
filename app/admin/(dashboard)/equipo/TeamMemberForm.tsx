"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { TeamMemberFormState } from "./actions";

interface TeamMemberFormProps {
  action: (prevState: TeamMemberFormState, formData: FormData) => Promise<TeamMemberFormState>;
  initial?: { name: string; specialty: string; photo: string | null; visible: boolean };
  submitLabel: string;
}

const initialState: TeamMemberFormState = {};

export default function TeamMemberForm({ action, initial, submitLabel }: TeamMemberFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [name, setName] = useState(initial?.name ?? "");
  const [specialty, setSpecialty] = useState(initial?.specialty ?? "");
  const [visible, setVisible] = useState(initial?.visible ?? true);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[640px]">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-title-lg font-medium text-white/60 tracking-wide">
          NOMBRE
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="specialty" className="text-title-lg font-medium text-white/60 tracking-wide">
          ESPECIALIDAD
        </label>
        <input
          id="specialty"
          name="specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Especialista certificado"
          className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <ImageUploadField name="photo" label="FOTO" defaultValue={initial?.photo ?? null} />

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
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link
          href="/admin/equipo"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
