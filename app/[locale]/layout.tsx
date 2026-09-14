import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { prisma } from "@/lib/db";
import { routing } from "@/i18n/routing";
import { localize } from "@/lib/page-sections";

const FALLBACK_TITLE = "Kabero — Odontología estética en Cochabamba";
const FALLBACK_DESCRIPTION =
  "Diagnóstico digital y planificación milimétrica, con un enfoque estético pensado para tu cara.";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const settings = row ? localize(row, row.translations, locale) : null;
  return {
    metadataBase: new URL("https://kabero.org"),
    title: settings?.seoTitle || FALLBACK_TITLE,
    description: settings?.seoDescription || FALLBACK_DESCRIPTION,
  };
}

// The public site's own root layout (see app/admin/layout.tsx for why this is
// a *second* root layout instead of nesting under one shared one) — `lang`
// varies per locale, unlike admin's fixed "es". `setRequestLocale` is required
// here so pages under this tree can still be statically prerendered per
// locale instead of silently becoming dynamic.
export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
