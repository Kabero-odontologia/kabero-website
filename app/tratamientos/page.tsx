import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CenteredHero from "@/components/sections/CenteredHero";
import TreatmentCard from "@/components/sections/TreatmentCard";
import FAQSection from "@/components/sections/FAQSection";
import TreatmentsCTABanner from "@/components/sections/TreatmentsCTABanner";
import CTABand from "@/components/sections/CTABand";
import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { centeredHeroContentSchema } from "@/lib/page-sections/shared";
import {
  tratamientosEncabezadoDefault,
  tratamientosCtaBandContentSchema,
  tratamientosCtaBandDefault,
} from "@/lib/page-sections/tratamientos";

export default async function TratamientosPage() {
  const [treatments, encabezado, ctaBand] = await Promise.all([
    prisma.treatment.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    getPageSection("tratamientos", "centered-hero", centeredHeroContentSchema, tratamientosEncabezadoDefault),
    getPageSection("tratamientos", "cta-band", tratamientosCtaBandContentSchema, tratamientosCtaBandDefault),
  ]);

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
