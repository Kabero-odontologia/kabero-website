"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CaseStudyFormState {
  error?: string;
}

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/casos-reales");
  revalidatePath("/tratamientos/[slug]", "page");
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

  await prisma.caseStudy.create({
    data: {
      treatmentId,
      tagOverride: treatmentId ? null : tagOverride,
      beforePhoto,
      afterPhoto,
      visible,
      order: (maxOrder._max.order ?? -1) + 1,
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

  await prisma.caseStudy.update({
    where: { id },
    data: {
      treatmentId,
      tagOverride: treatmentId ? null : tagOverride,
      beforePhoto,
      afterPhoto,
      visible,
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

export async function moveCaseStudy(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdminSession();

  const all = await prisma.caseStudy.findMany({ orderBy: { order: "asc" } });
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return;
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= all.length) return;

  const a = all[index];
  const b = all[swapIndex];

  await prisma.$transaction([
    prisma.caseStudy.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.caseStudy.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePublicPaths();
  revalidatePath("/admin/casos-reales");
}
