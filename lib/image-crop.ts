import type { CSSProperties } from "react";

// Image crop/zoom framing, encoded directly as query params on the stored
// image URL (e.g. "/uploads/x.jpg?dx=60&dy=40&dz=1.4") instead of a new DB
// column — every `photo`/`beforePhoto`/etc. field across the schema stays a
// plain string, so this needed zero migrations. A URL with no params behaves
// exactly like a plain URL always did (centered, no zoom) — fully backward
// compatible with every image already stored before this existed.
export interface CropFraming {
  x: number; // 0-100, focal point as % of image width
  y: number; // 0-100, focal point as % of image height
  zoom: number; // 1 = no zoom
}

export interface ImageCropData {
  src: string;
  desktop: CropFraming;
  mobile: CropFraming;
}

export const DEFAULT_FRAMING: CropFraming = { x: 50, y: 50, zoom: 1 };

function isDefaultFraming(f: CropFraming): boolean {
  return f.x === 50 && f.y === 50 && f.zoom === 1;
}

export function parseImageCrop(raw: string | null | undefined): ImageCropData | null {
  if (!raw) return null;
  const [src, query] = raw.split("?");
  if (!src) return null;
  if (!query) return { src, desktop: DEFAULT_FRAMING, mobile: DEFAULT_FRAMING };

  const params = new URLSearchParams(query);
  const num = (key: string, fallback: number) => {
    const v = params.get(key);
    const n = v === null ? NaN : parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  };

  return {
    src,
    desktop: { x: num("dx", 50), y: num("dy", 50), zoom: num("dz", 1) },
    mobile: { x: num("mx", 50), y: num("my", 50), zoom: num("mz", 1) },
  };
}

export function serializeImageCrop(data: ImageCropData): string {
  const { src, desktop, mobile } = data;
  if (isDefaultFraming(desktop) && isDefaultFraming(mobile)) return src;

  const params = new URLSearchParams();
  if (!isDefaultFraming(desktop)) {
    params.set("dx", String(Math.round(desktop.x * 10) / 10));
    params.set("dy", String(Math.round(desktop.y * 10) / 10));
    params.set("dz", String(Math.round(desktop.zoom * 100) / 100));
  }
  if (!isDefaultFraming(mobile)) {
    params.set("mx", String(Math.round(mobile.x * 10) / 10));
    params.set("my", String(Math.round(mobile.y * 10) / 10));
    params.set("mz", String(Math.round(mobile.zoom * 100) / 100));
  }
  return `${src}?${params.toString()}`;
}

// CSS to place the focal point at the center of a `fill` + `object-cover`
// element and then zoom in around that same point — since object-cover with
// this object-position already fully covers the frame with no gaps, scaling
// up around the same origin only ever adds more coverage, never reveals an
// edge. This is why panning + zooming compose correctly with zero clamping.
export function framingStyle(f: CropFraming): CSSProperties {
  return {
    objectPosition: `${f.x}% ${f.y}%`,
    transform: f.zoom !== 1 ? `scale(${f.zoom})` : undefined,
    transformOrigin: `${f.x}% ${f.y}%`,
  };
}
