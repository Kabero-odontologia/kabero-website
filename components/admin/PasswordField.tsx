"use client";

import { useState } from "react";

interface PasswordFieldProps {
  id: string;
  name?: string;
  label: string;
  autoComplete: string;
  placeholder?: string;
  required?: boolean;
}

export default function PasswordField({
  id,
  name = id,
  label,
  autoComplete,
  placeholder,
  required,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-title-lg font-medium text-white/60 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/[0.06] border border-white/10 rounded-md pl-4 pr-14 py-3 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 focus:bg-white/[0.09] transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Ver contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-title-md font-medium text-white/40 hover:text-white/80 transition-colors px-1"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>
  );
}
