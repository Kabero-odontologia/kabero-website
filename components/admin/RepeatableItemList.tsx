import ImageUploadField from "@/components/admin/ImageUploadField";

export interface RepeatableStepItem {
  num: string;
  title: string;
  desc: string;
  photo: string;
  alt: string;
}

interface RepeatableItemListProps {
  items: RepeatableStepItem[];
  /** Builds the form field name for one item's field, e.g. namePrefix(0, "title") -> "step1Title". */
  namePrefix: (index: number, field: "title" | "desc" | "photo" | "alt") => string;
  onFieldChange: (index: number, field: "title" | "desc" | "alt", value: string) => void;
}

// Renders a fixed-length list of {title, desc, image, alt} blocks — used today by
// "Cómo trabajamos" (always exactly 4 steps, no add/remove). Field names are flat
// per item (not bracket/array notation) to match this codebase's plain
// `formData.get("x")` convention in every other admin form. Title/desc/alt are
// controlled (value+onChange) so a failed or successful submit doesn't wipe them
// via React 19's automatic form.reset(); the image field manages its own safe
// internal state via ImageUploadField.
export default function RepeatableItemList({ items, namePrefix, onFieldChange }: RepeatableItemListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <fieldset
          key={i}
          className="flex flex-col gap-3 min-w-0 bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 h-full"
        >
          <legend className="px-1 text-title-md font-semibold text-white/45 tracking-wide">
            PASO {item.num}
          </legend>

          <ImageUploadField name={namePrefix(i, "photo")} label="IMAGEN" defaultValue={item.photo} />

          <div className="flex flex-col gap-1.5">
            <label className="text-title-md text-white/35 tracking-wide">TÍTULO</label>
            <input
              name={namePrefix(i, "title")}
              value={item.title}
              onChange={(e) => onFieldChange(i, "title", e.target.value)}
              className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-title-md text-white/35 tracking-wide">DESCRIPCIÓN</label>
            <input
              name={namePrefix(i, "desc")}
              value={item.desc}
              onChange={(e) => onFieldChange(i, "desc", e.target.value)}
              className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-title-md text-white/35 tracking-wide">TEXTO ALTERNATIVO</label>
            <input
              name={namePrefix(i, "alt")}
              value={item.alt}
              onChange={(e) => onFieldChange(i, "alt", e.target.value)}
              placeholder="Describe la foto"
              className="bg-white/[0.06] border border-white/10 rounded-md px-3 py-2 text-headline-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </fieldset>
      ))}
    </div>
  );
}
