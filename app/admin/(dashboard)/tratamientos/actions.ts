"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface TreatmentFormState {
  error?: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function revalidateTreatments() {
  revalidatePath("/tratamientos");
  revalidatePath("/tratamientos/[slug]", "page");
  revalidatePath("/");
  revalidatePath("/casos-reales");
  revalidatePath("/admin/tratamientos");
}

function readTreatmentForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const shortDesc = String(formData.get("shortDesc") ?? "").trim();
  const fullDesc = String(formData.get("fullDesc") ?? "").trim();
  const gradient = String(formData.get("gradient") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim() || null;
  const heroPhoto = String(formData.get("heroPhoto") ?? "").trim() || null;
  const teamPhoto = String(formData.get("teamPhoto") ?? "").trim() || null;
  const heroFocalPosition = String(formData.get("heroFocalPosition") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";

  const gallery = formData
    .getAll("gallery")
    .map(String)
    .filter((url) => url.trim().length > 0);

  const offerTitles = formData.getAll("offerTitle").map(String);
  const offerDescs = formData.getAll("offerDesc").map(String);
  const offers = offerTitles
    .map((offerTitle, i) => ({ title: offerTitle.trim(), desc: (offerDescs[i] ?? "").trim() }))
    .filter((o) => o.title.length > 0);

  return {
    title,
    slug,
    shortDesc,
    fullDesc,
    gradient,
    photo,
    heroPhoto,
    teamPhoto,
    heroFocalPosition,
    visible,
    gallery,
    offers,
  };
}

function validateTreatmentForm(data: ReturnType<typeof readTreatmentForm>): string | null {
  if (!data.title || !data.slug || !data.shortDesc || !data.fullDesc || !data.gradient) {
    return "Completá título, slug, descripción corta, descripción completa y degradé.";
  }
  if (!SLUG_PATTERN.test(data.slug)) {
    return "El slug solo puede tener minúsculas, números y guiones (ej. mi-tratamiento).";
  }
  return null;
}

export async function createTreatment(
  _prevState: TreatmentFormState,
  formData: FormData
): Promise<TreatmentFormState> {
  await requireAdminSession();

  const data = readTreatmentForm(formData);
  const validationError = validateTreatmentForm(data);
  if (validationError) return { error: validationError };

  const existing = await prisma.treatment.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: "Ya existe un tratamiento con ese slug." };

  const maxOrder = await prisma.treatment.aggregate({ _max: { order: true } });

  await prisma.treatment.create({
    data: {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc,
      fullDesc: data.fullDesc,
      gradient: data.gradient,
      photo: data.photo,
      heroPhoto: data.heroPhoto,
      teamPhoto: data.teamPhoto,
      heroFocalPosition: data.heroFocalPosition,
      visible: data.visible,
      order: (maxOrder._max.order ?? -1) + 1,
      gallery: { create: data.gallery.map((url, order) => ({ url, order })) },
      offers: { create: data.offers.map((o, order) => ({ ...o, order })) },
    },
  });

  revalidateTreatments();
  redirect("/admin/tratamientos");
}

export async function updateTreatment(
  id: string,
  _prevState: TreatmentFormState,
  formData: FormData
): Promise<TreatmentFormState> {
  await requireAdminSession();

  const data = readTreatmentForm(formData);
  const validationError = validateTreatmentForm(data);
  if (validationError) return { error: validationError };

  const existing = await prisma.treatment.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) return { error: "Ya existe un tratamiento con ese slug." };

  await prisma.treatment.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc,
      fullDesc: data.fullDesc,
      gradient: data.gradient,
      photo: data.photo,
      heroPhoto: data.heroPhoto,
      teamPhoto: data.teamPhoto,
      heroFocalPosition: data.heroFocalPosition,
      visible: data.visible,
      gallery: { deleteMany: {}, create: data.gallery.map((url, order) => ({ url, order })) },
      offers: { deleteMany: {}, create: data.offers.map((o, order) => ({ ...o, order })) },
    },
  });

  revalidateTreatments();
  redirect("/admin/tratamientos");
}

export async function deleteTreatment(id: string): Promise<void> {
  await requireAdminSession();
  await prisma.treatment.delete({ where: { id } });
  revalidateTreatments();
}

export async function toggleTreatmentVisibility(id: string, visible: boolean): Promise<void> {
  await requireAdminSession();
  await prisma.treatment.update({ where: { id }, data: { visible } });
  revalidateTreatments();
}

export async function moveTreatment(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdminSession();

  const all = await prisma.treatment.findMany({ orderBy: { order: "asc" } });
  const index = all.findIndex((t) => t.id === id);
  if (index === -1) return;
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= all.length) return;

  const a = all[index];
  const b = all[swapIndex];

  await prisma.$transaction([
    prisma.treatment.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.treatment.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidateTreatments();
}
