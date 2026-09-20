import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import CasesFilterGallery from "@/components/sections/CasesFilterGallery";
import { prisma } from "@/lib/db";
import { getPageSection, localize } from "@/lib/page-sections";
import { centeredHeroContentSchema, ctaBandContentSchema } from "@/lib/page-sections/shared";
import { casosRealesEncabezadoDefault, casosRealesCtaBandDefault } from "@/lib/page-sections/casos-reales";

// Self-heals within an hour even if a `revalidatePath` call is ever missed or
// (as happened on the very first deploy) the build ran against an empty
// database because the persistent disk isn't mounted during the build step.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const encabezado = await getPageSection(
    "casos-reales",
    "centered-hero",
    centeredHeroContentSchema,
    casosRealesEncabezadoDefault,
    locale
  );
  return {
    title: "Casos reales",
    ...(encabezado.content.subtitle && { description: encabezado.content.subtitle }),
  };
}

export default async function CasosRealesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [cases, treatments, encabezado, ctaBand] = await Promise.all([
    prisma.caseStudy.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { treatment: { select: { title: true, slug: true, translations: true } } },
    }),
    prisma.treatment.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, translations: true },
    }),
    getPageSection("casos-reales", "centered-hero", centeredHeroContentSchema, casosRealesEncabezadoDefault, locale),
    getPageSection("casos-reales", "cta-band", ctaBandContentSchema, casosRealesCtaBandDefault, locale),
  ]);

  const localizedTreatments = treatments.map((t) => localize(t, t.translations, locale));

  const items = cases.map((c) => {
    const localizedCase = localize(c, c.translations, locale);
    const treatmentTitle = c.treatment
      ? (localizedTreatments.find((t) => t.slug === c.treatment!.slug)?.title ?? c.treatment.title)
      : null;
    return {
      id: c.id,
      tag: treatmentTitle ?? localizedCase.tagOverride ?? "Kabero",
      treatmentSlug: c.treatment?.slug ?? null,
      beforePhoto: c.beforePhoto,
      afterPhoto: c.afterPhoto,
    };
  });

  return (
    <>
      <Header activePath="/casos-reales" />
      <main className="flex-1 bg-black-3">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-10 flex flex-col gap-10">
          {encabezado.visible && (
            <CenteredHero
              eyebrow={encabezado.content.eyebrow}
              title={encabezado.content.title}
              subtitle={encabezado.content.subtitle}
            />
          )}

          <CasesFilterGallery cases={items} treatments={localizedTreatments} />

          {ctaBand.visible && <CTABand {...ctaBand.content} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
