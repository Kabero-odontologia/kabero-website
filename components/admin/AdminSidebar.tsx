"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/admin/logout-action";

interface PageSectionLink {
  label: string;
  href: string;
  /** Extra route prefixes that should also count as "on this section" — e.g.
   * a create/edit sub-route that lives outside this href's own tree. */
  extraPrefixes?: string[];
}

interface PageNavItem {
  label: string;
  sections: PageSectionLink[];
}

function sectionMatches(section: PageSectionLink, pathname: string): boolean {
  const prefixes = [section.href, ...(section.extraPrefixes ?? [])];
  return prefixes.some((href) => pathname === href || pathname.startsWith(href + "/"));
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
      { label: "Equipo", href: "/admin/paginas/sobre-nosotros/equipo", extraPrefixes: ["/admin/equipo"] },
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

// Sitewide, not tied to any single page — kept out of the accordion above so
// they don't read as "part of Home". Ubicación y horario viven en Visitanos
// (dentro de Home) porque es donde se muestran en el sitio público.
const standaloneLinks: PageSectionLink[] = [
  { label: "Footer", href: "/admin/footer" },
  { label: "Configuración del sitio", href: "/admin/horario-contacto" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
        open ? "bg-white/[0.10]" : "bg-white/[0.05]"
      }`}
    >
      <svg
        viewBox="0 0 12 8"
        width="10"
        height="7"
        className={`transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
        aria-hidden
      >
        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const [openPage, setOpenPage] = useState<string | null>(null);

  // Auto-expand whichever page contains the current route, and auto-collapse
  // every group when navigating to a route that belongs to none of them (e.g.
  // Footer, Configuración del sitio, Dashboard) — otherwise a group stays
  // visually "open" (bordered box) after leaving it, reading as still selected
  // even though nothing inside it is actually active anymore.
  useEffect(() => {
    const match = pages.find((p) => p.sections.some((s) => sectionMatches(s, pathname)));
    // Syncs local accordion state from the current route on navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenPage(match ? match.label : null);
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

        {pages.map((page) => {
          const isOpen = openPage === page.label;
          return (
            <div
              key={page.label}
              className={`flex flex-col rounded-md transition-colors ${
                isOpen ? "bg-white/[0.03] border border-white/[0.08]" : ""
              }`}
            >
              <Link
                href={page.sections[0].href}
                onClick={(e) => {
                  if (isOpen) {
                    // Already open — clicking again just collapses it instead of
                    // re-navigating to the first section you might not be on.
                    e.preventDefault();
                    setOpenPage(null);
                  } else {
                    setOpenPage(page.label);
                  }
                }}
                aria-expanded={isOpen}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-headline-sm font-medium transition-colors ${
                  isOpen ? "text-white" : "border border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {page.label}
                <ChevronIcon open={isOpen} />
              </Link>

              {/* Always mounted (not `isOpen &&`) so both the open and close
                  directions can animate — a 0fr/1fr grid track transitions
                  smoothly without knowing the list's height up front, unlike
                  `height: auto`. `inert` keeps the collapsed links out of tab
                  order instead of leaving them focusable-but-invisible. */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    inert={!isOpen}
                    className={`flex flex-col pb-2 transition-opacity duration-200 motion-reduce:transition-none ${
                      isOpen ? "opacity-100 delay-100" : "opacity-0"
                    }`}
                  >
                    {page.sections.map((section, i) => {
                      const isActive = sectionMatches(section, pathname);
                      const isLast = i === page.sections.length - 1;
                      return (
                        <Link
                          key={section.href}
                          href={section.href}
                          className="relative flex items-center pl-10 pr-3 py-2 text-headline-sm transition-colors"
                        >
                          {/* Tree connector: a spine that stops exactly at the last
                              item instead of running past it, with a small branch
                              pointing at this one — reads as "this list belongs to
                              Home" instead of a generic indent. */}
                          <span
                            aria-hidden
                            className={`absolute left-4 top-0 w-px bg-white/[0.12] ${isLast ? "h-1/2" : "h-full"}`}
                          />
                          <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-white/[0.12]" />
                          <span
                            aria-hidden
                            className={`absolute left-[26px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                              isActive ? "bg-white" : "bg-transparent"
                            }`}
                          />
                          <span className={isActive ? "text-white font-medium" : "text-white/50 hover:text-white/80 transition-colors"}>
                            {section.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {standaloneLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-headline-sm font-medium transition-colors mt-1 ${
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
