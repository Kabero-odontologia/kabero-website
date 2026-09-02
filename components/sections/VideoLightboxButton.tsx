"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function VideoLightboxButton({ videoUrl, size }: { videoUrl: string; size: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Reproducir video"
        onClick={() => setOpen(true)}
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <Image src="/icon-play.svg" alt="" fill sizes={`${size}px`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-[960px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Cerrar video"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white text-headline-sm"
            >
              Cerrar ✕
            </button>
            <video src={videoUrl} controls autoPlay className="w-full aspect-video rounded-xl bg-black" />
          </div>
        </div>
      )}
    </>
  );
}
