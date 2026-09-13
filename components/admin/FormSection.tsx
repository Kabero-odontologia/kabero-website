interface FormSectionProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

// Groups related fields into a visually distinct panel — used to break long
// forms into scannable chunks instead of one flat stack of identical inputs.
// `h-full` lets it stretch to match a taller sibling when placed side-by-side
// in a grid row (the grid's default `align-items: stretch` sizes the row —
// this makes the panel actually fill it instead of leaving a ragged gap).
export default function FormSection({ title, description, className = "", children }: FormSectionProps) {
  return (
    <section className={`flex flex-col h-full min-w-0 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden ${className}`}>
      <div className="flex flex-col gap-1 px-6 py-3.5 bg-white/[0.05] border-b border-white/[0.08]">
        <h2 className="text-headline-md font-semibold text-white">{title}</h2>
        {description && <p className="text-title-md text-white/40">{description}</p>}
      </div>
      <div className="flex flex-col gap-5 p-6">{children}</div>
    </section>
  );
}
