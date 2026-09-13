import { getPageSection } from "@/lib/page-sections";
import { videoSectionContentSchema, videoSectionDefault } from "@/lib/page-sections/home";
import VideoSectionForm from "./VideoSectionForm";

export default async function Page() {
  const { content, visible } = await getPageSection(
    "home",
    "video-section",
    videoSectionContentSchema,
    videoSectionDefault
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display-sm font-bold text-white">Sección multimedia de la clínica</h1>
      <VideoSectionForm initial={content} visible={visible} />
    </div>
  );
}
