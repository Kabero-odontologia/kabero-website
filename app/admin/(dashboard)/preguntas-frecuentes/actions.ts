"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { translateFields } from "@/lib/translate";
import { revalidateLocalized } from "@/lib/page-sections";

export interface FAQFormState {
  error?: string;
}

function revalidateFAQ() {
  revalidateLocalized("/tratamientos");
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
  const translations = await translateFields({ question, answer });
  await prisma.fAQ.create({
    data: { question, answer, visible, order: (maxOrder._max.order ?? -1) + 1, translations },
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

  const translations = await translateFields({ question, answer });
  await prisma.fAQ.update({ where: { id }, data: { question, answer, visible, translations } });

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

export async function reorderFAQs(orderedIds: string[]): Promise<void> {
  await requireAdminSession();

  await prisma.$transaction(orderedIds.map((id, order) => prisma.fAQ.update({ where: { id }, data: { order } })));

  revalidateFAQ();
}
