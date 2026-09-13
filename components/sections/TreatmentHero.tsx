import CroppedImage from "@/components/CroppedImage";

interface TreatmentHeroProps {
  title: string;
  subtitle: string;
  photo: string;
}

export default function TreatmentHero({ title, subtitle, photo }: TreatmentHeroProps) {
  return (
    <section className="relative rounded-[24px] lg:rounded-[32px] overflow-hidden py-5 lg:py-10 px-5 lg:px-6 flex flex-col items-center justify-center gap-2 lg:gap-4 text-center">
      <CroppedImage src={photo} alt="" sizes="100vw" priority />
      <div className="absolute inset-0 bg-white/50" />

      <span className="relative text-title-lg font-medium text-orange-7 tracking-wide">
        Tratamientos&nbsp;&nbsp;/&nbsp;&nbsp;{title}
      </span>
      <h1 className="relative text-display-sm lg:text-display-lg font-bold text-black-11">{title}</h1>
      <p className="relative text-headline-sm lg:text-headline-md text-black-11 lg:text-black-8 max-w-[560px]">
        {subtitle}
      </p>
    </section>
  );
}
