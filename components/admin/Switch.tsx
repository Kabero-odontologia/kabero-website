interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  name?: string;
}

// Boolean control styled as a real switch instead of a native checkbox —
// used wherever a form toggles something on/off (e.g. section visibility).
// The visible control is a plain button; a hidden checkbox mirrors its state
// so the form still submits `name=on` exactly like a native checkbox would.
export default function Switch({ checked, onChange, label, description, name }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-headline-sm font-medium text-white">{label}</span>
        {description && <span className="text-title-md text-white/40">{description}</span>}
      </div>
      {name && <input type="checkbox" name={name} checked={checked} readOnly hidden />}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
          checked ? "bg-white/85" : "bg-white/[0.14]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
            checked ? "translate-x-5 bg-black-11" : "translate-x-0 bg-white/70"
          }`}
        />
      </button>
    </div>
  );
}
