import Image from "next/image";
import Button from "@/components/ui/Button";

interface TreatmentsCTABannerProps {
  headline: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  photo: string;
}

export default function TreatmentsCTABanner({
  headline,
  subtitle,
  buttonLabel,
  buttonHref,
  photo,
}: TreatmentsCTABannerProps) {
  return (
    <div className="drop-shadow-[0px_14px_16px_rgba(0,0,0,0.16)] flex flex-col lg:flex-row items-stretch">
      <div className="relative bg-black-11 rounded-t-[32px] lg:rounded-t-none lg:rounded-l-[32px] flex justify-center items-end w-full lg:w-[560px] shrink-0 pt-10 lg:pt-0 overflow-visible">
        <div className="relative w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] shrink-0 -mt-16 lg:-mt-24">
          <Image
            src={photo}
            alt="Dr. Kevin Cabero"
            fill
            sizes="(max-width: 768px) 220px, 300px"
            className="object-contain object-bottom"
          />
        </div>
      </div>
      <div className="bg-black-11 rounded-b-[32px] lg:rounded-b-none lg:rounded-r-[32px] flex-1 flex flex-col justify-center gap-4 px-6 lg:px-14 py-10">
        <h2 className="text-display-md font-bold text-black-1 whitespace-pre-line">{headline}</h2>
        {subtitle && <p className="text-headline-md text-black-8 max-w-[500px]">{subtitle}</p>}
        <Button href={buttonHref} variant="primary" size="sm" className="self-start">
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
