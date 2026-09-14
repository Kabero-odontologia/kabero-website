import { setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CenteredHero from "@/components/sections/CenteredHero";
import TreatmentCard from "@/components/sections/TreatmentCard";
import FAQSection from "@/components/sections/FAQSection";
import TreatmentsCTABanner from "@/components/sections/TreatmentsCTABanner";
import CTABand from "@/components/sections/CTABand";
import { prisma } from "@/lib/db";
import { getPageSection, localize } from "@/lib/page-sections";
import { centeredHeroContentSchema } from "@/lib/page-sections/shared";
import {
  tratamientosEncabezadoDefault,
  tratamientosCtaBandContentSchema,
  tratamientosCtaBandDefault,
} from "@/lib/page-sections/tratamientos";

// Self-heals within an hour even if a `revalidatePath` call is ever missed or
// (as happened on the very first deploy) the build ran against an empty
// database because the persistent disk isn't mounted during the build step.
export const revalidate = 3600;

export default async function TratamientosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [treatmentRows, encabezado, ctaBand] = await Promise.all([
    prisma.treatment.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    getPageSection(
      "tratamientos",
      "centered-hero",
      centeredHeroContentSchema,
      tratamientosEncabezadoDefault,
      locale
    ),
    getPageSection(
      "tratamientos",
      "cta-band",
      tratamientosCtaBandContentSchema,
      tratamientosCtaBandDefault,
      locale
    ),
  ]);
  const treatments = treatmentRows.map((t) => localize(t, t.translations, locale));

  return (
    <>
      <Header activePath="/tratamientos" />
      <main className="flex-1 bg-black-3">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-10 flex flex-col gap-14">
          {encabezado.visible && (
            <CenteredHero
              eyebrow={encabezado.content.eyebrow}
              title={encabezado.content.title}
              subtitle={encabezado.content.subtitle}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {treatments.map((t) => (
              <TreatmentCard
                key={t.slug}
                slug={t.slug}
                title={t.title}
                desc={t.shortDesc}
                photo={t.photo ?? undefined}
                gradient={t.gradient}
              />
            ))}
          </div>

          <FAQSection />

          {ctaBand.visible && (
            <>
              <div className="lg:hidden">
                <CTABand
                  headline={ctaBand.content.headline}
                  subtitle={ctaBand.content.subtitle}
                  buttonLabel={ctaBand.content.buttonLabel}
                  buttonHref={ctaBand.content.buttonHref}
                />
              </div>
              <div className="hidden lg:block">
                <TreatmentsCTABanner
                  headline={ctaBand.content.headline}
                  subtitle={ctaBand.content.subtitle}
                  buttonLabel={ctaBand.content.buttonLabel}
                  buttonHref={ctaBand.content.buttonHref}
                  photo={ctaBand.content.photo}
                />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
