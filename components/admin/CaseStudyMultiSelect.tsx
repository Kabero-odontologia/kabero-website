"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@/components/admin/DragHandleIcon";

interface CaseStudyOption {
  id: string;
  photo: string;
  tag: string;
  treatmentId: string | null;
}

interface CaseStudyMultiSelectProps {
  name: string;
  caseStudies: CaseStudyOption[];
  treatments: { id: string; title: string }[];
  defaultSelectedIds: string[];
  max?: number;
}

function SelectedRow({ id, caseStudy, onRemove }: { id: string; caseStudy: CaseStudyOption; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-white/[0.05] border border-white/[0.10] rounded-md px-3 py-2 ${
        isDragging ? "opacity-60 z-10 relative" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="w-7 h-7 rounded flex items-center justify-center text-white/35 hover:bg-white/[0.08] hover:text-white/70 cursor-grab active:cursor-grabbing transition-colors touch-none shrink-0"
        aria-label="Arrastrar para reordenar"
      >
        <DragHandleIcon />
      </button>
      <div className="relative w-9 h-9 rounded shrink-0 overflow-hidden bg-white/[0.06]">
        <Image src={caseStudy.photo} alt="" fill sizes="36px" className="object-cover" />
      </div>
      <span className="flex-1 text-headline-sm text-white truncate">{caseStudy.tag}</span>
      <button
        type="button"
        onClick={onRemove}
        className="w-7 h-7 rounded flex items-center justify-center text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0"
        aria-label="Quitar"
      >
        ✕
      </button>
    </div>
  );
}

export default function CaseStudyMultiSelect({
  name,
  caseStudies,
  treatments,
  defaultSelectedIds,
  max = 3,
}: CaseStudyMultiSelectProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelectedIds);
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const byId = new Map(caseStudies.map((c) => [c.id, c]));

  const filtered = activeFilter === "todos" ? caseStudies : caseStudies.filter((c) => c.treatmentId === activeFilter);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < max ? [...prev, id] : prev));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSelected((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {selected.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-title-md font-medium text-white/40 tracking-wide">
            ELEGIDOS — arrastrá para reordenar
          </span>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={selected} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {selected.map((id) => {
                  const c = byId.get(id);
                  if (!c) return null;
                  return <SelectedRow key={id} id={id} caseStudy={c} onRemove={() => toggle(id)} />;
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-title-md font-medium text-white/40 tracking-wide">TODOS LOS CASOS</span>

        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter("todos")}
            className={`shrink-0 px-4 py-2 rounded-full text-title-md font-medium border transition-colors ${
              activeFilter === "todos"
                ? "bg-white text-black border-white"
                : "bg-white/[0.05] text-white/60 border-white/10 hover:text-white/85"
            }`}
          >
            Todos
          </button>
          {treatments.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveFilter(t.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-title-md font-medium border transition-colors ${
                activeFilter === t.id
                  ? "bg-white text-black border-white"
                  : "bg-white/[0.05] text-white/60 border-white/10 hover:text-white/85"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-title-md text-white/35 py-6 text-center">No hay casos para esta especialidad.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {filtered.map((c) => {
              const index = selected.indexOf(c.id);
              const checked = index !== -1;
              const disabled = !checked && selected.length >= max;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.tag}
                  disabled={disabled}
                  onClick={() => toggle(c.id)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    checked ? "border-white" : "border-transparent hover:border-white/25"
                  } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <Image src={c.photo} alt={c.tag} fill sizes="80px" className="object-cover" />
                  {checked && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-bold">
                      {index + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <span className="text-title-md text-white/40">
        {selected.length === 0
          ? `Ninguno elegido — se muestran automáticamente los primeros ${max} visibles de Casos reales`
          : `${selected.length} de ${max} elegidos`}
      </span>
    </div>
  );
}
