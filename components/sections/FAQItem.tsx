"use client";

import Image from "next/image";
import { useState } from "react";

interface FAQItemProps {
  num: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function FAQItem({ num, question, answer, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-black-1 rounded-[14px] lg:rounded-lg px-5 py-4 lg:px-6 lg:py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 lg:gap-5">
          <span className="text-headline-sm lg:text-headline-lg text-black-6 shrink-0">{num}</span>
          <span className="text-headline-sm lg:text-headline-md font-semibold text-black-11">{question}</span>
        </div>
        <span
          className={`shrink-0 w-[30px] h-[30px] lg:w-[38px] lg:h-[38px] rounded-full border flex items-center justify-center transition-colors ${
            open ? "border-orange-6 bg-orange-1" : "border-black-4 bg-black-1"
          }`}
        >
          <Image src={open ? "/icon-faq-minus.svg" : "/icon-faq-plus.svg"} alt="" width={14} height={14} />
        </span>
      </button>
      {open && (
        <p className="mt-3 pl-8 lg:pl-10 text-headline-sm text-black-8 max-w-[720px]">{answer}</p>
      )}
    </div>
  );
}
