"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { centeredHeroContentSchema } from "@/lib/page-sections/shared";
import { tratamientosCtaBandContentSchema } from "@/lib/page-sections/tratamientos";

export interface SectionFormState {
  error?: string;
  success?: boolean;
}

function revalidateTratamientos() {
  revalidatePath("/tratamientos");
}

async function upsertSection(key: string, content: object, visible: boolean) {
  await prisma.pageSection.upsert({
    where: { page_key: { page: "tratamientos", key } },
    update: { content, visible },
    create: { page: "tratamientos", key, content, visible },
  });
}

function firstIssueMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Revisá los campos, algo no es válido.";
}

function readVisible(formData: FormData): boolean {
  return formData.get("visible") === "on";
}

export async function updateTratamientosEncabezado(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = centeredHeroContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("centered-hero", parsed.data, readVisible(formData));
  revalidateTratamientos();
  return { success: true };
}

export async function updateTratamientosCtaBand(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = tratamientosCtaBandContentSchema.safeParse({
    headline: String(formData.get("headline") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    buttonLabel: String(formData.get("buttonLabel") ?? ""),
    buttonHref: String(formData.get("buttonHref") ?? ""),
    photo: String(formData.get("photo") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("cta-band", parsed.data, readVisible(formData));
  revalidateTratamientos();
  return { success: true };
}
