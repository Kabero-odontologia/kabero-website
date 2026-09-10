"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { translateFields } from "@/lib/translate";
import { revalidateLocalized } from "@/lib/page-sections";

export interface TreatmentFormState {
  error?: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function revalidateTreatments() {
  revalidateLocalized("/tratamientos");
  revalidatePath("/[locale]/tratamientos/[slug]", "page");
  revalidateLocalized("/");
  revalidateLocalized("/casos-reales");
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

// Translates the treatment's own fields and every offer's fields together, in
// parallel — offers are deleted and recreated on every save anyway (see
// `offers: { deleteMany, create }` below), so there's no incremental
// translation to preserve, just translate whatever is being written now.
async function translateTreatment(data: ReturnType<typeof readTreatmentForm>) {
  const [treatmentTranslations, offerTranslations] = await Promise.all([
    translateFields({ title: data.title, shortDesc: data.shortDesc, fullDesc: data.fullDesc }),
    Promise.all(data.offers.map((o) => translateFields({ title: o.title, desc: o.desc }))),
  ]);
  return { treatmentTranslations, offerTranslations };
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
  const { treatmentTranslations, offerTranslations } = await translateTreatment(data);

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
      translations: treatmentTranslations,
      gallery: { create: data.gallery.map((url, order) => ({ url, order })) },
      offers: {
        create: data.offers.map((o, order) => ({ ...o, order, translations: offerTranslations[order] })),
      },
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

  const { treatmentTranslations, offerTranslations } = await translateTreatment(data);

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
      translations: treatmentTranslations,
      gallery: { deleteMany: {}, create: data.gallery.map((url, order) => ({ url, order })) },
      offers: {
        deleteMany: {},
        create: data.offers.map((o, order) => ({ ...o, order, translations: offerTranslations[order] })),
      },
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

export async function reorderTreatments(orderedIds: string[]): Promise<void> {
  await requireAdminSession();

  await prisma.$transaction(
    orderedIds.map((id, order) => prisma.treatment.update({ where: { id }, data: { order } }))
  );

  revalidateTreatments();
}
