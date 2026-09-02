"use client";

import Image from "next/image";
import { useState } from "react";

interface TreatmentOption {
  id: string;
  title: string;
  photo: string | null;
}

interface TreatmentMultiSelectProps {
  name: string;
  treatments: TreatmentOption[];
  defaultSelectedIds: string[];
  min?: number;
  max?: number;
}

export default function TreatmentMultiSelect({
  name,
  treatments,
  defaultSelectedIds,
  min = 2,
  max = 4,
}: TreatmentMultiSelectProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelectedIds);
  const byId = new Map(treatments.map((t) => [t.id, t]));

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < max ? [...prev, id] : prev));
  }

  function move(id: string, direction: "up" | "down") {
    setSelected((prev) => {
      const i = prev.indexOf(id);
      const j = direction === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {selected.map((id) => id).map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-title-md font-medium text-white/40 tracking-wide">
            ELEGIDAS (en este orden)
          </span>
          <div className="flex flex-col gap-2">
            {selected.map((id, i) => {
              const t = byId.get(id);
              if (!t) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.10] rounded-md px-3 py-2"
                >
                  <div className="relative w-9 h-9 rounded shrink-0 overflow-hidden bg-white/[0.06]">
                    {t.photo && <Image src={t.photo} alt="" fill sizes="36px" className="object-cover" />}
                  </div>
                  <span className="flex-1 text-headline-sm text-white">{t.title}</span>
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(id, "up")}
                    className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-25 transition-colors"
                    aria-label="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i === selected.length - 1}
                    onClick={() => move(id, "down")}
                    className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-25 transition-colors"
                    aria-label="Mover abajo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    className="w-7 h-7 rounded flex items-center justify-center text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    aria-label="Quitar"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-title-md font-medium text-white/40 tracking-wide">TODOS LOS TRATAMIENTOS</span>
        <div className="flex flex-col gap-1">
          {treatments.map((t) => {
            const checked = selected.includes(t.id);
            const disabled = !checked && selected.length >= max;
            return (
              <label
                key={t.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  disabled ? "opacity-40" : "cursor-pointer hover:bg-white/[0.05]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(t.id)}
                  className="w-4 h-4 rounded accent-white"
                />
                <div className="relative w-8 h-8 rounded shrink-0 overflow-hidden bg-white/[0.06]">
                  {t.photo && <Image src={t.photo} alt="" fill sizes="32px" className="object-cover" />}
                </div>
                <span className="text-headline-sm text-white/80">{t.title}</span>
              </label>
            );
          })}
        </div>
      </div>

      <span className={`text-title-md ${selected.length < min ? "text-red-400" : "text-white/40"}`}>
        {selected.length < min
          ? `Elegí al menos ${min} (llevás ${selected.length})`
          : `${selected.length} de ${max} elegidas`}
      </span>
    </div>
  );
}
