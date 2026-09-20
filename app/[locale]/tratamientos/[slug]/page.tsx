import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTABand from "@/components/sections/CTABand";
import CaseCard from "@/components/sections/CaseCard";
import RelatedTreatmentCard from "@/components/sections/RelatedTreatmentCard";
import TreatmentHero from "@/components/sections/TreatmentHero";
import AboutTreatment from "@/components/sections/AboutTreatment";
import WhatWeOffer from "@/components/sections/WhatWeOffer";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/page-sections";

export async function generateStaticParams() {
  const treatments = await prisma.treatment.findMany({ select: { slug: true } });
  return treatments.map((t) => ({ slug: t.slug }));
}

// Self-heals within an hour even if a `revalidatePath` call is ever missed or
// (as happened on the very first deploy) the build ran against an empty
// database because the persistent disk isn't mounted during the build step.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const row = await prisma.treatment.findUnique({ where: { slug } });
  if (!row || !row.visible) return {};
  const treatment = localize(row, row.translations, locale);
  return {
    title: treatment.title,
    description: treatment.shortDesc || treatment.fullDesc,
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TreatmentDetail");

  const treatmentRow = await prisma.treatment.findUnique({
    where: { slug },
    include: {
      gallery: { orderBy: { order: "asc" } },
      offers: { orderBy: { order: "asc" } },
    },
  });
  if (!treatmentRow || !treatmentRow.visible) notFound();

  const treatment = {
    ...localize(treatmentRow, treatmentRow.translations, locale),
    offers: treatmentRow.offers.map((o) => localize(o, o.translations, locale)),
  };

  const [relatedRows, relatedCases] = await Promise.all([
    prisma.treatment.findMany({
      where: { visible: true, slug: { not: slug } },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.caseStudy.findMany({
      where: { visible: true, treatment: { slug } },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);
  const related = relatedRows.map((t) => localize(t, t.translations, locale));

  return (
    <>
      <Header activePath="/tratamientos" />
      <main className="flex-1 bg-black-3">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-6 lg:py-10 flex flex-col gap-8 lg:gap-14">
          <TreatmentHero
            title={treatment.title}
            subtitle={treatment.shortDesc}
            photo={treatment.heroPhoto ?? treatment.photo ?? ""}
          />

          <AboutTreatment
            title={treatment.title}
            fullDesc={treatment.fullDesc}
            gallery={treatment.gallery.map((g) => g.url)}
          />
        </div>

        <WhatWeOffer items={treatment.offers.map((o) => ({ title: o.title, desc: o.desc }))} />

        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-6 lg:py-10 flex flex-col gap-8 lg:gap-14">
          {/* Casos de éxito */}
          {relatedCases.length > 0 && (
            <section className="flex flex-col gap-4 lg:gap-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 lg:gap-0">
                <div className="flex flex-col gap-2">
                  <span className="text-title-lg font-medium text-orange-6 tracking-wide">
                    {t("casosRealesEyebrow")}
                  </span>
                  <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">
                    {t("resultadosTitle")}
                  </h2>
                </div>
                <Link
                  href="/casos-reales"
                  className="text-headline-md font-medium text-black-8 hover:text-black-11 px-3 py-2 -ml-3 lg:ml-0 rounded-[8px] transition-colors self-start"
                >
                  {t("verMasCasos")}
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {relatedCases.map((c) => (
                  <CaseCard key={c.id} tag={treatment.title} beforePhoto={c.beforePhoto} afterPhoto={c.afterPhoto} />
                ))}
              </div>
            </section>
          )}

          <CTABand
            headline={t("ctaHeadline")}
            subtitle={t("ctaSubtitle")}
            buttonLabel={t("ctaButton")}
            buttonHref="https://wa.me/59171796997"
          />

          {/* Related */}
          <section className="flex flex-col gap-4 lg:gap-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 lg:gap-0">
              <div className="flex flex-col gap-2">
                <span className="text-title-lg font-medium text-orange-6 tracking-wide">
                  {t("masTratamientosEyebrow")}
                </span>
                <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">
                  {t("relacionadosTitle")}
                </h2>
              </div>
              <Link
                href="/tratamientos"
                className="text-headline-md font-medium text-black-8 hover:text-black-11 px-3 py-2 -ml-3 lg:ml-0 rounded-[8px] transition-colors self-start"
              >
                {t("verTodos")}
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {related.map((t) => (
                <RelatedTreatmentCard
                  key={t.slug}
                  slug={t.slug}
                  title={t.title}
                  photo={t.photo ?? undefined}
                  gradient={t.gradient}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
