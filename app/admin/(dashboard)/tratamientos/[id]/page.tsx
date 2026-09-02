import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TreatmentForm from "../TreatmentForm";
import { updateTreatment } from "../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const treatment = await prisma.treatment.findUnique({
    where: { id },
    include: {
      gallery: { orderBy: { order: "asc" } },
      offers: { orderBy: { order: "asc" } },
    },
  });
  if (!treatment) notFound();

  const initial = {
    title: treatment.title,
    slug: treatment.slug,
    shortDesc: treatment.shortDesc,
    fullDesc: treatment.fullDesc,
    gradient: treatment.gradient,
    photo: treatment.photo,
    heroPhoto: treatment.heroPhoto,
    teamPhoto: treatment.teamPhoto,
    heroFocalPosition: treatment.heroFocalPosition,
    visible: treatment.visible,
    gallery: treatment.gallery.map((g) => g.url),
    offers: treatment.offers.map((o) => ({ title: o.title, desc: o.desc })),
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Editar tratamiento</h1>
      <TreatmentForm action={updateTreatment.bind(null, id)} initial={initial} submitLabel="Guardar cambios" />
    </div>
  );
}
