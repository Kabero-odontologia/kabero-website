"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { parseImageCrop, serializeImageCrop, framingStyle, DEFAULT_FRAMING, type CropFraming } from "@/lib/image-crop";

interface ImageCropFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  /** Width / height of the desktop preview frame — match the real container on the public page. */
  desktopAspect?: number;
  /** Width / height of the mobile preview frame — match the real container on the public page. */
  mobileAspect?: number;
  clearable?: boolean;
}

function FramingEditor({
  breakpointLabel,
  src,
  aspect,
  framing,
  onChange,
}: {
  breakpointLabel: string;
  src: string;
  aspect: number;
  framing: CropFraming;
  onChange: (f: CropFraming) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function setFromPointer(clientX: number, clientY: number) {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onChange({ ...framing, x, y });
  }

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <span className="text-title-md font-medium text-white/50">{breakpointLabel}</span>
      <div
        ref={boxRef}
        style={{ aspectRatio: aspect }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (dragging.current) setFromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        className="relative w-full rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.1] cursor-move touch-none select-none"
      >
        <Image src={src} alt="" fill sizes="360px" className="object-cover pointer-events-none" style={framingStyle(framing)} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-title-md text-white/40 shrink-0">Zoom</span>
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.05}
          value={framing.zoom}
          onChange={(e) => onChange({ ...framing, zoom: parseFloat(e.target.value) })}
          className="w-full accent-white/70"
        />
        {(framing.x !== 50 || framing.y !== 50 || framing.zoom !== 1) && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FRAMING)}
            className="shrink-0 text-title-md text-white/45 hover:text-white/80 transition-colors whitespace-nowrap"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}

// Upload + per-breakpoint pan/zoom framing editor. Arrastrá dentro de cada
// vista previa para mover el punto de foco, y usá el slider para acercar —
// la vista previa es exactamente el recorte que se va a ver en el sitio
// (mismo aspect-ratio que el contenedor real), así que lo que se ve ahí es
// lo que queda, y lo que no entra en el recuadro es lo que se corta.
export default function ImageCropField({
  name,
  label,
  defaultValue,
  desktopAspect = 16 / 9,
  mobileAspect = 4 / 5,
  clearable = false,
}: ImageCropFieldProps) {
  const initial = parseImageCrop(defaultValue);
  const [src, setSrc] = useState<string | null>(initial?.src ?? null);
  const [desktop, setDesktop] = useState<CropFraming>(initial?.desktop ?? DEFAULT_FRAMING);
  const [mobile, setMobile] = useState<CropFraming>(initial?.mobile ?? DEFAULT_FRAMING);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = src ? serializeImageCrop({ src, desktop, mobile }) : "";

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir la imagen");
      setSrc(data.url);
      setDesktop(DEFAULT_FRAMING);
      setMobile(DEFAULT_FRAMING);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <label className="text-title-lg font-medium text-white/60 tracking-wide">{label}</label>
        <div className="flex items-center gap-2">
          {clearable && src && (
            <button
              type="button"
              onClick={() => {
                setSrc(null);
                setDesktop(DEFAULT_FRAMING);
                setMobile(DEFAULT_FRAMING);
              }}
              className="px-2 text-title-md font-medium text-white/45 hover:text-white/70 transition-colors whitespace-nowrap"
            >
              Quitar
            </button>
          )}
          <label className="cursor-pointer px-3 py-2 rounded-md bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white text-headline-sm font-medium hover:bg-white/[0.14] transition-colors whitespace-nowrap">
            {src ? "Cambiar" : "Subir"}
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
        </div>
      </div>
      <input type="hidden" name={name} value={value} />

      {uploading && <span className="text-title-md text-white/45">Subiendo…</span>}
      {error && <span className="text-title-md text-red-400">{error}</span>}

      {src ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FramingEditor breakpointLabel="DESKTOP" src={src} aspect={desktopAspect} framing={desktop} onChange={setDesktop} />
          <FramingEditor breakpointLabel="MOBILE" src={src} aspect={mobileAspect} framing={mobile} onChange={setMobile} />
        </div>
      ) : (
        <div className="w-full max-w-[440px] aspect-video rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.1] flex flex-col items-center justify-center gap-2 text-white/25">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-title-md">Sin imagen</span>
        </div>
      )}
    </div>
  );
}
