"use client";

import Image from "next/image";
import { useState } from "react";
import type { HowItWorksContent } from "@/lib/page-sections/home";

export default function HowItWorks({ content }: { content: HowItWorksContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = content.steps;
  const active = steps[activeIndex];

  return (
    <section className="w-full lg:bg-black-1">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-14 items-start px-5 lg:px-14 py-6 lg:py-14">
        <div className="flex flex-col gap-6 lg:gap-8 items-start w-full lg:w-[600px] shrink-0">
          <div className="flex flex-col gap-2 items-start">
            {content.eyebrow && (
              <span className="text-title-lg font-medium text-orange-6 tracking-wide">{content.eyebrow}</span>
            )}
            <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-11">{content.title}</h2>
          </div>

          <div className="flex flex-col items-start w-full">
            {steps.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`flex gap-4 lg:gap-6 items-start text-left pl-4 lg:pl-6 py-4 lg:py-5 border-l-2 w-full transition-colors duration-200 ${
                    isActive
                      ? "border-orange-6"
                      : "border-black-2 lg:border-black-4 hover:border-black-6 hover:bg-black-2/60 lg:hover:bg-black-3/60"
                  }`}
                >
                  <span
                    className={
                      isActive
                        ? "text-title-lg font-medium text-orange-6 tracking-wide"
                        : "text-title-lg lg:text-headline-sm font-medium text-black-6"
                    }
                  >
                    {s.num}
                  </span>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-headline-md font-semibold text-black-11">{s.title}</span>
                    {s.desc && <span className="text-headline-sm text-black-8">{s.desc}</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:hidden relative w-full h-[220px] rounded-[20px] border border-black-4 bg-black-3 overflow-hidden">
            <div key={active.num} className="absolute inset-0 animate-[fade-in_0.4s_ease]">
              <Image src={active.photo} alt={active.alt} fill sizes="100vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative flex-1 w-full h-[448px] rounded-xl border border-black-4 bg-black-3 overflow-hidden">
          <div key={active.num} className="absolute inset-0 animate-[fade-in_0.4s_ease]">
            <Image src={active.photo} alt={active.alt} fill sizes="45vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
