"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function VideoLightboxButton({ videoUrl, size }: { videoUrl: string; size: number }) {
  const t = useTranslations("VideoLightbox");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    // Locking `body` alone still lets a little scroll leak through — `html`
    // needs to be locked in the same tick too.
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t("reproducir")}
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
              aria-label={t("cerrar")}
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white text-headline-sm"
            >
              {t("cerrarButton")}
            </button>
            <video src={videoUrl} controls autoPlay className="w-full aspect-video rounded-xl bg-black" />
          </div>
        </div>
      )}
    </>
  );
}
