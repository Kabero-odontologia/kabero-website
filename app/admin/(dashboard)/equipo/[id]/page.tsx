import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TeamMemberForm from "../TeamMemberForm";
import { updateTeamMember } from "../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Editar persona</h1>
      <TeamMemberForm action={updateTeamMember.bind(null, id)} initial={member} submitLabel="Guardar cambios" />
    </div>
  );
}
