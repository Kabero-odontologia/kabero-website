import "server-only";
import { prisma } from "@/lib/db";
import { WEEKDAYS, type BusinessHoursDay } from "./business-hours-shared";

export * from "./business-hours-shared";

// A missing row (shouldn't happen once seeded, but a fresh/edited DB shouldn't
// crash the page) degrades to "closed" for that day.
export async function getBusinessHours(): Promise<BusinessHoursDay[]> {
  const rows = await prisma.businessHours.findMany();
  const byWeekday = new Map(rows.map((r) => [r.weekday, r]));

  return WEEKDAYS.map((weekday) => {
    const row = byWeekday.get(weekday);
    if (!row) return { weekday, isClosed: true, ranges: [] };
    return { weekday, isClosed: row.isClosed, ranges: row.ranges as unknown as BusinessHoursDay["ranges"] };
  });
}
