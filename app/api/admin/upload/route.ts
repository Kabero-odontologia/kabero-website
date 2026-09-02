import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdminSession } from "@/lib/auth";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 40 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const isVideo = file.type in ALLOWED_VIDEO_TYPES;
  const ext = isVideo ? ALLOWED_VIDEO_TYPES[file.type] : ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Formato no permitido. Usá JPG, PNG, WEBP, MP4 o WEBM." },
      { status: 400 }
    );
  }
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: isVideo ? "El video no puede pesar más de 40MB." : "La imagen no puede pesar más de 8MB." },
      { status: 400 }
    );
  }

  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
