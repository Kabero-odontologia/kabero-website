import Image from "next/image";
import { useTranslations } from "next-intl";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function pageList(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const withDots: (number | "...")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) withDots.push("...");
    withDots.push(p);
  });
  return withDots;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations("Pagination");
  if (totalPages <= 1) return null;

  return (
    <nav className="flex gap-2 items-center justify-center" aria-label={t("paginacion")}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label={t("paginaAnterior")}
        className="w-10 h-10 rounded-full bg-black-1 border border-black-4 flex items-center justify-center disabled:opacity-40 hover:border-black-6 transition-colors"
      >
        <Image src="/icon-chevron-left.svg" alt="" width={16} height={16} />
      </button>

      {pageList(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="text-headline-sm font-medium text-black-6 px-1">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-headline-sm transition-colors ${
              p === page ? "bg-orange-6 text-black-1 font-semibold" : "bg-black-1 text-black-7 font-medium hover:bg-black-2"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label={t("paginaSiguiente")}
        className="w-10 h-10 rounded-full bg-black-1 border border-black-4 flex items-center justify-center disabled:opacity-40 hover:border-black-6 transition-colors"
      >
        <Image src="/icon-chevron-right.svg" alt="" width={16} height={16} />
      </button>
    </nav>
  );
}
