"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { WEEKDAYS } from "@/lib/business-hours-shared";
import { translateFields } from "@/lib/translate";
import { revalidateLocalized } from "@/lib/page-sections";

export interface SiteSettingsFormState {
  error?: string;
  success?: boolean;
}

function revalidateSite() {
  revalidateLocalized("/");
  revalidatePath("/admin/paginas/home/contacto");
  revalidatePath("/admin/horario-contacto");
  revalidatePath("/admin/configuracion-sitio");
}

export async function updateUbicacion(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdminSession();

  const mapsQuery = String(formData.get("mapsQuery") ?? "").trim();
  const mapsLink = String(formData.get("mapsLink") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!mapsQuery || !mapsLink || !address) {
    return { error: "Completá el texto de búsqueda, el link de Google Maps y la dirección." };
  }

  await prisma.siteSettings.update({ where: { id: "singleton" }, data: { mapsQuery, mapsLink, address } });

  revalidateSite();
  return { success: true };
}

export async function updateFooterContacto(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdminSession();

  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const facebookUrl = String(formData.get("facebookUrl") ?? "").trim() || null;
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim() || null;
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim() || null;

  if (!whatsappNumber) {
    return { error: "Completá el número de WhatsApp." };
  }

  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { whatsappNumber, facebookUrl, instagramUrl, linkedinUrl },
  });

  revalidateSite();
  return { success: true };
}

export async function updateSeo(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdminSession();

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();

  if (!seoTitle || !seoDescription) {
    return { error: "Completá el título y la descripción para buscadores." };
  }

  const translations = await translateFields({ seoTitle, seoDescription });
  await prisma.siteSettings.update({ where: { id: "singleton" }, data: { seoTitle, seoDescription, translations } });

  revalidateSite();
  return { success: true };
}

export async function updateBusinessHours(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdminSession();

  const updates = WEEKDAYS.map((weekday) => {
    const isClosed = formData.get(`${weekday}_open`) !== "on";
    const starts = formData.getAll(`${weekday}_start`).map(String);
    const ends = formData.getAll(`${weekday}_end`).map(String);
    const ranges = isClosed
      ? []
      : starts
          .map((start, i) => ({ start, end: ends[i] ?? "" }))
          .filter((r) => r.start && r.end);
    return { weekday, isClosed, ranges };
  });

  await prisma.$transaction(
    updates.map((u) =>
      prisma.businessHours.upsert({
        where: { weekday: u.weekday },
        update: { isClosed: u.isClosed, ranges: u.ranges },
        create: u,
      })
    )
  );

  revalidateSite();
  return { success: true };
}
