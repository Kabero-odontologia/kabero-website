import Link from "next/link";

const sections = [
  { href: "/admin/paginas/sobre-nosotros/encabezado", title: "Encabezado", desc: "Antetítulo, título y descripción" },
  { href: "/admin/paginas/sobre-nosotros/historia", title: "Nuestra historia", desc: "Texto e imagen" },
  { href: "/admin/paginas/sobre-nosotros/fundador", title: "Fundador", desc: "Nombre, cargo, biografía, foto y etiquetas" },
  { href: "/admin/paginas/sobre-nosotros/equipo", title: "Equipo (texto)", desc: "Antetítulo, título y descripción de la grilla" },
  { href: "/admin/equipo", title: "Equipo (lista)", desc: "Las personas que aparecen en la grilla" },
  { href: "/admin/paginas/sobre-nosotros/laboratorio", title: "Nuestro laboratorio", desc: "Texto e imagen — se muestra debajo de Equipo" },
  { href: "/admin/paginas/sobre-nosotros/diferenciales", title: "Diferenciales", desc: "Título y la lista de diferenciales" },
  { href: "/admin/paginas/sobre-nosotros/banner-final", title: "Banner final", desc: "Texto, botón y fondo (imagen o degradé)" },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Página: Sobre nosotros</h1>
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
