"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<(typeof routing.locales)[number], string> = {
  es: "ES",
  en: "EN",
  "pt-BR": "PT",
};

interface LanguageSwitcherProps {
  className?: string;
}

// Preserves the current page across the switch (usePathname from next-intl's
// navigation returns the locale-agnostic path, e.g. "/tratamientos/ortodoncia"
// regardless of which locale is currently active).
export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-black-4" aria-hidden>/</span>}
          <Link
            href={pathname}
            locale={locale}
            aria-current={locale === activeLocale ? "true" : undefined}
            className={`text-title-md font-medium px-1 transition-colors ${
              locale === activeLocale ? "text-orange-6" : "text-black-7 hover:text-black-11"
            }`}
          >
            {LABELS[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
