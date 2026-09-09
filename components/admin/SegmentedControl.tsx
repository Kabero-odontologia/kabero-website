interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedOption[];
}

// A visible choice between a small, fixed set of options — reads as one
// control instead of a loose pair of radio buttons. Purely visual/stateful;
// the parent is responsible for mirroring `value` into a hidden input so the
// choice actually reaches the server action.
export default function SegmentedControl({ value, onChange, options }: SegmentedControlProps) {
  return (
    <div className="inline-flex p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] gap-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-md text-headline-sm font-medium transition-colors ${
              active
                ? "bg-white/[0.10] border border-white/[0.14] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
                : "border border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
