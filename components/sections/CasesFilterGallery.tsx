"use client";

import { useState, useMemo } from "react";
import CaseCard from "@/components/sections/CaseCard";
import Pagination from "@/components/sections/Pagination";

const PAGE_SIZE = 9;

export interface CaseItem {
  id: string;
  tag: string;
  treatmentSlug: string | null;
  beforePhoto: string;
  afterPhoto: string;
}

interface CasesFilterGalleryProps {
  cases: CaseItem[];
  treatments: { slug: string; title: string }[];
}

export default function CasesFilterGallery({ cases, treatments }: CasesFilterGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (activeFilter === "todos") return cases;
    return cases.filter((c) => c.treatmentSlug === activeFilter);
  }, [cases, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function selectFilter(slug: string) {
    setActiveFilter(slug);
    setPage(1);
  }

  return (
    <>
      <div className="flex flex-nowrap gap-2 lg:gap-3 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 scrollbar-none">
        <button
          onClick={() => selectFilter("todos")}
          className={`shrink-0 px-5 py-3 rounded-full text-headline-sm lg:text-[13px] font-medium border transition-colors ${
            activeFilter === "todos"
              ? "bg-black-11 text-black-1 border-black-11"
              : "bg-black-1 text-black-8 border-black-4"
          }`}
        >
          Todos
        </button>
        {treatments.map((t) => (
          <button
            key={t.slug}
            onClick={() => selectFilter(t.slug)}
            className={`shrink-0 px-5 py-3 rounded-full text-headline-sm lg:text-[13px] font-medium border transition-colors ${
              activeFilter === t.slug
                ? "bg-black-11 text-black-1 border-black-11"
                : "bg-black-1 text-black-8 border-black-4"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {paged.length === 0 ? (
        <p className="text-headline-sm text-black-8 py-10 text-center">
          Todavía no hay casos cargados{activeFilter !== "todos" ? " para este tratamiento" : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {paged.map((c) => (
            <CaseCard key={c.id} tag={c.tag} beforePhoto={c.beforePhoto} afterPhoto={c.afterPhoto} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
