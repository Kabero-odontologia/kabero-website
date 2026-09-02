import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import CasesFilterGallery from "@/components/sections/CasesFilterGallery";
import { prisma } from "@/lib/db";

export default async function CasosRealesPage() {
  const [cases, treatments] = await Promise.all([
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
          <CenteredHero
            eyebrow="CASOS REALES"
            title="Antes y después de pacientes reales"
            subtitle="Cada caso pasó por el mismo proceso de diagnóstico y diseño — así se ven los resultados."
          />

          <CasesFilterGallery cases={items} treatments={treatments} />

          <CTABand
            headline="¿Querés resultados así?"
            subtitle="Agendá tu diagnóstico y arrancamos con tu plan."
            buttonLabel="Agendar consulta"
            buttonHref="https://wa.me/59171796997"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
