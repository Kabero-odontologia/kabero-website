import Image from "next/image";
import { parseImageCrop, framingStyle } from "@/lib/image-crop";

interface CroppedImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

// Drop-in replacement for `<Image fill className="object-cover" />` that
// honors the pan/zoom framing an admin picked separately for mobile and
// desktop (see ImageCropField). Renders two <Image> instances toggled by
// breakpoint — for a URL with no crop params (the common case, and every
// image stored before this existed) both render identically to a plain
// object-cover image, so this is safe to use everywhere unconditionally.
export default function CroppedImage({ src, alt, sizes, className, priority }: CroppedImageProps) {
  const crop = parseImageCrop(src);
  if (!crop) return null;

  const cls = `object-cover ${className ?? ""}`;

  return (
    <>
      <Image
        src={crop.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`lg:hidden ${cls}`}
        style={framingStyle(crop.mobile)}
      />
      <Image
        src={crop.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`hidden lg:block ${cls}`}
        style={framingStyle(crop.desktop)}
      />
    </>
  );
}
