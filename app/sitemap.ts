import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://kabero.org";
const STATIC_PATHS = ["", "/tratamientos", "/sobre-nosotros", "/casos-reales"];

function localizedUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

function alternatesFor(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = localizedUrl(locale, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const treatments = await prisma.treatment.findMany({
    where: { visible: true },
    select: { slug: true },
  });

  const paths = [...STATIC_PATHS, ...treatments.map((t) => `/tratamientos/${t.slug}`)];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: localizedUrl(locale, path),
      lastModified: new Date(),
      alternates: alternatesFor(path),
    }))
  );
}
