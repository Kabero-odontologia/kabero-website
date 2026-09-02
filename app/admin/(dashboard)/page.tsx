import { prisma } from "@/lib/db";

async function getCounts() {
  const [treatments, caseStudies, faqs, team] = await Promise.all([
    prisma.treatment.count(),
    prisma.caseStudy.count(),
    prisma.fAQ.count(),
    prisma.teamMember.count(),
  ]);
  return { treatments, caseStudies, faqs, team };
}

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-6 flex flex-col gap-2">
      <span className="text-headline-sm text-white/50">{label}</span>
      <span className="text-display-md font-bold text-white">{value}</span>
      {hint && <span className="text-title-lg text-white/35">{hint}</span>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-sm font-bold text-white">Dashboard</h1>
        <p className="text-headline-sm text-white/50 mt-1">Resumen del contenido del sitio.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Tratamientos" value={counts.treatments} />
        <StatCard
          label="Casos reales"
          value={counts.caseStudies}
          hint={counts.caseStudies === 0 ? "Sin fotos cargadas" : undefined}
        />
        <StatCard label="Equipo" value={counts.team} />
        <StatCard label="Preguntas frecuentes" value={counts.faqs} />
      </div>

      {counts.caseStudies === 0 && (
        <div className="bg-white/[0.05] border border-white/[0.12] rounded-lg p-5 flex flex-col gap-1">
          <span className="text-headline-sm font-semibold text-white">Casos reales está vacío</span>
          <span className="text-headline-sm text-white/60">
            La sección &quot;Casos reales&quot; del sitio no tiene fotos todavía. Cargá los primeros casos desde acá.
          </span>
        </div>
      )}
    </div>
  );
}
