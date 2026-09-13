"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { parseImageCrop, serializeImageCrop, framingStyle, DEFAULT_FRAMING, type CropFraming } from "@/lib/image-crop";

// Editor box height budget — width is derived from this and the real aspect
// ratio (capped at 100% of the container), so a wide banner gets full width
// at a short height, and a square photo gets a compact box instead of
// stretching to the full container width.
const MAX_EDITOR_HEIGHT = 300;

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
        style={{ aspectRatio: aspect, width: `min(100%, ${MAX_EDITOR_HEIGHT * aspect}px)` }}
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
        className="relative mx-auto rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.1] cursor-move touch-none select-none"
      >
        <Image src={src} alt="" fill sizes="700px" className="object-cover pointer-events-none" style={framingStyle(framing)} />
      </div>
      <div
        style={{ width: `min(100%, ${MAX_EDITOR_HEIGHT * aspect}px)` }}
        className="mx-auto flex items-center gap-2"
      >
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

function EditFramingModal({
  label,
  src,
  desktopAspect,
  mobileAspect,
  desktop,
  mobile,
  onChangeDesktop,
  onChangeMobile,
  onClose,
}: {
  label: string;
  src: string;
  desktopAspect: number;
  mobileAspect: number;
  desktop: CropFraming;
  mobile: CropFraming;
  onChangeDesktop: (f: CropFraming) => void;
  onChangeMobile: (f: CropFraming) => void;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto bg-[#0A0A0B] border border-white/[0.1] rounded-xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-headline-md font-semibold text-white">{label}</h2>
            <p className="text-title-md text-white/40">
              Arrastrá dentro de cada vista previa para mover el punto de foco, y usá el slider para acercar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <FramingEditor breakpointLabel="DESKTOP" src={src} aspect={desktopAspect} framing={desktop} onChange={onChangeDesktop} />
          <FramingEditor breakpointLabel="MOBILE" src={src} aspect={mobileAspect} framing={mobile} onChange={onChangeMobile} />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="self-end inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold text-white px-6 py-3 mt-2"
        >
          Listo
        </button>
      </div>
    </div>
  );
}

// Upload + per-breakpoint pan/zoom framing. Stays compact by default (just a
// thumbnail + Cambiar/Editar) — the full dual desktop/mobile crop editor only
// shows up in a modal once you click Editar, instead of always being expanded
// inline (which got noisy fast once a form had more than one of these).
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
  const [editing, setEditing] = useState(false);

  // The full-screen overlay already blocks clicks to anything behind it, but
  // without this the page underneath still scrolls with it (e.g. via trackpad
  // or arrow keys) while the modal is open. Locking `body` alone still lets a
  // little scroll leak through — `html` needs to be locked in the same tick too.
  useEffect(() => {
    if (!editing) return;
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [editing]);

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
    <div className="flex flex-col gap-2 min-w-0">
      <label className="text-title-lg font-medium text-white/60 tracking-wide">{label}</label>
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-col gap-3 min-w-0">
        <div className="relative w-full h-44 rounded-md overflow-hidden bg-white/[0.03] border border-white/[0.1]">
          {src ? (
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
              style={framingStyle(desktop)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/25">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="cursor-pointer px-3 py-2 rounded-md bg-white/[0.08] backdrop-blur-md border border-white/[0.15] text-white text-title-md font-medium hover:bg-white/[0.14] transition-colors whitespace-nowrap">
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
            {src && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-3 py-2 rounded-md bg-white/[0.06] border border-white/10 text-white/80 text-title-md font-medium hover:bg-white/[0.1] hover:text-white transition-colors whitespace-nowrap"
              >
                Editar
              </button>
            )}
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
          </div>
          {uploading && <span className="text-title-md text-white/45">Subiendo…</span>}
          {error && <span className="text-title-md text-red-400">{error}</span>}
        </div>
      </div>

      {editing && src && (
        <EditFramingModal
          label={label}
          src={src}
          desktopAspect={desktopAspect}
          mobileAspect={mobileAspect}
          desktop={desktop}
          mobile={mobile}
          onChangeDesktop={setDesktop}
          onChangeMobile={setMobile}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
