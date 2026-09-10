import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CaseCard from "@/components/sections/CaseCard";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/page-sections";
import type { CasosDeExitoContent } from "@/lib/page-sections/home";

export default async function CasosDeExito({ content }: { content: CasosDeExitoContent }) {
  const [locale, t, rows] = await Promise.all([
    getLocale(),
    getTranslations("CasosDeExito"),
    prisma.caseStudy.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      take: 3,
      include: { treatment: { select: { title: true, translations: true } } },
    }),
  ]);

  if (rows.length === 0) return null;

  const cases = rows.map((c) => ({
    ...localize(c, c.translations, locale),
    treatment: c.treatment ? localize(c.treatment, c.treatment.translations, locale) : null,
  }));

  return (
    <section className="lg:border lg:border-white/[0.08] lg:rounded-[32px] flex flex-col gap-6 lg:gap-10 items-start lg:py-0 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0 w-full">
        <div className="flex flex-col gap-2 items-start">
          <span className="text-title-lg font-medium text-orange-6 tracking-wide">{content.eyebrow}</span>
          <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{content.title}</h2>
        </div>
        <Link
          href="/casos-reales"
          className="text-headline-md font-medium text-black-8 hover:text-black-11 px-3 py-2 -ml-3 lg:ml-0 rounded-[8px] transition-colors self-start"
        >
          {t("verTodos")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {cases.map((c) => (
          <CaseCard
            key={c.id}
            tag={c.treatment?.title ?? c.tagOverride ?? "Kabero"}
            beforePhoto={c.beforePhoto}
            afterPhoto={c.afterPhoto}
          />
        ))}
      </div>
    </section>
  );
}
