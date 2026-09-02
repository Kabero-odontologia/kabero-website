import { getPageSection } from "@/lib/page-sections";
import { heroContentSchema, heroDefault } from "@/lib/page-sections/home";
import HeroSectionForm from "./HeroSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection("home", "hero", heroContentSchema, heroDefault);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Hero</h1>
      <HeroSectionForm initial={content} visible={visible} />
    </div>
  );
}
