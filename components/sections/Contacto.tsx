"use client";

import { useEffect, useRef, useState } from "react";
import type { ContactoContent } from "@/lib/page-sections/home";
import { WEEKDAY_LABELS, formatDayHours, isOpenAt, type BusinessHoursDay } from "@/lib/business-hours-shared";

const SCHEDULE_CARD_WIDTH = 628;

function isOpenNowInBolivia(hours: BusinessHoursDay[]): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/La_Paz",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const nowMinutes = parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10);
  return isOpenAt(hours, map.weekday, nowMinutes);
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="10" stroke="#EE742F" strokeWidth="1.5" />
      <path d="M11 6.5V11L13.5 13.5" stroke="#EE742F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusBadge({ hours }: { hours: BusinessHoursDay[] }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    // Reads the real wall clock, so it can only be known client-side after mount (avoids SSR/hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(isOpenNowInBolivia(hours));
    const id = setInterval(() => setOpen(isOpenNowInBolivia(hours)), 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (open === null) return <span className="h-[34px] lg:h-[34px]" />;

  return (
    <span
      className={`text-title-lg lg:text-headline-sm font-semibold px-3 py-2 rounded-full flex items-center gap-2 shrink-0 ${
        open ? "bg-green-10 text-green-5" : "bg-black-3 text-black-8"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-5" : "bg-black-6"}`} />
      {open ? "Abierto ahora" : "Cerrado ahora"}
    </span>
  );
}

function MapEmbed({ mapsQuery, className = "" }: { mapsQuery: string; className?: string }) {
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=16&output=embed`;
  return (
    <iframe
      title="Ubicación de Kabero Odontología Estética en Google Maps"
      src={embedSrc}
      className={className}
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function ScheduleCard({
  mapsLink,
  hours,
  className = "",
}: {
  mapsLink: string;
  hours: BusinessHoursDay[];
  className?: string;
}) {
  return (
    <div className={`bg-black-11 rounded-[22px] lg:rounded-xl p-5 lg:p-8 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-[34px] h-[34px] shrink-0 rounded-full flex items-center justify-center">
            <IconClock className="w-6 h-6" />
          </span>
          <span className="text-headline-md font-semibold text-black-1">Horario de atención</span>
        </div>
        <StatusBadge hours={hours} />
      </div>

      <div className="h-px bg-black-1/20 lg:bg-black-1 w-full" />

      {hours.map((day) => {
        const label = formatDayHours(day);
        return (
          <div key={day.weekday} className="flex justify-between lg:px-4 py-2 lg:rounded-[8px] text-headline-sm">
            <span className="text-black-1">{WEEKDAY_LABELS[day.weekday]}</span>
            <span className={label === "Cerrado" ? "text-black-6 lg:text-black-8" : "text-black-1 font-semibold"}>
              {label}
            </span>
          </div>
        );
      })}

      <div className="h-px bg-black-1/20 lg:bg-black-1 w-full" />

      {/* Mobile: "Bioseguridad certificada" + link, stacked and left-aligned */}
      <div className="flex lg:hidden flex-col gap-3 items-start pt-1">
        <span className="flex items-center gap-2 text-[12px] text-black-1">
          <span className="text-orange-6 text-[11px]">✓</span> Bioseguridad certificada
        </span>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium text-black-1"
        >
          Ver en Google Maps →
        </a>
      </div>

      {/* Desktop: just the centered link */}
      <div className="hidden lg:flex justify-center pt-1">
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-headline-sm font-medium text-black-1"
        >
          Ver en Google Maps →
        </a>
      </div>
    </div>
  );
}

interface ContactoProps {
  content: ContactoContent;
  mapsQuery: string;
  mapsLink: string;
  businessHours: BusinessHoursDay[];
}

export default function Contacto({ content, mapsQuery, mapsLink, businessHours }: ContactoProps) {
  const mobileCardRef = useRef<HTMLDivElement>(null);
  const [mobileCardHeight, setMobileCardHeight] = useState(508); // measured fallback, corrected on mount/resize

  useEffect(() => {
    const el = mobileCardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setMobileCardHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="horario" className="flex flex-col gap-6 lg:gap-10 items-start scroll-mt-24">
      <div className="flex flex-col gap-3 items-start">
        <span className="text-title-lg font-medium text-orange-6 tracking-wide">{content.eyebrow}</span>
        <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{content.title}</h2>
      </div>

      {/* Mobile: map fills the space above the card, schedule overlaps the bottom.
          Container height tracks the card's real height + a guaranteed map strip, so the map
          never gets squeezed down to nothing if the card grows (e.g. more schedule rows). */}
      <div className="lg:hidden bg-black-1 rounded-[28px] shadow-[0px_14px_36px_0px_rgba(0,0,0,0.14)] p-2 w-full">
        <div
          className="relative rounded-[28px] overflow-hidden bg-[#EAEAEA] flex flex-col justify-end p-2"
          style={{ height: mobileCardHeight + 8 + 300 }}
        >
          {/* Map is confined to the strip above the (opaque) card so Google centers the pin in the visible area */}
          <div className="absolute top-0 left-0 right-0" style={{ bottom: mobileCardHeight + 8 }}>
            <MapEmbed mapsQuery={mapsQuery} className="w-full h-full" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/0 to-[#EAEAEA]/40"
          />
          <div ref={mobileCardRef} className="relative">
            <ScheduleCard mapsLink={mapsLink} hours={businessHours} />
          </div>
        </div>
      </div>

      {/* Desktop: schedule card floats over the map, height driven by the card so the 8px gap is exact */}
      <div className="hidden lg:block bg-black-1 rounded-2xl shadow-[0px_14px_36px_0px_rgba(0,0,0,0.14)] p-3 w-full">
        <div className="relative w-full rounded-xl border border-black-4 overflow-hidden bg-[#EAEAEA] flex items-center justify-end p-2">
          {/* Map is confined to the strip left of the (opaque) card so Google centers the pin in the visible area */}
          <div className="absolute top-0 left-0 bottom-0" style={{ width: `calc(100% - ${SCHEDULE_CARD_WIDTH + 8}px)` }}>
            <MapEmbed mapsQuery={mapsQuery} className="w-full h-full" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(90.42deg, rgba(255,255,255,0) 40.658%, rgb(234,234,234) 99.836%)",
            }}
          />
          <ScheduleCard mapsLink={mapsLink} hours={businessHours} className="relative w-[628px] shrink-0" />
        </div>
      </div>
    </section>
  );
}
