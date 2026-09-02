"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface SiteSettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdminSession();

  const mapsQuery = String(formData.get("mapsQuery") ?? "").trim();
  const mapsLink = String(formData.get("mapsLink") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const facebookUrl = String(formData.get("facebookUrl") ?? "").trim() || null;
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim() || null;
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim() || null;

  if (!mapsQuery || !mapsLink || !whatsappNumber || !address) {
    return { error: "Completá ubicación, link de Google Maps, WhatsApp y dirección." };
  }

  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { mapsQuery, mapsLink, whatsappNumber, address, facebookUrl, instagramUrl, linkedinUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/horario-contacto");
  return { success: true };
}
