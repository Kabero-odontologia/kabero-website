import "server-only";

// Free, no-key, no-card translation via MyMemory (https://mymemory.translated.net) —
// chosen specifically so the admin never has to hold an API key or billing account.
// Free tier: 500 bytes per request, 5,000 chars/day anonymous (50,000/day if
// MYMEMORY_CONTACT_EMAIL is set — still free, just a higher quota bucket).
const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_CHUNK_BYTES = 450; // margin under the real 500-byte cap

export type TargetLang = "en" | "pt-BR";
export const TARGET_LANGS: readonly TargetLang[] = ["en", "pt-BR"];

function utf8ByteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

// Splits on sentence boundaries and packs them into byte-limited chunks —
// never splits mid-sentence, so each chunk translates cleanly on its own and
// chunks can just be joined with a space afterwards.
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
  if (process.env.MYMEMORY_CONTACT_EMAIL) {
    url.searchParams.set("de", process.env.MYMEMORY_CONTACT_EMAIL);
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);

  const data = await res.json();
  const raw = data?.responseData?.translatedText;
  if (typeof raw !== "string" || !raw) {
    throw new Error(`MyMemory returned no translation for langpair ${langpair}`);
  }
  if (raw.toUpperCase().includes("MYMEMORY WARNING")) {
    throw new Error(raw);
  }
  // MyMemory occasionally returns raw tabs/double spaces in place of a single
  // space (seen on short all-caps strings) — collapse to normal whitespace.
  return raw.replace(/\s+/g, " ").trim();
}

export async function translateText(text: string, targetLang: TargetLang): Promise<string> {
  if (!text.trim()) return text;
  const langpair = `es|${targetLang}`;
  const chunks = splitIntoChunks(text);

  const translated: string[] = [];
  for (const chunk of chunks) {
    // Sequential per chunk — this site's content rarely needs more than one
    // chunk, and staying polite to a free/shared API beats a marginal speedup.
    translated.push(await translateChunk(chunk, langpair));
  }
  return translated.join(" ");
}

// Translates every field in `fields` into every language in `targetLangs`,
// all requests in flight together. A single field/language failure (network
// blip, MyMemory daily cap hit) is swallowed, not thrown — the caller ends up
// with a partial result, and any field missing from it just falls back to the
// Spanish source at read time (see lib/page-sections.ts's locale merge). This
// is what lets a save always succeed even if translation is having a bad day.
export async function translateFields<T extends Record<string, string>>(
  fields: T,
  targetLangs: readonly TargetLang[] = TARGET_LANGS
): Promise<Record<TargetLang, Partial<T>>> {
  const entries = Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim()) as [
    Extract<keyof T, string>,
    string,
  ][];

  const out = Object.fromEntries(targetLangs.map((lang) => [lang, {}])) as Record<TargetLang, Partial<T>>;
  if (entries.length === 0) return out;

  const jobs = targetLangs.flatMap((lang) =>
    entries.map(async ([key, value]) => ({ lang, key, translated: await translateText(value, lang) }))
  );

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "fulfilled") {
      (out[r.value.lang] as Record<string, string>)[r.value.key] = r.value.translated;
    } else {
      console.error("[translate] field translation failed:", r.reason);
    }
  }
  return out;
}
