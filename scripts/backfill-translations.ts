// One-off script: translates every existing row that predates the i18n
// feature (translations column still NULL) into en/pt-BR and saves the
// result, using the exact same MyMemory client and PageSection flatten/
// unflatten adapter as the live admin save path (lib/translate.ts,
// lib/page-sections/translation-adapters.ts) — just inlined here instead of
// imported, since lib/translate.ts is guarded with `import "server-only"`,
// which throws unconditionally outside Next's own server bundling and would
// break a plain `tsx` run. Run once: `npx tsx scripts/backfill-translations.ts`.
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { flattenTranslatable } from "../lib/page-sections/translation-adapters";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_CHUNK_BYTES = 450;
const TARGET_LANGS = ["en", "pt-BR"] as const;
type TargetLang = (typeof TARGET_LANGS)[number];

function utf8ByteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

function splitIntoChunks(text: string): string[] {
  if (utf8ByteLength(text) <= MAX_CHUNK_BYTES) return [text];
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && utf8ByteLength(current + sentence) > MAX_CHUNK_BYTES) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateChunk(text: string, langpair: string): Promise<string> {
  const url = new URL(MYMEMORY_ENDPOINT);
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", langpair);
  if (process.env.MYMEMORY_CONTACT_EMAIL) url.searchParams.set("de", process.env.MYMEMORY_CONTACT_EMAIL);

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const raw = data?.responseData?.translatedText;
  if (typeof raw !== "string" || !raw) throw new Error(`MyMemory returned no translation for ${langpair}`);
  if (raw.toUpperCase().includes("MYMEMORY WARNING")) throw new Error(raw);
  return raw.replace(/\s+/g, " ").trim();
}

async function translateText(text: string, targetLang: TargetLang): Promise<string> {
  if (!text.trim()) return text;
  const langpair = `es|${targetLang}`;
  const translated: string[] = [];
  for (const chunk of splitIntoChunks(text)) translated.push(await translateChunk(chunk, langpair));
  return translated.join(" ");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sequential, with a short pause between calls — unlike the live admin path
// (lib/translate.ts), which fires one row's fields concurrently since a
// single save is a handful of requests at most, this script processes the
// site's entire backlog in one run and bursting all of it concurrently hit
// MyMemory's free-tier rate limit (HTTP 429) partway through in practice.
async function translateFields<T extends Record<string, string>>(
  fields: T,
  retries = 2
): Promise<Record<TargetLang, Partial<T>>> {
  const entries = Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim()) as [
    Extract<keyof T, string>,
    string,
  ][];
  const out = Object.fromEntries(TARGET_LANGS.map((l) => [l, {}])) as Record<TargetLang, Partial<T>>;
  if (entries.length === 0) return out;

  for (const lang of TARGET_LANGS) {
    for (const [key, value] of entries) {
      let attempt = 0;
      for (;;) {
        try {
          (out[lang] as Record<string, string>)[key] = await translateText(value, lang);
          break;
        } catch (err) {
          attempt++;
          if (attempt > retries) {
            console.error("  [translate failed]", err instanceof Error ? err.message : err);
            break;
          }
          await sleep(1500 * attempt);
        }
      }
      await sleep(150);
    }
  }
  return out;
}

async function backfillPageSections() {
  const rows = (await prisma.pageSection.findMany()).filter((r) => r.translations === null);
  console.log(`PageSection: ${rows.length} row(s) to translate`);
  for (const row of rows) {
    const flat = flattenTranslatable(row.content);
    const translations = await translateFields(flat);
    await prisma.pageSection.update({ where: { id: row.id }, data: { translations } });
    console.log(`  translated ${row.page}/${row.key}`);
  }
}

async function backfillFAQ() {
  const rows = (await prisma.fAQ.findMany()).filter((r) => r.translations === null);
  console.log(`FAQ: ${rows.length} row(s) to translate`);
  for (const row of rows) {
    const translations = await translateFields({ question: row.question, answer: row.answer });
    await prisma.fAQ.update({ where: { id: row.id }, data: { translations } });
    console.log(`  translated FAQ ${row.id}`);
  }
}

async function backfillTeamMember() {
  const rows = (await prisma.teamMember.findMany()).filter((r) => r.translations === null);
  console.log(`TeamMember: ${rows.length} row(s) to translate`);
  for (const row of rows) {
    const translations = await translateFields({ specialty: row.specialty });
    await prisma.teamMember.update({ where: { id: row.id }, data: { translations } });
    console.log(`  translated TeamMember ${row.name}`);
  }
}

async function backfillSiteSettings() {
  const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!row || row.translations) {
    console.log("SiteSettings: nothing to do");
    return;
  }
  const translations = await translateFields({ seoTitle: row.seoTitle, seoDescription: row.seoDescription });
  await prisma.siteSettings.update({ where: { id: "singleton" }, data: { translations } });
  console.log("SiteSettings: translated");
}

async function backfillCaseStudy() {
  const rows = (await prisma.caseStudy.findMany({ where: { tagOverride: { not: null } } })).filter(
    (r) => r.translations === null
  );
  console.log(`CaseStudy: ${rows.length} row(s) to translate`);
  for (const row of rows) {
    const translations = await translateFields({ tagOverride: row.tagOverride! });
    await prisma.caseStudy.update({ where: { id: row.id }, data: { translations } });
    console.log(`  translated CaseStudy ${row.id}`);
  }
}

async function backfillTreatments() {
  const allRows = await prisma.treatment.findMany({ include: { offers: true } });
  const rows = allRows
    .filter((r) => r.translations === null)
    .map((r) => ({ ...r, offers: r.offers.filter((o) => o.translations === null) }));
  console.log(`Treatment: ${rows.length} row(s) to translate`);
  for (const row of rows) {
    const translations = await translateFields({
      title: row.title,
      shortDesc: row.shortDesc,
      fullDesc: row.fullDesc,
    });
    await prisma.treatment.update({ where: { id: row.id }, data: { translations } });

    for (const offer of row.offers) {
      const offerTranslations = await translateFields({ title: offer.title, desc: offer.desc });
      await prisma.treatmentOffer.update({ where: { id: offer.id }, data: { translations: offerTranslations } });
    }
    console.log(`  translated Treatment ${row.title} (+${row.offers.length} offer(s))`);
  }
}

async function main() {
  await backfillPageSections();
  await backfillFAQ();
  await backfillTeamMember();
  await backfillSiteSettings();
  await backfillCaseStudy();
  await backfillTreatments();
  console.log("done");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
