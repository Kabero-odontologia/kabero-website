"use client";

interface FocalPointPickerProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const POSITIONS = [
  ["0% 0%", "50% 0%", "100% 0%"],
  ["0% 50%", "50% 50%", "100% 50%"],
  ["0% 100%", "50% 100%", "100% 100%"],
];

// Lets someone pick which part of a photo stays visible if it gets cropped —
// without needing to know it's actually setting a CSS object-position value.
// A raw text fallback stays available for the rare case a value doesn't match
// one of these 9 points (e.g. a value fine-tuned before this picker existed).
export default function FocalPointPicker({ name, value, onChange }: FocalPointPickerProps) {
  const normalized = value.trim() || "50% 50%";
  const isCustom = !POSITIONS.some((row) => row.includes(normalized));

  return (
    <div className="flex items-start gap-4">
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] w-fit shrink-0">
        {POSITIONS.flat().map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => onChange(pos)}
            aria-label={`Punto de enfoque ${pos}`}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
              normalized === pos ? "bg-white/[0.16] border border-white/[0.24]" : "border border-transparent hover:bg-white/[0.06]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${normalized === pos ? "bg-white" : "bg-white/25"}`} />
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className="text-title-md text-white/35">
          Qué parte de la foto se prioriza si hay que recortarla.
        </span>
        {isCustom && (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="50% 50%"
            className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white/80 placeholder:text-white/30 outline-none focus:border-white/30 transition-colors font-mono text-[13px] w-32"
          />
        )}
      </div>
    </div>
  );
}
