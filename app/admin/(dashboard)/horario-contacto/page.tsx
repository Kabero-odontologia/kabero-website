import { prisma } from "@/lib/db";
import SiteSettingsForm from "./SiteSettingsForm";

export default async function Page() {
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Configuración del sitio</h1>
        <p className="text-headline-sm text-white/50 mt-1">
          SEO — cómo aparece el sitio en buscadores. La ubicación y el horario se editan en Visitanos, y el WhatsApp
          y redes sociales en Footer.
        </p>
      </div>
      <SiteSettingsForm initial={settings} />
    </div>
  );
}
