import Link from "next/link";

const sections = [
  { href: "/admin/paginas/home/hero", title: "Hero", desc: "Antetítulo, título, descripción, tarjeta e imagen" },
  {
    href: "/admin/paginas/home/especialidades",
    title: "Especialidades",
    desc: "Texto y las 2 a 4 especialidades destacadas",
  },
  {
    href: "/admin/paginas/home/casos-de-exito",
    title: "Casos de éxito",
    desc: "Solo el texto — las fotos se manejan en Casos reales",
  },
  {
    href: "/admin/paginas/home/video-section",
    title: "Sección multimedia de la clínica",
    desc: "Imagen o video, y la franja de estadísticas",
  },
  {
    href: "/admin/paginas/home/how-it-works",
    title: "Cómo trabajamos",
    desc: "Texto y los 4 pasos, cada uno con su imagen",
  },
  { href: "/admin/paginas/home/contacto", title: "Visitanos", desc: "Antetítulo y título de la sección" },
  {
    href: "/admin/paginas/home/cta-band",
    title: "Banner final",
    desc: "Texto, botón y fondo (imagen o degradé)",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Página: Home</h1>
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
