import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "pt-BR"],
  defaultLocale: "es",
  // Spanish stays unprefixed ("/", "/tratamientos") since it's the site's
  // primary audience; only en/pt-BR get a URL prefix.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
