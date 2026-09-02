export default function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">{title}</h1>
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-lg p-10 flex flex-col items-center gap-2 text-center">
        <span className="text-headline-md font-semibold text-white/80">Esta sección todavía no está lista</span>
        <span className="text-headline-sm text-white/45 max-w-[420px]">
          Se construye en {phase}. El sitio público sigue mostrando el contenido actual mientras tanto.
        </span>
      </div>
    </div>
  );
}
