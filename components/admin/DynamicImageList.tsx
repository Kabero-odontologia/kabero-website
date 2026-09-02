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
      {items.map((item, i) => (
        <div key={item.id} className="flex items-end gap-3">
          <div className="flex-1">
            <ImageUploadField name={name} label={`IMAGEN ${i + 1}`} defaultValue={item.value} clearable />
          </div>
          <button
            type="button"
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
            className="px-3 py-2.5 rounded-md text-title-md font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            Quitar
          </button>
        </div>
      ))}
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
