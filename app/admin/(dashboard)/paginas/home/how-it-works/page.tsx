import { getPageSection } from "@/lib/page-sections";
import { howItWorksContentSchema, howItWorksDefault } from "@/lib/page-sections/home";
import HowItWorksSectionForm from "./HowItWorksSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "home",
    "how-it-works",
    howItWorksContentSchema,
    howItWorksDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Cómo trabajamos</h1>
      <HowItWorksSectionForm initial={content} visible={visible} />
    </div>
  );
}
