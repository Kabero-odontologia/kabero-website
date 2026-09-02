import { getPageSection } from "@/lib/page-sections";
import { contactoContentSchema, contactoDefault } from "@/lib/page-sections/home";
import ContactoSectionForm from "./ContactoSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection("home", "contacto-intro", contactoContentSchema, contactoDefault);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Visitanos (texto)</h1>
      <ContactoSectionForm initial={content} visible={visible} />
    </div>
  );
}
