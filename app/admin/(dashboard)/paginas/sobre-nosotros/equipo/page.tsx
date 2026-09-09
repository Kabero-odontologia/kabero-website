import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPageSection } from "@/lib/page-sections";
import { equipoIntroContentSchema, equipoIntroDefault } from "@/lib/page-sections/sobre-nosotros";
import SortableList from "@/components/admin/SortableList";
import TeamMemberRow from "@/app/admin/(dashboard)/equipo/TeamMemberRow";
import { reorderTeamMembers } from "@/app/admin/(dashboard)/equipo/actions";
import EquipoIntroSectionForm from "./EquipoIntroSectionForm";

export default async function Page() {
  const [{ content, visible }, members] = await Promise.all([
    getPageSection("sobre-nosotros", "equipo-intro", equipoIntroContentSchema, equipoIntroDefault),
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Equipo</h1>
      <EquipoIntroSectionForm initial={content} visible={visible} />

      <div className="h-px bg-white/[0.08] max-w-[640px]" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-lg font-semibold text-white">Personas del equipo</h2>
          <p className="text-headline-sm text-white/45 mt-1">Se muestran en la grilla, debajo del texto de arriba.</p>
        </div>
        <Link
          href="/admin/equipo/nuevo"
          className="shrink-0 inline-flex items-center justify-center rounded-md bg-white/[0.14] backdrop-blur-md border border-white/[0.20] text-white hover:bg-white/[0.20] transition-colors text-headline-sm font-semibold px-6 py-3.5"
        >
          + Agregar persona
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-10 flex flex-col items-center gap-2 text-center">
          <span className="text-headline-md font-semibold text-white/80">Todavía no hay personas cargadas</span>
        </div>
      ) : (
        <SortableList ids={members.map((m) => m.id)} onReorder={reorderTeamMembers} className="flex flex-col gap-3">
          {members.map((m) => (
            <TeamMemberRow key={m.id} id={m.id} name={m.name} specialty={m.specialty} photo={m.photo} visible={m.visible} />
          ))}
        </SortableList>
      )}
    </div>
  );
}
