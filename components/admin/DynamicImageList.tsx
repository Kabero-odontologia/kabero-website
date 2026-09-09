"use client";

import { useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface DynamicImageListProps {
  name: string;
  defaultValues: string[];
}

let idCounter = 0;

// Add/remove list of image uploads sharing one form field `name` — each
// ImageUploadField renders its own hidden input with that name, so the server
// just reads `formData.getAll(name)` to get every non-empty URL in order.
export default function DynamicImageList({ name, defaultValues }: DynamicImageListProps) {
  const [items, setItems] = useState(() =>
    (defaultValues.length > 0 ? defaultValues : [""]).map((value) => ({ id: idCounter++, value }))
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="flex flex-col gap-2 min-w-0 bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
            <ImageUploadField name={name} label={`IMAGEN ${i + 1}`} defaultValue={item.value} clearable />
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
              className="self-start px-2 text-title-md font-medium text-red-400/70 hover:text-red-400 transition-colors"
            >
              Quitar de la galería
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { id: idCounter++, value: "" }])}
        className="self-start px-4 py-2.5 rounded-md bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors text-headline-sm font-medium"
      >
        + Agregar imagen
      </button>
    </div>
  );
}
