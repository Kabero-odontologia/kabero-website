// Flattens a PageSection's `content` (arbitrarily nested — tuples like
// badgeLabel:[string,string], fixed-length arrays like steps[4], variable
// arrays like diferenciales.items) into a flat `{ "steps.0.title": "..." }`
// map suitable for lib/translate.ts, and the reverse to merge a translation
// back in. One generic walker instead of nine bespoke per-shape adapters —
// safe specifically because it excludes fields by exact key name (never a
// fuzzy "looks photo-related" heuristic), so a genuinely new text field is
// translated by default instead of silently skipped.
const NON_TRANSLATABLE_KEYS = new Set([
  "photo",
  "photos",
  "url",
  "videoUrl",
  "backgroundPhoto",
  "backgroundImage",
  "backgroundFrom",
  "backgroundTo",
  "buttonHref",
  "href",
  "mediaType",
  "num",
  "badgeNumber",
  "treatmentIds",
  "caseStudyIds",
  "value",
  "name", // Fundador's person name — a proper noun, not translated.
]);

export function flattenTranslatable(content: unknown): Record<string, string> {
  const out: Record<string, string> = {};

  function walk(value: unknown, path: string, key: string) {
    if (NON_TRANSLATABLE_KEYS.has(key)) return;
    if (typeof value === "string") {
      if (value.trim()) out[path] = value;
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}.${i}`, key));
      return;
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, k);
    }
  }

  walk(content, "", "");
  return out;
}

export function applyTranslatedOverrides<T>(content: T, translated: Record<string, string>): T {
  const clone = structuredClone(content) as Record<string, unknown>;
  for (const [path, value] of Object.entries(translated)) {
    const parts = path.split(".");
    let node: Record<string, unknown> = clone;
    for (let i = 0; i < parts.length - 1; i++) {
      const next = node[parts[i]];
      if (next == null || typeof next !== "object") {
        node = {} as Record<string, unknown>;
        break;
      }
      node = next as Record<string, unknown>;
    }
    const lastKey = parts[parts.length - 1];
    if (lastKey in node) node[lastKey] = value;
  }
  return clone as T;
}
