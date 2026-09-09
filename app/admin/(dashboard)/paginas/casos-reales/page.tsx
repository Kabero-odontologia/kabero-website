import Link from "next/link";

const sections = [
  { href: "/admin/paginas/casos-reales/encabezado", title: "Encabezado", desc: "Antetítulo, título y descripción" },
  { href: "/admin/casos-reales", title: "Lista de casos", desc: "Las fotos antes/después que aparecen en la galería" },
  {
    href: "/admin/paginas/casos-reales/banner-final",
    title: "Banner final",
    desc: "Texto, botón y fondo (imagen o degradé)",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Página: Casos reales</h1>
        <p className="text-headline-sm text-white/50 mt-1">Elegí una sección para editar su texto e imágenes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-5 flex flex-col gap-1 hover:bg-white/[0.06] hover:border-white/[0.14] transition-colors"
          >
            <span className="text-headline-md font-semibold text-white">{s.title}</span>
            <span className="text-headline-sm text-white/50">{s.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
