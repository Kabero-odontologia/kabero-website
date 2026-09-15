import Image from "next/image";
import { useTranslations } from "next-intl";

interface AboutTreatmentProps {
  title: string;
  fullDesc: string;
  gallery?: string[];
}

// Shown instead of a raw empty block while the gallery photos haven't been
// uploaded yet in the admin — a subtle branded placeholder rather than
// looking like missing content.
function GalleryPlaceholder({ className }: { className: string }) {
  return (
    <div className={`bg-gradient-to-br from-black-3 to-black-5 flex items-center justify-center ${className}`}>
      <Image
        src="/icon-dentist.svg"
        alt=""
        width={32}
        height={32}
        className="w-8 h-8 lg:w-10 lg:h-10 opacity-25 brightness-0 invert"
      />
    </div>
  );
}

export default function AboutTreatment({ title, fullDesc, gallery }: AboutTreatmentProps) {
  const t = useTranslations("AboutTreatment");
  const hasGallery = gallery && gallery.length >= 5;

  return (
    <section className="flex flex-col gap-4 lg:gap-6 items-start w-full">
      <h2 className="text-headline-md lg:text-display-sm font-bold text-black-11">{t("title")}</h2>
      <p className="text-headline-sm lg:text-headline-md text-black-8 max-w-[900px]">{fullDesc}</p>

      {hasGallery ? (
        <>
          {/* Mobile: one large photo, then a 2x2 grid below */}
          <div className="flex lg:hidden flex-col gap-3 w-full">
            <div className="relative h-[220px] w-full rounded-[16px] border border-black-4 overflow-hidden">
              <Image src={gallery[0]} alt={title} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(1, 5).map((src, i) => (
                <div key={i} className="relative h-[160px] rounded-[16px] border border-black-4 overflow-hidden">
                  <Image src={src} alt="" fill sizes="50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: one large photo left, two stacked columns right */}
          <div className="hidden lg:flex gap-4 items-start w-full h-[420px]">
            <div className="relative flex-[1.6] h-full rounded-[24px] border border-black-4 overflow-hidden">
              <Image src={gallery[0]} alt={title} fill sizes="45vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-4 h-full">
              <div className="relative h-[218px] rounded-[24px] border border-black-4 overflow-hidden shrink-0">
                <Image src={gallery[1]} alt="" fill sizes="25vw" className="object-cover" />
              </div>
              <div className="relative flex-1 rounded-[24px] border border-black-4 overflow-hidden">
                <Image src={gallery[2]} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 h-full">
              <div className="relative flex-1 rounded-[24px] border border-black-4 overflow-hidden">
                <Image src={gallery[3]} alt="" fill sizes="25vw" className="object-cover" />
              </div>
              <div className="relative h-[218px] rounded-[24px] border border-black-4 overflow-hidden shrink-0">
                <Image src={gallery[4]} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
          <GalleryPlaceholder className="lg:col-span-2 h-[220px] lg:h-[320px] rounded-[16px] lg:rounded-[20px]" />
          <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3 lg:gap-4">
            <GalleryPlaceholder className="h-[160px] lg:h-full rounded-[16px] lg:rounded-[20px]" />
            <GalleryPlaceholder className="h-[160px] lg:h-full rounded-[16px] lg:rounded-[20px]" />
          </div>
        </div>
      )}
    </section>
  );
}
