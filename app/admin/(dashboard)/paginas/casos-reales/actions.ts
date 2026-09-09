"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { centeredHeroContentSchema, ctaBandContentSchema } from "@/lib/page-sections/shared";

export interface SectionFormState {
  error?: string;
  success?: boolean;
}

function revalidateCasosReales() {
  revalidatePath("/casos-reales");
}

async function upsertSection(key: string, content: object, visible: boolean) {
  await prisma.pageSection.upsert({
    where: { page_key: { page: "casos-reales", key } },
    update: { content, visible },
    create: { page: "casos-reales", key, content, visible },
  });
}

function firstIssueMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Revisá los campos, algo no es válido.";
}

function readVisible(formData: FormData): boolean {
  return formData.get("visible") === "on";
}

export async function updateCasosRealesEncabezado(
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
  revalidateCasosReales();
  return { success: true };
}

export async function updateCasosRealesCtaBand(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = ctaBandContentSchema.safeParse({
    headline: String(formData.get("headline") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    buttonLabel: String(formData.get("buttonLabel") ?? ""),
    buttonHref: String(formData.get("buttonHref") ?? ""),
    backgroundImage: String(formData.get("backgroundImage") ?? "").trim() || null,
    backgroundFrom: String(formData.get("backgroundFrom") ?? "").trim() || null,
    backgroundTo: String(formData.get("backgroundTo") ?? "").trim() || null,
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("cta-band", parsed.data, readVisible(formData));
  revalidateCasosReales();
  return { success: true };
}
