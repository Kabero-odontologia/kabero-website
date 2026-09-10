import { setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Especialidades from "@/components/sections/Especialidades";
import CasosDeExito from "@/components/sections/CasosDeExito";
import VideoSection from "@/components/sections/VideoSection";
import HowItWorks from "@/components/sections/HowItWorks";
import Contacto from "@/components/sections/Contacto";
import CTABand from "@/components/sections/CTABand";
import { getHomeSections } from "@/lib/page-sections/home";
import { prisma } from "@/lib/db";
import { getBusinessHours } from "@/lib/business-hours";

const FALLBACK_MAPS_QUERY = "Kabero Odontología Estética, Cochabamba, Bolivia";
const FALLBACK_MAPS_LINK = "https://maps.app.goo.gl/6iPZDSWXkv3w5TPW9";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [sections, siteSettings, businessHours] = await Promise.all([
    getHomeSections(locale),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    getBusinessHours(),
  ]);

  return (
    <>
      <Header activePath="/" />
      {sections.hero.visible && <Hero content={sections.hero.content} />}
      <main className="flex-1 bg-black-3">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 pt-10 lg:pt-14 pb-10 lg:pb-14 flex flex-col gap-10 lg:gap-14">
          {sections.especialidades.visible && <Especialidades content={sections.especialidades.content} />}
          {sections.casosDeExito.visible && <CasosDeExito content={sections.casosDeExito.content} />}
        </div>

        {sections.videoSection.visible && <VideoSection content={sections.videoSection.content} />}

        {sections.howItWorks.visible && <HowItWorks content={sections.howItWorks.content} />}

        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 pt-10 lg:pt-14 pb-10 lg:pb-14 flex flex-col gap-10 lg:gap-14">
          {sections.contacto.visible && (
            <Contacto
              content={sections.contacto.content}
              mapsQuery={siteSettings?.mapsQuery ?? FALLBACK_MAPS_QUERY}
              mapsLink={siteSettings?.mapsLink ?? FALLBACK_MAPS_LINK}
              businessHours={businessHours}
            />
          )}

          {sections.ctaBand.visible && <CTABand {...sections.ctaBand.content} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
