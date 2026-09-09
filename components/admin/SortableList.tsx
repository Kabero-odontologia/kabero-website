"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface SortableListProps {
  /** Ids in display order — plain data, safe to pass from a Server Component. */
  ids: string[];
  onReorder: (orderedIds: string[]) => void;
  /** Pre-rendered row elements, each keyed by its id, in the same order as `ids`. */
  children: ReactNode;
  /** "grid" for multi-column layouts (e.g. Casos reales), "vertical" for a single column. */
  strategy?: "vertical" | "grid";
  className: string;
}

// Drag-and-drop reordering shared by every admin list (Tratamientos, Casos
// reales, Preguntas frecuentes, Equipo) — replaces the old up/down buttons.
// Takes rendered `children` (not a render-prop function) because a Server
// Component page can pass JSX elements as children to a Client Component,
// but not a plain closure like `renderItem` — that crosses the RSC boundary.
export default function SortableList({ ids, onReorder, children, strategy = "vertical", className }: SortableListProps) {
  const [order, setOrder] = useState(ids);

  useEffect(() => {
    // Re-syncs local (draggable) order whenever the server sends fresh ids —
    // e.g. after a delete or a visibility toggle elsewhere on the list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(ids);
  }, [ids]);

  // Reads `.key` directly off the passed-in elements rather than going through
  // Children.toArray/Children.map, which rewrite keys with a ".$" prefix for
  // their own reconciliation purposes and would break this id-based lookup.
  const childArray = (Array.isArray(children) ? children : [children]) as ReactElement[];
  const childrenByKey = new Map(childArray.map((child) => [String(child.key), child]));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      const next = arrayMove(prev, oldIndex, newIndex);
      onReorder(next);
      return next;
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={strategy === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className}>{order.map((id) => childrenByKey.get(id))}</div>
      </SortableContext>
    </DndContext>
  );
}
