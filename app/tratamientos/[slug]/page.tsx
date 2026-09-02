import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTABand from "@/components/sections/CTABand";
import CaseCard from "@/components/sections/CaseCard";
import RelatedTreatmentCard from "@/components/sections/RelatedTreatmentCard";
import TreatmentHero from "@/components/sections/TreatmentHero";
import AboutTreatment from "@/components/sections/AboutTreatment";
import WhatWeOffer from "@/components/sections/WhatWeOffer";
import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const treatments = await prisma.treatment.findMany({ select: { slug: true } });
  return treatments.map((t) => ({ slug: t.slug }));
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const treatment = await prisma.treatment.findUnique({
    where: { slug },
    include: {
      gallery: { orderBy: { order: "asc" } },
      offers: { orderBy: { order: "asc" } },
    },
  });
  if (!treatment || !treatment.visible) notFound();

  const [related, relatedCases] = await Promise.all([
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

  return (
    <>
      <Header activePath="/tratamientos" />
      <main className="flex-1 bg-black-3">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-6 lg:py-10 flex flex-col gap-8 lg:gap-14">
          <TreatmentHero
            title={treatment.title}
            subtitle={treatment.shortDesc}
            photo={treatment.heroPhoto ?? treatment.photo ?? ""}
            focalPosition={treatment.heroFocalPosition ?? undefined}
          />

          <AboutTreatment
            title={treatment.title}
            fullDesc={treatment.fullDesc}
            gallery={treatment.gallery.map((g) => g.url)}
            gradient={treatment.gradient}
          />
        </div>

        <WhatWeOffer items={treatment.offers.map((o) => ({ title: o.title, desc: o.desc }))} />

        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-6 lg:py-10 flex flex-col gap-8 lg:gap-14">
          {/* Casos de éxito */}
          {relatedCases.length > 0 && (
            <section className="flex flex-col gap-4 lg:gap-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 lg:gap-0">
                <div className="flex flex-col gap-2">
                  <span className="text-title-lg font-medium text-orange-6 tracking-wide">CASOS REALES</span>
                  <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">
                    Resultados de este tratamiento
                  </h2>
                </div>
                <Link
                  href="/casos-reales"
                  className="text-headline-md font-medium text-black-8 hover:text-black-11 px-3 py-2 -ml-3 lg:ml-0 rounded-[8px] transition-colors self-start"
                >
                  Ver más casos →
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
            headline="¿Lista para dar el siguiente paso?"
            subtitle="Agendá tu diagnóstico y salí con un plan claro para tu tratamiento."
            buttonLabel="Agendar por WhatsApp"
            buttonHref="https://wa.me/59171796997"
          />

          {/* Related */}
          <section className="flex flex-col gap-4 lg:gap-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2 lg:gap-0">
              <div className="flex flex-col gap-2">
                <span className="text-title-lg font-medium text-orange-6 tracking-wide">MÁS TRATAMIENTOS</span>
                <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">
                  Otros tratamientos relacionados
                </h2>
              </div>
              <Link
                href="/tratamientos"
                className="text-headline-md font-medium text-black-8 hover:text-black-11 px-3 py-2 -ml-3 lg:ml-0 rounded-[8px] transition-colors self-start"
              >
                Ver todos →
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
