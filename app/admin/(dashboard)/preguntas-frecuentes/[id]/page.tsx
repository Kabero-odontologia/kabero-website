import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import FAQForm from "../FAQForm";
import { updateFAQ } from "../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Editar pregunta</h1>
      <FAQForm action={updateFAQ.bind(null, id)} initial={faq} submitLabel="Guardar cambios" />
    </div>
  );
}
