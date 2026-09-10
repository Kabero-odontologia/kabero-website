import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import CroppedImage from "@/components/CroppedImage";
import type { HeroContent } from "@/lib/page-sections/home";

function Badge({ number, label }: { number: string; label: [string, string] }) {
  return (
    <div className="bg-black-11 border border-black-5 rounded-lg shadow-[0px_16px_40px_0px_rgba(0,0,0,0.18)] px-6 py-5 flex items-center gap-4">
      <span className="text-display-sm font-bold text-orange-6">{number}</span>
      <span className="text-headline-sm font-medium text-black-1 leading-tight">
        {label[0]}
        <br />
        {label[1]}
      </span>
    </div>
  );
}

function TeamPhoto({ photo, className }: { photo: string; className?: string }) {
  const tAlt = useTranslations("Alt");
  return (
    <div className={className}>
      <CroppedImage src={photo} alt={tAlt("equipoKabero")} sizes="(max-width: 768px) 100vw, 651px" priority />
    </div>
  );
}

export default function Hero({ content }: { content: HeroContent }) {
  const t = useTranslations("Hero");
  return (
    <section className="relative z-10 w-full bg-black-1 rounded-b-[28px] lg:rounded-b-[32px] shadow-[0px_16px_40px_0px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-8 lg:py-12">
        {/* Mobile layout: eyebrow/title -> image -> subtitle -> stacked buttons */}
        <div className="flex lg:hidden flex-col gap-4 items-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-title-lg font-medium text-orange-6 tracking-wide">{content.eyebrow}</span>
            <h1 className="text-display-md font-bold text-black-11">{content.title}</h1>
          </div>

          <div className="relative w-full h-[220px] shrink-0">
            <div className="absolute inset-0 rounded-[20px] border border-black-8 bg-black-10 overflow-hidden">
              <TeamPhoto photo={content.photo} className="absolute inset-0" />
            </div>
            <div className="absolute left-1 -bottom-4">
              <Badge number={content.badgeNumber} label={content.badgeLabel} />
            </div>
          </div>

          <p className="text-headline-sm text-black-8">{content.subtitle}</p>

          <div className="flex flex-col gap-3 items-stretch w-full mt-2">
            <Button href="https://wa.me/59171796997" variant="primary" size="sm" className="w-full">
              {t("contactanos")}
            </Button>
            <Button href="/tratamientos" variant="outline" size="sm" className="w-full">
              {t("verTratamientos")}
            </Button>
          </div>
        </div>

        {/* Desktop layout: text column left, image column right */}
        <div className="hidden lg:flex flex-row gap-12 items-start">
          <div className="flex-1 flex flex-col gap-5 items-start">
            <div className="flex flex-col gap-2 items-start">
              <span className="text-title-lg font-medium text-orange-6 tracking-wide">{content.eyebrow}</span>
              <h1 className="text-display-lg font-bold text-black-11 max-w-[520px]">{content.title}</h1>
            </div>
            <p className="text-headline-md text-black-8 max-w-[460px]">{content.subtitle}</p>
            <div className="flex gap-4 items-center">
              <Button href="https://wa.me/59171796997" variant="primary" size="sm">
                {t("contactanos")}
              </Button>
              <Button href="/tratamientos" variant="outline" size="sm">
                {t("verTratamientos")}
              </Button>
            </div>
          </div>

          <div className="relative w-[420px] h-[290px] xl:w-[651px] xl:h-[450px] shrink-0">
            <div className="absolute inset-0 rounded-[28px] border border-black-8 bg-black-10 overflow-hidden">
              <TeamPhoto photo={content.photo} className="absolute inset-0" />
            </div>
            <div className="absolute -bottom-4 left-6">
              <Badge number={content.badgeNumber} label={content.badgeLabel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
