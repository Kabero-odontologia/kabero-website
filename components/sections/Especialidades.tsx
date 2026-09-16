import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/page-sections";
import type { EspecialidadesContent } from "@/lib/page-sections/home";

export default async function Especialidades({ content }: { content: EspecialidadesContent }) {
  const [locale, t, rows] = await Promise.all([
    getLocale(),
    getTranslations("Especialidades"),
    content.treatmentIds.length > 0
      ? prisma.treatment
          .findMany({ where: { id: { in: content.treatmentIds }, visible: true } })
          .then((rows) => {
            const byId = new Map(rows.map((t) => [t.id, t]));
            return content.treatmentIds.map((id) => byId.get(id)).filter((t) => t !== undefined);
          })
      : prisma.treatment.findMany({ where: { visible: true }, orderBy: { order: "asc" }, take: 4 }),
  ]);
  const featured = rows.map((t) => localize(t, t.translations, locale));

  return (
    <section className="flex flex-col lg:flex-row gap-6 lg:gap-14 items-start">
      <div className="flex-1 flex flex-col gap-5 items-start">
        <div className="flex flex-col gap-2 items-start">
          {content.eyebrow && (
            <span className="text-title-lg font-medium text-orange-6 tracking-wide">{content.eyebrow}</span>
          )}
          <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{content.title}</h2>
        </div>
        {content.subtitle && <p className="text-headline-sm text-black-8">{content.subtitle}</p>}
        <Button href="/tratamientos" variant="outline" size="sm" className="self-start">
          {t("verTodos")}
        </Button>
      </div>

      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
        {featured.map((t) => (
          <Link
            key={t.slug}
            href={`/tratamientos/${t.slug}`}
            className="bg-black-1 rounded-[16px] lg:rounded-lg lg:h-[190px] p-6 flex flex-col gap-3 items-start border border-black-2 hover:border-[1.5px] hover:border-black-6 hover:drop-shadow-[0px_8px_10px_rgba(0,0,0,0.12)] transition-all duration-200"
          >
            <span className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-orange-2 flex items-center justify-center shrink-0">
              <Image src="/icon-dentist.svg" alt="" width={20} height={20} className="w-5 h-5 lg:w-6 lg:h-6" />
            </span>
            <span className="text-headline-md font-semibold text-black-11">{t.title}</span>
            {t.shortDesc && <span className="text-headline-sm text-black-8">{t.shortDesc}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
