// Pure helpers with no server-only imports, so client components (the "open
// now" status badge) can use them too — the actual DB read lives in
// `business-hours.ts` (server-only) and passes its result down as a prop.

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  Mon: "Lunes",
  Tue: "Martes",
  Wed: "Miércoles",
  Thu: "Jueves",
  Fri: "Viernes",
  Sat: "Sábado",
  Sun: "Domingo",
};

export interface TimeRange {
  start: string;
  end: string;
}

export interface BusinessHoursDay {
  weekday: Weekday;
  isClosed: boolean;
  ranges: TimeRange[];
}

export function formatDayHours(day: BusinessHoursDay, closedLabel: string): string {
  if (day.isClosed || day.ranges.length === 0) return closedLabel;
  return day.ranges.map((r) => `${r.start} – ${r.end}`).join(" y ");
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

// Takes already-fetched hours and today's weekday/time, so a "use client"
// component can call this on every tick without touching the database.
export function isOpenAt(hours: BusinessHoursDay[], weekday: string, nowMinutes: number): boolean {
  const today = hours.find((d) => d.weekday === weekday);
  if (!today || today.isClosed) return false;
  return today.ranges.some((r) => nowMinutes >= toMinutes(r.start) && nowMinutes < toMinutes(r.end));
}
