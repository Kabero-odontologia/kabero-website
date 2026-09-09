import CroppedImage from "@/components/CroppedImage";
import VideoLightboxButton from "@/components/sections/VideoLightboxButton";
import type { VideoSectionContent } from "@/lib/page-sections/home";

export default function VideoSection({ content }: { content: VideoSectionContent }) {
  const stats = content.stats;
  const showVideoButton = content.mediaType === "video" && content.videoUrl;

  return (
    <section className="w-full">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-14 lg:pt-14 pb-8 lg:pb-[112px]">
        {/* Mobile layout: video card, then a separate stacked stats card below */}
        <div className="flex lg:hidden flex-col gap-5">
          <div className="relative h-[238px] rounded-[24px] border border-black-4 overflow-hidden">
            <CroppedImage src={content.backgroundPhoto} alt="Interior de la clínica Kabero" sizes="100vw" />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
              <h2 className="text-display-sm font-bold text-black-1 [text-shadow:0px_4px_14px_rgba(0,0,0,0.25)]">
                {content.heading}
              </h2>
              {showVideoButton && <VideoLightboxButton videoUrl={content.videoUrl!} size={60} />}
            </div>
          </div>

          <div className="rounded-[24px] bg-gradient-to-b from-orange-6 to-orange-7 p-5 flex flex-col gap-4">
            {stats.map((s) => (
              <div key={s.value} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-black-3">
                  <span className="text-display-sm font-bold shrink-0">{s.value}</span>
                  <span className="text-title-lg">{s.label.join(" ")}</span>
                </div>
                <div className="h-px bg-black-1/20 w-full" />
              </div>
            ))}
            <div className="flex items-center gap-3 text-black-3">
              <span className="text-headline-md font-bold shrink-0">{content.locationLine1}</span>
              <span className="text-title-lg">{content.locationLine2}</span>
            </div>
          </div>
        </div>

        {/* Desktop layout: video card with the stats bar overlapping its bottom edge */}
        <div className="hidden lg:block relative h-[485px]">
          <div className="absolute inset-0 rounded-[32px] overflow-hidden">
            <CroppedImage src={content.backgroundPhoto} alt="Interior de la clínica Kabero" sizes="100vw" />
            <div className="absolute inset-0 bg-black/35" />

            <div className="relative h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-headline-sm font-medium text-black-6">{content.eyebrowDesktop}</span>
                <h2 className="text-display-sm font-bold text-black-1 [text-shadow:0px_4px_14px_rgba(0,0,0,0.25)]">
                  {content.heading}
                </h2>
              </div>
              {showVideoButton && <VideoLightboxButton videoUrl={content.videoUrl!} size={72} />}
            </div>
          </div>

          <div className="absolute left-14 right-14 -bottom-[58px] rounded-[28px] shadow-[0px_14px_32px_0px_rgba(0,0,0,0.16)] bg-gradient-to-b from-orange-6 to-orange-7 overflow-hidden">
            <div className="flex flex-row items-center px-12 py-5">
              {stats.map((s, i) => (
                <div key={s.value} className="flex items-center gap-0 w-auto flex-1">
                  {i > 0 && <div className="block w-px h-10 bg-black-1/20 mr-8" />}
                  <div className="flex items-center gap-3 justify-start w-full">
                    <span className="text-display-sm font-bold text-black-1">{s.value}</span>
                    <span className="text-headline-sm font-medium text-black-1 leading-tight">
                      {s.label[0]}
                      <br />
                      {s.label[1]}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-0 w-auto flex-1">
                <div className="block w-px h-10 bg-black-1/20 mr-8" />
                <div className="flex flex-col items-start w-full">
                  <span className="text-headline-lg font-bold text-black-1">{content.locationLine1}</span>
                  <span className="text-headline-sm font-medium text-black-1">{content.locationLine2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
