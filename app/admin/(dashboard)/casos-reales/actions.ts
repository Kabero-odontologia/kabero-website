"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { translateFields } from "@/lib/translate";
import { revalidateLocalized } from "@/lib/page-sections";

export interface CaseStudyFormState {
  error?: string;
}

function revalidatePublicPaths() {
  revalidateLocalized("/");
  revalidateLocalized("/casos-reales");
  revalidatePath("/[locale]/tratamientos/[slug]", "page");
}

function readCaseStudyForm(formData: FormData) {
  const treatmentId = String(formData.get("treatmentId") ?? "").trim() || null;
  const tagOverride = String(formData.get("tagOverride") ?? "").trim() || null;
  const beforePhoto = String(formData.get("beforePhoto") ?? "").trim();
  const afterPhoto = String(formData.get("afterPhoto") ?? "").trim();
  const visible = formData.get("visible") === "on";
  return { treatmentId, tagOverride, beforePhoto, afterPhoto, visible };
}

export async function createCaseStudy(
  _prevState: CaseStudyFormState,
  formData: FormData
): Promise<CaseStudyFormState> {
  await requireAdminSession();

  const { treatmentId, tagOverride, beforePhoto, afterPhoto, visible } = readCaseStudyForm(formData);

  if (!beforePhoto || !afterPhoto) {
    return { error: "Subí las dos fotos (antes y después) antes de guardar." };
  }
  if (!treatmentId && !tagOverride) {
    return { error: "Elegí un tratamiento o escribí una etiqueta personalizada." };
  }

  const maxOrder = await prisma.caseStudy.aggregate({ _max: { order: true } });
  const finalTagOverride = treatmentId ? null : tagOverride;
  const translations = finalTagOverride ? await translateFields({ tagOverride: finalTagOverride }) : undefined;

  await prisma.caseStudy.create({
    data: {
      treatmentId,
      tagOverride: finalTagOverride,
      beforePhoto,
      afterPhoto,
      visible,
      order: (maxOrder._max.order ?? -1) + 1,
      translations,
    },
  });

  revalidatePublicPaths();
  revalidatePath("/admin/casos-reales");
  redirect("/admin/casos-reales");
}

export async function updateCaseStudy(
  id: string,
  _prevState: CaseStudyFormState,
  formData: FormData
): Promise<CaseStudyFormState> {
  await requireAdminSession();

  const { treatmentId, tagOverride, beforePhoto, afterPhoto, visible } = readCaseStudyForm(formData);

  if (!beforePhoto || !afterPhoto) {
    return { error: "Subí las dos fotos (antes y después) antes de guardar." };
  }
  if (!treatmentId && !tagOverride) {
    return { error: "Elegí un tratamiento o escribí una etiqueta personalizada." };
  }

  const finalTagOverride = treatmentId ? null : tagOverride;
  const translations = finalTagOverride ? await translateFields({ tagOverride: finalTagOverride }) : undefined;

  await prisma.caseStudy.update({
    where: { id },
    data: {
      treatmentId,
      tagOverride: finalTagOverride,
      beforePhoto,
      afterPhoto,
      visible,
      translations,
    },
  });

  revalidatePublicPaths();
  revalidatePath("/admin/casos-reales");
  redirect("/admin/casos-reales");
}

export async function deleteCaseStudy(id: string): Promise<void> {
  await requireAdminSession();
  await prisma.caseStudy.delete({ where: { id } });
  revalidatePublicPaths();
  revalidatePath("/admin/casos-reales");
}

export async function toggleCaseStudyVisibility(id: string, visible: boolean): Promise<void> {
  await requireAdminSession();
  await prisma.caseStudy.update({ where: { id }, data: { visible } });
  revalidatePublicPaths();
  revalidatePath("/admin/casos-reales");
}

export async function reorderCaseStudies(orderedIds: string[]): Promise<void> {
  await requireAdminSession();

  await prisma.$transaction(
    orderedIds.map((id, order) => prisma.caseStudy.update({ where: { id }, data: { order } }))
  );

  revalidatePublicPaths();
  revalidatePath("/admin/casos-reales");
}
