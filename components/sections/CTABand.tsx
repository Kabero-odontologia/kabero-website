import Image from "next/image";
import Button from "@/components/ui/Button";

interface CTABandProps {
  headline: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage?: string | null;
  backgroundFrom?: string | null;
  backgroundTo?: string | null;
}

export default function CTABand({
  headline,
  subtitle,
  buttonLabel,
  buttonHref,
  backgroundImage,
  backgroundFrom,
  backgroundTo,
}: CTABandProps) {
  const style =
    !backgroundImage && backgroundFrom && backgroundTo
      ? { background: `linear-gradient(180deg, ${backgroundFrom}, ${backgroundTo})` }
      : !backgroundImage
        ? { background: "linear-gradient(180deg, #161616 57.679%, #FFFFFF 294.29%)" }
        : undefined;

  return (
    <div
      className="relative w-full rounded-[28px] lg:rounded-[32px] px-6 lg:px-14 py-8 lg:py-10 flex flex-col items-center justify-center text-center gap-4 drop-shadow-[0px_14px_16px_rgba(0,0,0,0.16)] overflow-hidden"
      style={style}
    >
      {backgroundImage && (
        <>
          <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <h2 className="relative text-display-sm lg:text-display-md font-bold text-black-1 whitespace-pre-line">
        {headline}
      </h2>
      <p className="relative text-headline-sm lg:text-headline-md text-black-6 lg:text-black-8 max-w-[520px]">
        {subtitle}
      </p>
      <Button href={buttonHref} variant="primary" size="sm" className="relative">
        {buttonLabel}
      </Button>
    </div>
  );
}
