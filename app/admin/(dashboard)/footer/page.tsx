import { prisma } from "@/lib/db";
import FooterSettingsForm from "./FooterSettingsForm";

export default async function Page() {
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Footer</h1>
        <p className="text-headline-sm text-white/50 mt-1">
          WhatsApp y redes sociales — se muestran en el pie de página de todo el sitio.
        </p>
      </div>
      <FooterSettingsForm initial={settings} />
    </div>
  );
}
