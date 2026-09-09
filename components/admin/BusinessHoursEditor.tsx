"use client";

import { useState } from "react";
import Switch from "@/components/admin/Switch";
import { WEEKDAYS, WEEKDAY_LABELS, type BusinessHoursDay } from "@/lib/business-hours-shared";

interface BusinessHoursEditorProps {
  initial: BusinessHoursDay[];
}

let rangeIdCounter = 0;

interface DayState {
  weekday: string;
  isClosed: boolean;
  ranges: { id: number; start: string; end: string }[];
}

export default function BusinessHoursEditor({ initial }: BusinessHoursEditorProps) {
  const [days, setDays] = useState<DayState[]>(() =>
    WEEKDAYS.map((weekday) => {
      const found = initial.find((d) => d.weekday === weekday);
      return {
        weekday,
        isClosed: found?.isClosed ?? true,
        ranges: (found?.ranges.length ? found.ranges : [{ start: "", end: "" }]).map((r) => ({
          id: rangeIdCounter++,
          ...r,
        })),
      };
    })
  );

  function setDayClosed(weekday: string, isClosed: boolean) {
    setDays((prev) => prev.map((d) => (d.weekday === weekday ? { ...d, isClosed } : d)));
  }

  function updateRange(weekday: string, id: number, field: "start" | "end", value: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === weekday
          ? { ...d, ranges: d.ranges.map((r) => (r.id === id ? { ...r, [field]: value } : r)) }
          : d
      )
    );
  }

  function addRange(weekday: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === weekday ? { ...d, ranges: [...d.ranges, { id: rangeIdCounter++, start: "", end: "" }] } : d
      )
    );
  }

  function removeRange(weekday: string, id: number) {
    setDays((prev) =>
      prev.map((d) => (d.weekday === weekday ? { ...d, ranges: d.ranges.filter((r) => r.id !== id) } : d))
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {days.map((day) => (
        <div key={day.weekday} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-headline-sm font-semibold text-white w-24 shrink-0">
              {WEEKDAY_LABELS[day.weekday as keyof typeof WEEKDAY_LABELS]}
            </span>

            <div className="w-32 shrink-0">
              <Switch
                checked={!day.isClosed}
                onChange={(checked) => setDayClosed(day.weekday, !checked)}
                label="Abierto"
                name={`${day.weekday}_open`}
              />
            </div>

            {!day.isClosed && (
              <div className="flex flex-1 flex-wrap items-center gap-3">
                {day.ranges.map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <input
                      type="time"
                      name={`${day.weekday}_start`}
                      value={r.start}
                      onChange={(e) => updateRange(day.weekday, r.id, "start", e.target.value)}
                      className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
                    />
                    <span className="text-white/30">—</span>
                    <input
                      type="time"
                      name={`${day.weekday}_end`}
                      value={r.end}
                      onChange={(e) => updateRange(day.weekday, r.id, "end", e.target.value)}
                      className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
                    />
                    {day.ranges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRange(day.weekday, r.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-title-md font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        aria-label="Quitar horario"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addRange(day.weekday)}
                  className="px-3 py-2 rounded-md text-title-md font-medium text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  + Agregar corte
                </button>
              </div>
            )}

            {day.isClosed && <span className="text-headline-sm text-white/35">Cerrado</span>}
          </div>
        </div>
      ))}
      <p className="text-title-md text-white/35">
        &quot;Agregar corte&quot; sirve para un horario partido, por ejemplo mañana y tarde con un descanso al mediodía.
      </p>
    </div>
  );
}
