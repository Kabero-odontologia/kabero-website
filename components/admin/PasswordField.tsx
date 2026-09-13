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
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.5A9.9 9.9 0 0112 5c5.5 0 9 5 9.5 7-.24.94-1 2.6-2.4 4.1M6.3 6.6C4.2 8 2.8 9.9 2.5 12c.5 2 4 7 9.5 7 1.2 0 2.3-.24 3.3-.66"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
