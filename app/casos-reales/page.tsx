import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import CasesFilterGallery from "@/components/sections/CasesFilterGallery";
import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { centeredHeroContentSchema, ctaBandContentSchema } from "@/lib/page-sections/shared";
import { casosRealesEncabezadoDefault, casosRealesCtaBandDefault } from "@/lib/page-sections/casos-reales";

export default async function CasosRealesPage() {
  const [cases, treatments, encabezado, ctaBand] = await Promise.all([
    prisma.caseStudy.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { treatment: { select: { title: true, slug: true } } },
    }),
    prisma.treatment.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
    getPageSection("casos-reales", "centered-hero", centeredHeroContentSchema, casosRealesEncabezadoDefault),
    getPageSection("casos-reales", "cta-band", ctaBandContentSchema, casosRealesCtaBandDefault),
  ]);

  const items = cases.map((c) => ({
    id: c.id,
    tag: c.treatment?.title ?? c.tagOverride ?? "Kabero",
    treatmentSlug: c.treatment?.slug ?? null,
    beforePhoto: c.beforePhoto,
    afterPhoto: c.afterPhoto,
  }));

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

          <CasesFilterGallery cases={items} treatments={treatments} />

          {ctaBand.visible && <CTABand {...ctaBand.content} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
