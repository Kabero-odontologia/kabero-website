"use client";

import { useState } from "react";

interface VideoUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
}

export default function VideoUploadField({ name, label, defaultValue }: VideoUploadFieldProps) {
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
      if (!res.ok) throw new Error(data.error ?? "Error al subir el video");
      setValue(data.url);
      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el video");
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
          <video src={preview} muted className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/25">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2.5" y="5.5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16.5 10l5-2.5v9l-5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="text-title-md">Sin video</span>
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
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        {preview && (
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
