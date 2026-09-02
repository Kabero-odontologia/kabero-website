import { prisma } from "@/lib/db";
import SiteSettingsForm from "./SiteSettingsForm";

export default async function Page() {
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Footer y contacto</h1>
        <p className="text-headline-sm text-white/50 mt-1">
          Ubicación, WhatsApp y redes sociales — se muestran en el pie de página de todo el sitio y en &quot;Visitanos&quot; del
          Home. El horario semanal se agrega en una próxima fase.
        </p>
      </div>
      <SiteSettingsForm initial={settings} />
    </div>
  );
}
