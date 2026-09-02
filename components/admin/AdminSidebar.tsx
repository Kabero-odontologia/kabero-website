"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/admin/logout-action";

interface PageSectionLink {
  label: string;
  href: string;
}

interface PageNavItem {
  label: string;
  sections: PageSectionLink[];
}

const pages: PageNavItem[] = [
  {
    label: "Home",
    sections: [
      { label: "Hero", href: "/admin/paginas/home/hero" },
      { label: "Especialidades", href: "/admin/paginas/home/especialidades" },
      { label: "Casos de éxito", href: "/admin/paginas/home/casos-de-exito" },
      { label: "Conocé nuestro equipo", href: "/admin/paginas/home/video-section" },
      { label: "Cómo trabajamos", href: "/admin/paginas/home/how-it-works" },
      { label: "Visitanos", href: "/admin/paginas/home/contacto" },
      { label: "Banner final", href: "/admin/paginas/home/cta-band" },
    ],
  },
  {
    label: "Tratamientos",
    sections: [
      { label: "Lista de tratamientos", href: "/admin/tratamientos" },
      { label: "Encabezado", href: "/admin/paginas/tratamientos/encabezado" },
      { label: "Preguntas frecuentes", href: "/admin/preguntas-frecuentes" },
      { label: "Banner final", href: "/admin/paginas/tratamientos/banner-final" },
    ],
  },
  {
    label: "Sobre nosotros",
    sections: [
      { label: "Encabezado", href: "/admin/paginas/sobre-nosotros/encabezado" },
      { label: "Nuestra historia", href: "/admin/paginas/sobre-nosotros/historia" },
      { label: "Fundador", href: "/admin/paginas/sobre-nosotros/fundador" },
      { label: "Equipo (texto)", href: "/admin/paginas/sobre-nosotros/equipo" },
      { label: "Equipo (lista)", href: "/admin/equipo" },
      { label: "Nuestro laboratorio", href: "/admin/paginas/sobre-nosotros/laboratorio" },
      { label: "Diferenciales", href: "/admin/paginas/sobre-nosotros/diferenciales" },
      { label: "Banner final", href: "/admin/paginas/sobre-nosotros/banner-final" },
    ],
  },
  {
    label: "Casos reales",
    sections: [
      { label: "Lista de casos", href: "/admin/casos-reales" },
      { label: "Encabezado", href: "/admin/paginas/casos-reales/encabezado" },
      { label: "Banner final", href: "/admin/paginas/casos-reales/banner-final" },
    ],
  },
];

// Sitewide, not tied to any single page — kept out of the accordion above so it
// doesn't read as "part of Home" (it feeds the Footer on every page, plus the
// map/WhatsApp on Home's Contacto section).
const standaloneLinks: PageSectionLink[] = [{ label: "Footer y contacto", href: "/admin/horario-contacto" }];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      width="12"
      height="8"
      className={`shrink-0 transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const [openPage, setOpenPage] = useState<string | null>(null);

  // Auto-expand whichever page contains the current route.
  useEffect(() => {
    const match = pages.find((p) => p.sections.some((s) => pathname === s.href || pathname.startsWith(s.href + "/")));
    // Syncs local accordion state from the current route on navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setOpenPage(match.label);
  }, [pathname]);

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 flex flex-col bg-white/[0.03] border-r border-white/[0.08] backdrop-blur-xl">
      <div className="px-6 py-6 border-b border-white/[0.08]">
        <Image src="/logo.png" alt="Kabero" width={2214} height={412} className="h-4 w-auto brightness-0 invert" priority />
        <span className="block mt-2 text-title-md text-white/40 tracking-wide">ADMIN</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-2">
        <Link
          href="/admin"
          className={`flex items-center justify-between px-3 py-2.5 rounded-md text-headline-sm font-medium transition-colors mb-3 ${
            pathname === "/admin"
              ? "bg-white/[0.07] border border-white/[0.10] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
              : "border border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          Dashboard
          {pathname === "/admin" && <span aria-hidden className="w-px h-4 bg-white/30 rounded-full" />}
        </Link>

        {standaloneLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-headline-sm font-medium transition-colors mb-3 ${
                isActive
                  ? "bg-white/[0.07] border border-white/[0.10] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
                  : "border border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {link.label}
              {isActive && <span aria-hidden className="w-px h-4 bg-white/30 rounded-full" />}
            </Link>
          );
        })}

        {pages.map((page) => {
          const isOpen = openPage === page.label;
          return (
            <div key={page.label} className="flex flex-col">
              <button
                type="button"
                onClick={() => setOpenPage(isOpen ? null : page.label)}
                aria-expanded={isOpen}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-headline-sm font-medium transition-colors ${
                  isOpen
                    ? "bg-white/[0.07] border border-white/[0.10] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
                    : "border border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {page.label}
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-0.5 mt-1 ml-3 pl-3 border-l border-white/[0.10]">
                  {page.sections.map((section) => {
                    const isActive = pathname === section.href || pathname.startsWith(section.href + "/");
                    return (
                      <Link
                        key={section.href}
                        href={section.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-headline-sm transition-colors ${
                          isActive
                            ? "bg-white/[0.07] border border-white/[0.10] text-white font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]"
                            : "border border-transparent text-white/50 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {section.label}
                        {isActive && <span aria-hidden className="w-px h-4 bg-white/30 rounded-full" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.08] flex flex-col gap-2">
        <div className="px-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-white/[0.12] text-white text-title-lg font-semibold flex items-center justify-center shrink-0">
            {username.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-headline-sm text-white/70 truncate">{username}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-md text-headline-sm text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
