"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import FormSection from "@/components/admin/FormSection";
import Switch from "@/components/admin/Switch";
import type { FAQFormState } from "./actions";

interface FAQFormProps {
  action: (prevState: FAQFormState, formData: FormData) => Promise<FAQFormState>;
  initial?: { question: string; answer: string; visible: boolean };
  submitLabel: string;
}

const initialState: FAQFormState = {};

export default function FAQForm({ action, initial, submitLabel }: FAQFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [visible, setVisible] = useState(initial?.visible ?? true);

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[640px]">
      <div className="flex flex-col gap-4">
        <Switch
          name="visible"
          checked={visible}
          onChange={setVisible}
          label="Visible en el sitio público"
          description="Si lo apagás, esta pregunta desaparece del sitio."
        />
        <div className="h-px bg-white/[0.08]" />
      </div>

      <FormSection title="Pregunta y respuesta" description="Se muestra en la página de Tratamientos.">
        <div className="flex flex-col gap-2">
          <label htmlFor="question" className="text-title-lg font-medium text-white/60 tracking-wide">
            PREGUNTA
          </label>
          <input
            id="question"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="answer" className="text-title-lg font-medium text-white/60 tracking-wide">
            RESPUESTA
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-md px-4 py-3 text-headline-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>
      </FormSection>

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
          href="/admin/preguntas-frecuentes"
          className="inline-flex items-center justify-center rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium px-6 py-3.5"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
