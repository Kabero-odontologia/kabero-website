import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface RelatedTreatmentCardProps {
  slug: string;
  title: string;
  photo?: string;
  gradient: string;
}

export default function RelatedTreatmentCard({ slug, title, photo, gradient }: RelatedTreatmentCardProps) {
  return (
    <Link
      href={`/tratamientos/${slug}`}
      className="flex-1 bg-black-1 border border-black-4 rounded-lg p-3 lg:p-4 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      <div className={`relative h-[130px] rounded-[16px] overflow-hidden ${!photo ? gradient : ""}`}>
        {photo && (
          <Image src={photo} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        )}
      </div>
      <span className="text-headline-md font-semibold text-black-11">{title}</span>
    </Link>
  );
}
