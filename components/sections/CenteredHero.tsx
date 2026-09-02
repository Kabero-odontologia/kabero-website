interface CenteredHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function CenteredHero({ eyebrow, title, subtitle }: CenteredHeroProps) {
  return (
    <section className="flex flex-col items-center text-center gap-3 lg:gap-4 py-6">
      <span className="text-title-lg font-medium text-orange-6 tracking-wide">{eyebrow}</span>
      <h1 className="text-display-sm lg:text-display-lg font-bold max-w-[700px] text-black-11">{title}</h1>
      <p className="text-headline-sm lg:text-headline-md text-black-8 lg:text-black-6 max-w-[560px]">{subtitle}</p>
    </section>
  );
}
