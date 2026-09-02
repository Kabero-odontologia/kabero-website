"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  heroContentSchema,
  especialidadesContentSchema,
  casosDeExitoContentSchema,
  videoSectionContentSchema,
  howItWorksContentSchema,
  contactoContentSchema,
} from "@/lib/page-sections/home";
import { ctaBandContentSchema } from "@/lib/page-sections/shared";

export interface SectionFormState {
  error?: string;
  success?: boolean;
}

function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/admin/paginas/home");
}

async function upsertSection(key: string, content: object, visible: boolean) {
  await prisma.pageSection.upsert({
    where: { page_key: { page: "home", key } },
    update: { content, visible },
    create: { page: "home", key, content, visible },
  });
}

function firstIssueMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Revisá los campos, algo no es válido.";
}

function readVisible(formData: FormData): boolean {
  return formData.get("visible") === "on";
}

export async function updateHeroSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = heroContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    photo: String(formData.get("photo") ?? ""),
    badgeNumber: String(formData.get("badgeNumber") ?? ""),
    badgeLabel: [String(formData.get("badgeLabelLine1") ?? ""), String(formData.get("badgeLabelLine2") ?? "")],
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };
  if (!parsed.data.photo) return { error: "Subí la foto del hero." };

  await upsertSection("hero", parsed.data, readVisible(formData));
  revalidateHome();
  return { success: true };
}

export async function updateEspecialidadesSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = especialidadesContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    treatmentIds: formData.getAll("treatmentIds").map(String),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("especialidades-intro", parsed.data, readVisible(formData));
  revalidateHome();
  return { success: true };
}

export async function updateCasosDeExitoSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = casosDeExitoContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("casos-de-exito-intro", parsed.data, readVisible(formData));
  revalidateHome();
  return { success: true };
}

export async function updateVideoSectionSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const mediaType = String(formData.get("mediaType") ?? "image");
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;
  if (mediaType === "video" && !videoUrl) {
    return { error: "Subí un video, o cambiá a modo imagen." };
  }

  const parsed = videoSectionContentSchema.safeParse({
    heading: String(formData.get("heading") ?? ""),
    eyebrowDesktop: String(formData.get("eyebrowDesktop") ?? ""),
    mediaType,
    backgroundPhoto: String(formData.get("backgroundPhoto") ?? ""),
    videoUrl,
    stats: [1, 2, 3].map((n) => ({
      value: String(formData.get(`stat${n}Value`) ?? ""),
      label: [String(formData.get(`stat${n}Label1`) ?? ""), String(formData.get(`stat${n}Label2`) ?? "")],
    })),
    locationLine1: String(formData.get("locationLine1") ?? ""),
    locationLine2: String(formData.get("locationLine2") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };
  if (!parsed.data.backgroundPhoto) return { error: "Subí la foto de fondo." };

  await upsertSection("video-section", parsed.data, readVisible(formData));
  revalidateHome();
  return { success: true };
}

export async function updateHowItWorksSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = howItWorksContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    steps: [1, 2, 3, 4].map((n) => ({
      num: `0${n}`,
      title: String(formData.get(`step${n}Title`) ?? ""),
      desc: String(formData.get(`step${n}Desc`) ?? ""),
      photo: String(formData.get(`step${n}Photo`) ?? ""),
      alt: String(formData.get(`step${n}Alt`) ?? ""),
    })),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };
  if (parsed.data.steps.some((s) => !s.photo)) return { error: "Cada paso necesita su imagen." };

  await upsertSection("how-it-works", parsed.data, readVisible(formData));
  revalidateHome();
  return { success: true };
}

export async function updateContactoSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = contactoContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("contacto-intro", parsed.data, readVisible(formData));
  revalidateHome();
  return { success: true };
}

export async function updateCtaBandSection(
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
  revalidateHome();
  return { success: true };
}
