import Image from "next/image";
import { useTranslations } from "next-intl";

interface WhatWeOfferProps {
  items: { title: string; desc: string }[];
}

export default function WhatWeOffer({ items }: WhatWeOfferProps) {
  const t = useTranslations("WhatWeOffer");
  return (
    <section className="w-full lg:bg-black-1">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-6 lg:py-10">
        <div className="lg:border lg:border-white/[0.08] rounded-[32px] flex flex-col gap-4 lg:gap-10 items-start py-0 lg:py-14">
          <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{t("title")}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-x-4 lg:gap-y-10 w-full">
            {items.map((item) => (
              <div
                key={item.title}
                className="bg-black-1 border border-black-6 rounded-[16px] lg:rounded-lg p-4 lg:p-5 flex gap-4 lg:gap-5 items-center"
              >
                <Image src="/icon-check-circle.svg" alt="" width={38} height={38} className="shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-headline-sm lg:text-headline-md font-semibold text-black-11">
                    {item.title}
                  </span>
                  <span className="text-title-lg lg:text-headline-sm text-black-7">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
