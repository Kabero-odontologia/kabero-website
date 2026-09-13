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

interface TreatmentOption {
  id: string;
  title: string;
  photo: string | null;
}

interface TreatmentMultiSelectProps {
  name: string;
  treatments: TreatmentOption[];
  defaultSelectedIds: string[];
  min?: number;
  max?: number;
}

function SelectedRow({ id, treatment, onRemove }: { id: string; treatment: TreatmentOption; onRemove: () => void }) {
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
        {treatment.photo && <Image src={treatment.photo} alt="" fill sizes="36px" className="object-cover" />}
      </div>
      <span className="flex-1 text-headline-sm text-white truncate">{treatment.title}</span>
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

export default function TreatmentMultiSelect({
  name,
  treatments,
  defaultSelectedIds,
  min = 2,
  max = 4,
}: TreatmentMultiSelectProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelectedIds);
  const byId = new Map(treatments.map((t) => [t.id, t]));

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
            ELEGIDAS — arrastrá para reordenar
          </span>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={selected} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {selected.map((id) => {
                  const t = byId.get(id);
                  if (!t) return null;
                  return <SelectedRow key={id} id={id} treatment={t} onRemove={() => toggle(id)} />;
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-title-md font-medium text-white/40 tracking-wide">TODOS LOS TRATAMIENTOS</span>
        <div className="flex flex-col gap-1">
          {treatments.map((t) => {
            const checked = selected.includes(t.id);
            const disabled = !checked && selected.length >= max;
            return (
              <label
                key={t.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  disabled ? "opacity-40" : "cursor-pointer hover:bg-white/[0.05]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(t.id)}
                  className="w-4 h-4 rounded accent-white"
                />
                <div className="relative w-8 h-8 rounded shrink-0 overflow-hidden bg-white/[0.06]">
                  {t.photo && <Image src={t.photo} alt="" fill sizes="32px" className="object-cover" />}
                </div>
                <span className="text-headline-sm text-white/80">{t.title}</span>
              </label>
            );
          })}
        </div>
      </div>

      <span className={`text-title-md ${selected.length < min ? "text-red-400" : "text-white/40"}`}>
        {selected.length < min
          ? `Elegí al menos ${min} (llevás ${selected.length})`
          : `${selected.length} de ${max} elegidas`}
      </span>
    </div>
  );
}
