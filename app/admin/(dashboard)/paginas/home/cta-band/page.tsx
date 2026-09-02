import { getPageSection } from "@/lib/page-sections";
import { ctaBandContentSchema } from "@/lib/page-sections/shared";
import { homeCtaBandDefault } from "@/lib/page-sections/home";
import CtaBandSectionForm from "@/components/admin/CtaBandSectionForm";
import { updateCtaBandSection } from "../actions";

export default async function Page() {
  const { content, visible } = await getPageSection("home", "cta-band", ctaBandContentSchema, homeCtaBandDefault);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Banner final (¿Empezamos con tu diagnóstico?)</h1>
      <CtaBandSectionForm
        action={updateCtaBandSection}
        initial={content}
        visible={visible}
        cancelHref="/admin/paginas/home"
      />
    </div>
  );
}
