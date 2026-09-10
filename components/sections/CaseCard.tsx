"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CroppedImage from "@/components/CroppedImage";

interface CaseCardProps {
  tag: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

export default function CaseCard({
  tag,
  beforePhoto = "/case-photo-before.jpg",
  afterPhoto = "/case-photo-after.jpg",
}: CaseCardProps) {
  const t = useTranslations("CaseCard");
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  useEffect(() => {
    if (!dragging) return;

    function onMove(e: PointerEvent) {
      updateFromClientX(e.clientX);
    }
    function onUp() {
      setDragging(false);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    updateFromClientX(e.clientX);
  }

  return (
    <div className="bg-black-1 rounded-2xl p-3 drop-shadow-[0px_10px_14px_rgba(0,0,0,0.14)]">
      <div className="bg-black-3 rounded-[24px] p-5 flex flex-col gap-4 items-start">
        <div className="relative h-9 w-full">
          <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-orange-6" />
          <div
            role="slider"
            aria-label={t("compararAntesDespues")}
            aria-valuenow={Math.round(position)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
              if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
            }}
            className="absolute top-0 w-9 h-9 rounded-full bg-black-1 border border-black-4 flex items-center justify-center cursor-ew-resize touch-none select-none"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          >
            <Image src="/icon-drag-handle.svg" alt="" width={16} height={16} draggable={false} className="pointer-events-none" />
          </div>
        </div>

        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          className="relative w-full h-[190px] rounded-[16px] overflow-hidden cursor-ew-resize touch-none select-none"
        >
          <CroppedImage
            src={afterPhoto}
            alt={t("despuesAlt")}
            sizes="(max-width: 768px) 90vw, 390px"
            className="pointer-events-none"
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <CroppedImage
              src={beforePhoto}
              alt={t("antesAlt")}
              sizes="(max-width: 768px) 90vw, 390px"
              className="pointer-events-none"
            />
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-black-1 pointer-events-none"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          />
        </div>

        <div className="flex justify-between w-full text-headline-sm font-medium text-black-8">
          <span>{t("antes")}</span>
          <span>{t("despues")}</span>
        </div>

        <div className="bg-black-1 border border-black-4 rounded-full px-4 py-2 flex items-center">
          <span className="text-title-lg font-medium text-black-8 tracking-[0.24px]">{tag}</span>
        </div>
      </div>
    </div>
  );
}
