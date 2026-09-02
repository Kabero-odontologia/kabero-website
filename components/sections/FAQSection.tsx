import FAQItem from "@/components/sections/FAQItem";
import { prisma } from "@/lib/db";

export default async function FAQSection() {
  const faqs = await prisma.fAQ.findMany({ where: { visible: true }, orderBy: { order: "asc" } });

  if (faqs.length === 0) return null;

  return (
    <div className="bg-black-1 rounded-2xl shadow-[0px_14px_36px_0px_rgba(0,0,0,0.14)] p-3">
      <div className="bg-black-3 border border-black-4 rounded-xl p-2 flex flex-col lg:flex-row gap-3 lg:gap-5">
        <div className="bg-black-11 rounded-lg lg:rounded-xl px-4 py-5 lg:p-8 flex flex-col gap-4 lg:gap-8 w-full lg:w-[380px] shrink-0">
          <div className="flex flex-col gap-2 lg:gap-3">
            <span className="text-title-lg font-medium text-orange-6 tracking-wide">PREGUNTAS FRECUENTES</span>
            <h2 className="text-headline-lg lg:text-display-sm font-bold text-black-1">
              La claridad que necesitás antes de decidirte
            </h2>
            <p className="text-headline-sm text-black-8 lg:text-black-7">
              Resolvimos las dudas más comunes antes de que tengas que preguntarlas — si la tuya no está, escribinos.
            </p>
          </div>
          <a
            href="https://wa.me/59171796997"
            className="inline-flex items-center justify-center self-start rounded-full bg-orange-6 text-black-1 hover:bg-orange-7 transition-colors px-6 py-2 text-headline-sm font-semibold lg:py-3 lg:text-headline-md lg:font-medium"
          >
            Contactanos
          </a>
        </div>

        <div className="flex-1 flex flex-col gap-2 lg:gap-3 py-2 lg:py-0 lg:justify-center">
          {faqs.map((f, i) => (
            <FAQItem
              key={f.id}
              num={String(i + 1).padStart(2, "0")}
              question={f.question}
              answer={f.answer}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
