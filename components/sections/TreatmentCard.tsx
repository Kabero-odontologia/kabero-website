import Image from "next/image";
import { Link } from "@/i18n/navigation";
import CroppedImage from "@/components/CroppedImage";

interface TreatmentCardProps {
  slug: string;
  title: string;
  desc: string;
  photo?: string;
  gradient?: string;
}

export default function TreatmentCard({ slug, title, desc, photo, gradient }: TreatmentCardProps) {
  return (
    <Link
      href={`/tratamientos/${slug}`}
      className="bg-black-1 rounded-lg lg:rounded-[24px] border border-black-2 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
    >
      <div className={`relative h-[160px] lg:h-[200px] shrink-0 ${!photo ? gradient : ""}`}>
        {photo && (
          <CroppedImage src={photo} alt={title} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        )}
        <span className="absolute left-4 lg:left-5 -bottom-[22px] lg:-bottom-[26px] w-11 h-11 lg:w-[52px] lg:h-[52px] rounded-full bg-orange-2 border-[3px] border-black-1 flex items-center justify-center">
          <Image src="/icon-dentist.svg" alt="" width={20} height={20} className="w-5 h-5 lg:w-6 lg:h-6" />
        </span>
      </div>
      <div className="px-5 lg:px-6 pt-6 pb-6 lg:pb-8 flex flex-col gap-2 lg:gap-3">
        <span className="text-headline-md font-semibold text-black-11">{title}</span>
        <span className="text-headline-sm text-black-7">{desc}</span>
      </div>
    </Link>
  );
}
