"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  clearable?: boolean;
}

export default function ImageUploadField({ name, label, defaultValue, clearable = false }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir la imagen");
      setValue(data.url);
      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <label className="text-title-lg font-medium text-white/60 tracking-wide">{label}</label>
      <input type="hidden" name={name} value={value} />

      <div className="relative w-full max-w-[440px] aspect-video rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.1]">
        {preview ? (
          <Image src={preview} alt="" fill sizes="320px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/25">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-title-md">Sin imagen</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black-11/70">
            <span className="text-headline-sm font-medium text-white">Subiendo…</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer px-3 py-2 rounded-md bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white text-headline-sm font-medium hover:bg-white/[0.14] transition-colors whitespace-nowrap">
          {preview ? "Cambiar" : "Subir"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        {clearable && preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setValue("");
              setError(null);
            }}
            className="px-2 py-2 text-title-md font-medium text-white/45 hover:text-white/70 transition-colors whitespace-nowrap"
          >
            Quitar
          </button>
        )}
      </div>
      {error && <span className="text-title-md text-red-400">{error}</span>}
    </div>
  );
}
