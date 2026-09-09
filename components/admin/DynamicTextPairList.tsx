"use client";

import { useState } from "react";

interface DynamicTextPairListProps {
  titleName: string;
  descName: string;
  itemLabel: string;
  defaultValues: { title: string; desc: string }[];
}

let idCounter = 0;

// Add/remove list of {title, desc} pairs — used for a treatment's "Qué
// incluye" offers, and for "Diferenciales" in Sobre nosotros. Both fields
// share their form `name` across every row, so the server zips
// `formData.getAll(titleName)` with `formData.getAll(descName)` by index
// (rows are always rendered as an adjacent title+desc pair, so the two
// arrays stay aligned).
export default function DynamicTextPairList({
  titleName,
  descName,
  itemLabel,
  defaultValues,
}: DynamicTextPairListProps) {
  const [items, setItems] = useState(() =>
    (defaultValues.length > 0 ? defaultValues : [{ title: "", desc: "" }]).map((v) => ({ id: idCounter++, ...v }))
  );

  function updateField(id: number, field: "title" | "desc", value: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="relative flex flex-col gap-3 min-w-0 bg-white/[0.03] border border-white/[0.08] rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-title-md font-semibold text-white/45 tracking-wide">ÍTEM {i + 1}</span>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                className="w-6 h-6 rounded flex items-center justify-center text-title-md font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                aria-label="Quitar"
              >
                ✕
              </button>
            </div>
            <input
              name={titleName}
              value={item.title}
              onChange={(e) => updateField(item.id, "title", e.target.value)}
              placeholder={`Título — ej. "Diagnóstico digital"`}
              className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
            <input
              name={descName}
              value={item.desc}
              onChange={(e) => updateField(item.id, "desc", e.target.value)}
              placeholder="Descripción corta"
              className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { id: idCounter++, title: "", desc: "" }])}
        className="self-start px-4 py-2.5 rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium"
      >
        + Agregar {itemLabel}
      </button>
    </div>
  );
}
