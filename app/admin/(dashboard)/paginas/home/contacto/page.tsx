import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { contactoContentSchema, contactoDefault } from "@/lib/page-sections/home";
import { getBusinessHours } from "@/lib/business-hours";
import BusinessHoursForm from "@/app/admin/(dashboard)/horario-contacto/BusinessHoursForm";
import ContactoSectionForm from "./ContactoSectionForm";
import UbicacionForm from "./UbicacionForm";

export default async function Page() {
  const [{ content, visible }, settings, businessHours] = await Promise.all([
    getPageSection("home", "contacto-intro", contactoContentSchema, contactoDefault),
    prisma.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } }),
    getBusinessHours(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-display-sm font-bold text-white">Visitanos</h1>

      <ContactoSectionForm initial={content} visible={visible} />

      <div className="h-px bg-white/[0.08]" />

      <UbicacionForm initial={settings} />

      <div className="h-px bg-white/[0.08]" />

      <BusinessHoursForm initial={businessHours} />
    </div>
  );
}
