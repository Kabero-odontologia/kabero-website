import "server-only";
import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { translateFields, TARGET_LANGS } from "@/lib/translate";
import { flattenTranslatable, applyTranslatedOverrides } from "@/lib/page-sections/translation-adapters";

export interface PageSectionResult<T> {
  content: T;
  visible: boolean;
}

// Generic single-section read: missing row, or content that fails validation
// (e.g. hand-edited in Prisma Studio), falls back to `fallback` — a literal copy
// of the site's current hardcoded text — so a bad row degrades to today's exact
// behavior instead of crashing the page. `visible` defaults to true when the row
// doesn't exist yet (a section that was never saved should still render).
//
// `locale` merges the cached translation (if any) over the Spanish content
// field-by-field, so a partially-translated row never blanks out a field that
// hasn't been translated yet — it just shows that one field in Spanish.
export async function getPageSection<T>(
  page: string,
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
  locale: string = "es"
): Promise<PageSectionResult<T>> {
  const row = await prisma.pageSection.findUnique({ where: { page_key: { page, key } } });
  if (!row) return { content: fallback, visible: true };
  const parsed = schema.safeParse(row.content);
  const content = parsed.success ? parsed.data : fallback;
  return { content: localize(content, row.translations, locale), visible: row.visible };
}

export function localize<T>(content: T, translations: unknown, locale: string): T {
  if (locale === "es" || !translations || typeof translations !== "object") return content;
  const forLocale = (translations as Record<string, Record<string, string>>)[locale];
  if (!forLocale) return content;
  return applyTranslatedOverrides(content, forLocale);
}

// Shared by every `paginas/*/actions.ts` (previously each had its own
// near-identical copy). Translates the content synchronously before writing —
// see lib/translate.ts for why this blocks the save instead of running after
// it — so a `revalidateLocalized()` right after this always regenerates every
// locale with up-to-date text, never a stale/untranslated version.
export async function upsertPageSection(page: string, key: string, content: object, visible: boolean): Promise<void> {
  const flat = flattenTranslatable(content);
  const translations = await translateFields(flat, TARGET_LANGS);
  await prisma.pageSection.upsert({
    where: { page_key: { page, key } },
    update: { content, visible, translations },
    create: { page, key, content, visible, translations },
  });
}

// Revalidates a path across all locales. Spanish is served unprefixed
// ("/sobre-nosotros") via next-intl's internal rewrite of the default locale,
// but the actual route Next.js caches is the underlying "/es/sobre-nosotros" —
// revalidating only the external unprefixed path leaves that cache entry
// untouched, so /en and /pt-BR update live but Spanish stays stuck on stale
// content. Busting both the bare path and the explicit "/es/..." form covers it.
export function revalidateLocalized(path: string): void {
  revalidatePath(path);
  for (const locale of ["es", ...TARGET_LANGS] satisfies readonly string[]) {
    revalidatePath(`/${locale}${path === "/" ? "" : path}`);
  }
}
