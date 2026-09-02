import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

function waLink(whatsappNumber: string) {
  return `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;
}

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const whatsappNumber = settings?.whatsappNumber ?? "+59171796997";
  const address = settings?.address ?? "Cochabamba, Bolivia";

  const socialLinks = [
    { name: "Facebook", href: settings?.facebookUrl, icon: "/icon-facebook.svg" },
    { name: "Instagram", href: settings?.instagramUrl, icon: "/icon-instagram.svg" },
    { name: "LinkedIn", href: settings?.linkedinUrl, icon: "/icon-linkedin.svg" },
  ].filter((s): s is { name: string; href: string; icon: string } => Boolean(s.href));

  return (
    <footer className="relative w-full bg-black-3 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-10 flex flex-col gap-8 items-start relative">
        <div className="h-px w-full bg-black-4" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          <div className="flex flex-col gap-3 items-start w-full lg:w-[300px]">
            <Image src="/logo.png" alt="Kabero" width={97} height={18} className="h-[18px] w-auto" />
            <p className="text-headline-sm text-black-8">
              Odontología estética
              <br />
              Cochabamba, Bolivia
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 items-start">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full bg-black-1 border border-black-4 flex items-center justify-center hover:border-orange-2 transition-colors"
                  >
                    <Image src={s.icon} alt="" width={16} height={16} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 items-start w-full lg:w-[240px]">
            <span className="text-headline-sm font-semibold text-black-11">Contacto</span>
            <a
              href={waLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-headline-sm text-black-8 underline underline-offset-2 hover:text-black-11 transition-colors"
            >
              WhatsApp {whatsappNumber}
            </a>
            <span className="text-headline-sm text-black-8">{address}</span>
            <Link
              href="/#horario"
              className="text-headline-sm text-black-8 underline underline-offset-2 hover:text-black-11 transition-colors"
            >
              Lun–Sáb, ver horario
            </Link>
          </div>
        </div>

        <div className="h-px w-full bg-black-4" />

        <div className="relative w-full">
          <span className="relative z-10 text-headline-sm text-black-8">© {year} Clínica Kabero</span>
          <span
            aria-hidden
            className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-0 text-[80px] lg:left-[193px] lg:translate-x-0 lg:-top-24 lg:text-[250px] font-bold text-black-4/30 leading-none whitespace-nowrap"
          >
            KABERO
          </span>
        </div>
      </div>
    </footer>
  );
}
