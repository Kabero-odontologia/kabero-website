import "server-only";
import type { z } from "zod";
import { prisma } from "@/lib/db";

export interface PageSectionResult<T> {
  content: T;
  visible: boolean;
}

// Generic single-section read: missing row, or content that fails validation
// (e.g. hand-edited in Prisma Studio), falls back to `fallback` — a literal copy
// of the site's current hardcoded text — so a bad row degrades to today's exact
// behavior instead of crashing the page. `visible` defaults to true when the row
// doesn't exist yet (a section that was never saved should still render).
export async function getPageSection<T>(
  page: string,
  key: string,
  schema: z.ZodType<T>,
  fallback: T
): Promise<PageSectionResult<T>> {
  const row = await prisma.pageSection.findUnique({ where: { page_key: { page, key } } });
  if (!row) return { content: fallback, visible: true };
  const parsed = schema.safeParse(row.content);
  return { content: parsed.success ? parsed.data : fallback, visible: row.visible };
}
