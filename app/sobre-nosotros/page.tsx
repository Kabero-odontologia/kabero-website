import Image from "next/image";
import CroppedImage from "@/components/CroppedImage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { centeredHeroContentSchema, ctaBandContentSchema } from "@/lib/page-sections/shared";
import {
  sobreNosotrosEncabezadoDefault,
  historiaContentSchema,
  historiaDefault,
  fundadorContentSchema,
  fundadorDefault,
  equipoIntroContentSchema,
  equipoIntroDefault,
  laboratorioContentSchema,
  laboratorioDefault,
  diferencialesContentSchema,
  diferencialesDefault,
  sobreNosotrosCtaBandDefault,
} from "@/lib/page-sections/sobre-nosotros";

export default async function SobreNosotrosPage() {
  const [encabezado, historia, fundador, equipoIntro, laboratorio, diferenciales, ctaBand, teamMembers] =
    await Promise.all([
      getPageSection("sobre-nosotros", "centered-hero", centeredHeroContentSchema, sobreNosotrosEncabezadoDefault),
      getPageSection("sobre-nosotros", "historia", historiaContentSchema, historiaDefault),
      getPageSection("sobre-nosotros", "fundador", fundadorContentSchema, fundadorDefault),
      getPageSection("sobre-nosotros", "equipo-intro", equipoIntroContentSchema, equipoIntroDefault),
      getPageSection("sobre-nosotros", "laboratorio", laboratorioContentSchema, laboratorioDefault),
      getPageSection("sobre-nosotros", "diferenciales", diferencialesContentSchema, diferencialesDefault),
      getPageSection("sobre-nosotros", "cta-band", ctaBandContentSchema, sobreNosotrosCtaBandDefault),
      prisma.teamMember.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    ]);

  return (
    <>
      <Header activePath="/sobre-nosotros" />
      <main className="flex-1 bg-black-3">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-6 lg:py-10 flex flex-col gap-10 lg:gap-14">
          {encabezado.visible && (
            <CenteredHero
              eyebrow={encabezado.content.eyebrow}
              title={encabezado.content.title}
              subtitle={encabezado.content.subtitle}
            />
          )}

          {historia.visible && (
            <section className="flex flex-col lg:flex-row gap-5 lg:gap-14 items-center">
              <div className="order-2 lg:order-1 lg:flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-title-lg font-medium text-orange-6 tracking-wide">{historia.content.eyebrow}</span>
                  <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{historia.content.title}</h2>
                </div>
                <p className="text-headline-sm lg:text-headline-md text-black-8">{historia.content.description}</p>
              </div>
              <div className="order-1 lg:order-2 relative lg:flex-1 w-full h-[220px] lg:h-[420px] rounded-[20px] lg:rounded-[28px] overflow-hidden shrink-0">
                <CroppedImage src={historia.content.photo} alt="Recepción de la clínica" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </section>
          )}

          {fundador.visible && (
            <section className="flex flex-col gap-4 lg:gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-title-lg font-medium text-orange-6 tracking-wide">{fundador.content.eyebrow}</span>
                <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">
                  {fundador.content.sectionTitle}
                </h2>
              </div>
              <div className="bg-black-1 rounded-[24px] lg:rounded-2xl drop-shadow-[0px_10px_14px_rgba(0,0,0,0.12)] p-2 lg:p-3">
                <div className="bg-black-3 rounded-[18px] lg:rounded-xl p-5 flex flex-col lg:flex-row gap-4 lg:gap-10 items-start lg:items-center">
                  <div className="lg:hidden relative w-full h-[240px] rounded-[16px] bg-black overflow-hidden">
                    <Image
                      src={fundador.content.photo}
                      alt={fundador.content.name}
                      fill
                      sizes="335px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="hidden lg:flex bg-black-11 rounded-lg w-[220px] h-[220px] shrink-0 items-end justify-center overflow-hidden">
                    <div className="relative w-[190px] h-[190px]">
                      <Image
                        src={fundador.content.photo}
                        alt={fundador.content.name}
                        fill
                        sizes="190px"
                        className="object-contain object-bottom"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:gap-4 pr-0 lg:pr-14">
                    <span className="text-display-sm font-bold text-black-11">{fundador.content.name}</span>
                    <span className="text-headline-sm font-medium text-orange-6 -mt-1 lg:-mt-2">
                      {fundador.content.role}
                    </span>
                    <p className="text-headline-sm text-black-7 lg:text-black-8">{fundador.content.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {fundador.content.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-black-1 border border-black-4 rounded-full px-3 lg:px-4 py-2 text-title-lg font-medium text-black-9 tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {equipoIntro.visible && teamMembers.length > 0 && (
            <section className="flex flex-col gap-4 lg:gap-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-2 lg:gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-title-lg font-medium text-orange-6 tracking-wide">{equipoIntro.content.eyebrow}</span>
                  <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">
                    {equipoIntro.content.title}
                  </h2>
                </div>
                <span className="text-headline-sm text-black-8 lg:text-black-7 max-w-[340px] lg:text-right">
                  {equipoIntro.content.subtitle}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {teamMembers.map((m) => (
                  <div key={m.id} className="flex flex-col gap-3 lg:gap-4">
                    <div className="relative w-full h-[140px] lg:h-auto lg:aspect-[411/390] rounded-[14px] lg:rounded-lg overflow-hidden">
                      <CroppedImage src={m.photo ?? "/hero-team.jpg"} alt={m.name} sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-headline-sm lg:text-headline-lg font-bold text-black-11">{m.name}</span>
                      <span className="text-title-lg lg:text-headline-sm text-black-8 lg:text-black-7">
                        {m.specialty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {laboratorio.visible && (
            <section className="flex flex-col gap-4 lg:gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-title-lg font-medium text-orange-6 tracking-wide">{laboratorio.content.eyebrow}</span>
                <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{laboratorio.content.title}</h2>
                <p className="text-headline-sm lg:text-headline-md text-black-8 max-w-[720px]">
                  {laboratorio.content.description}
                </p>
              </div>
              <div className="flex gap-3 lg:gap-4 w-full h-[220px] lg:h-[420px]">
                <div className="relative flex-[1.6] h-full rounded-[16px] lg:rounded-[24px] overflow-hidden">
                  <CroppedImage
                    src={laboratorio.content.photos[0]}
                    alt={laboratorio.content.title}
                    sizes="(max-width: 768px) 55vw, 45vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 lg:gap-4 h-full">
                  <div className="relative flex-1 rounded-[16px] lg:rounded-[24px] overflow-hidden">
                    <CroppedImage src={laboratorio.content.photos[1]} alt="" sizes="(max-width: 768px) 30vw, 25vw" />
                  </div>
                  <div className="relative flex-1 rounded-[16px] lg:rounded-[24px] overflow-hidden">
                    <CroppedImage src={laboratorio.content.photos[2]} alt="" sizes="(max-width: 768px) 30vw, 25vw" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {diferenciales.visible && (
            <section className="flex flex-col gap-4 lg:gap-8">
              <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{diferenciales.content.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-12">
                {diferenciales.content.items.map((d) => (
                  <div key={d.title} className="bg-black-1 rounded-lg p-5 flex flex-col gap-3 border border-black-6">
                    <Image src="/icon-check-circle.svg" alt="" width={38} height={38} />
                    <div className="flex flex-col gap-1">
                      <span className="text-headline-md font-semibold text-black-11">{d.title}</span>
                      <span className="text-headline-sm text-black-7">{d.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {ctaBand.visible && <CTABand {...ctaBand.content} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
