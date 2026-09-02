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
    <div className="flex flex-col gap-2">
      <label className="text-title-lg font-medium text-white/60 tracking-wide">{label}</label>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-md overflow-hidden bg-white/[0.04] border border-white/[0.1] shrink-0">
          {preview ? (
            <Image src={preview} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/25 text-title-md text-center px-2">
              Sin foto
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label className="cursor-pointer px-4 py-2.5 rounded-md bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white text-headline-sm font-medium hover:bg-white/[0.14] transition-colors">
            {uploading ? "Subiendo…" : preview ? "Cambiar imagen" : "Subir imagen"}
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
              className="px-2 text-title-md font-medium text-white/45 hover:text-white/70 transition-colors"
            >
              Quitar imagen
            </button>
          )}
        </div>
      </div>
      {error && <span className="text-title-md text-red-400">{error}</span>}
    </div>
  );
}
