"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";

export default function Header({ activePath = "/" }: { activePath?: string }) {
  const t = useTranslations("Header");
  const navLinks = [
    { label: t("navHome"), href: "/" },
    { label: t("navTratamientos"), href: "/tratamientos" },
    { label: t("navSobreNosotros"), href: "/sobre-nosotros" },
    { label: t("navCasosReales"), href: "/casos-reales" },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // IntersectionObserver is more reliable than a scroll listener on mobile Safari,
    // where scrollY can misreport during momentum/overscroll and address-bar collapse.
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Sits 8px into the page; scrolls out of view past that point to flip `scrolled`. */}
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-2 left-0 h-px w-px" />
      <header
        className={`w-full h-[66px] lg:h-[84px] fixed top-0 left-0 right-0 z-50 border-b border-black-4 transition-all duration-300 ${
          scrolled ? "bg-black-1/70 backdrop-blur-md shadow-sm" : "bg-black-1"
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-5 lg:px-14">
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <Image src="/logo.png" alt="Kabero" width={97} height={18} className="h-[18px] w-auto" priority />
          </Link>

          <nav className="hidden lg:flex items-center">
            {navLinks.map((link) => {
              const isActive = activePath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-headline-md font-medium px-3 py-2 rounded-[8px] transition-colors ${
                    isActive
                      ? "bg-gradient-to-b from-orange-6/0 to-orange-6/20 border-b border-orange-6 text-orange-6"
                      : "text-black-8 hover:text-black-11"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button href="https://wa.me/59171796997" variant="primary" size="sm">
              {t("agendarConsulta")}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t("cerrarMenu") : t("abrirMenu")}
            aria-expanded={menuOpen}
            className="lg:hidden relative z-[70] flex flex-col gap-1 items-center justify-center h-11 w-11 -mr-2.5 shrink-0 touch-manipulation"
          >
            <span className={`block h-0.5 w-5 bg-black-11 transition-transform ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-black-11 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-black-11 transition-transform ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Full-screen mobile menu, slides in from the right. h-[100dvh] avoids iOS Safari's
            address-bar-collapse resizing the viewport out from under a plain inset-0/100vh overlay. */}
        <div
          className={`lg:hidden fixed top-0 left-0 right-0 h-[100dvh] z-[60] bg-black-1 flex flex-col transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="h-[66px] flex items-center px-5 border-b border-black-4 shrink-0">
            <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
              <Image src="/logo.png" alt="Kabero" width={97} height={18} className="h-[18px] w-auto" />
            </Link>
          </div>

          <nav className="flex-1 flex flex-col divide-y divide-black-4 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = activePath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-headline-md font-medium px-5 py-5 transition-colors ${
                    isActive
                      ? "bg-gradient-to-b from-orange-6/0 to-orange-6/20 border-b-2 border-orange-6 text-orange-6"
                      : "text-black-8"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-5 border-t border-black-4 shrink-0 flex flex-col gap-4 items-center">
            <Button
              href="https://wa.me/59171796997"
              variant="primary"
              className="w-full"
              onClick={() => setMenuOpen(false)}
            >
              {t("agendarConsulta")}
            </Button>
          </div>
        </div>
      </header>
      {/* Spacer to offset the fixed header's height in normal document flow */}
      <div className="h-[66px] lg:h-[84px]" aria-hidden="true" />
    </>
  );
}
