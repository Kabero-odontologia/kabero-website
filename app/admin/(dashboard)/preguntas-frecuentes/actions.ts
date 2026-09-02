"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface FAQFormState {
  error?: string;
}

function revalidateFAQ() {
  revalidatePath("/tratamientos");
  revalidatePath("/admin/preguntas-frecuentes");
}

function readFAQForm(formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const visible = formData.get("visible") === "on";
  return { question, answer, visible };
}

export async function createFAQ(_prevState: FAQFormState, formData: FormData): Promise<FAQFormState> {
  await requireAdminSession();

  const { question, answer, visible } = readFAQForm(formData);
  if (!question || !answer) return { error: "Completá la pregunta y la respuesta." };

  const maxOrder = await prisma.fAQ.aggregate({ _max: { order: true } });
  await prisma.fAQ.create({
    data: { question, answer, visible, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidateFAQ();
  redirect("/admin/preguntas-frecuentes");
}

export async function updateFAQ(
  id: string,
  _prevState: FAQFormState,
  formData: FormData
): Promise<FAQFormState> {
  await requireAdminSession();

  const { question, answer, visible } = readFAQForm(formData);
  if (!question || !answer) return { error: "Completá la pregunta y la respuesta." };

  await prisma.fAQ.update({ where: { id }, data: { question, answer, visible } });

  revalidateFAQ();
  redirect("/admin/preguntas-frecuentes");
}

export async function deleteFAQ(id: string): Promise<void> {
  await requireAdminSession();
  await prisma.fAQ.delete({ where: { id } });
  revalidateFAQ();
}

export async function toggleFAQVisibility(id: string, visible: boolean): Promise<void> {
  await requireAdminSession();
  await prisma.fAQ.update({ where: { id }, data: { visible } });
  revalidateFAQ();
}

export async function moveFAQ(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdminSession();

  const all = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  const index = all.findIndex((f) => f.id === id);
  if (index === -1) return;
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= all.length) return;

  const a = all[index];
  const b = all[swapIndex];

  await prisma.$transaction([
    prisma.fAQ.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.fAQ.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidateFAQ();
}
