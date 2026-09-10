"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { translateFields } from "@/lib/translate";
import { revalidateLocalized } from "@/lib/page-sections";

export interface TeamMemberFormState {
  error?: string;
}

function revalidateEquipo() {
  revalidateLocalized("/sobre-nosotros");
  revalidatePath("/admin/paginas/sobre-nosotros/equipo");
}

function readTeamMemberForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const specialty = String(formData.get("specialty") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";
  return { name, specialty, photo, visible };
}

export async function createTeamMember(
  _prevState: TeamMemberFormState,
  formData: FormData
): Promise<TeamMemberFormState> {
  await requireAdminSession();

  const { name, specialty, photo, visible } = readTeamMemberForm(formData);
  if (!name || !specialty) return { error: "Completá el nombre y la especialidad." };
  if (!photo) return { error: "Subí una foto." };

  const maxOrder = await prisma.teamMember.aggregate({ _max: { order: true } });
  const translations = await translateFields({ specialty });
  await prisma.teamMember.create({
    data: { name, specialty, photo, visible, order: (maxOrder._max.order ?? -1) + 1, translations },
  });

  revalidateEquipo();
  redirect("/admin/paginas/sobre-nosotros/equipo");
}

export async function updateTeamMember(
  id: string,
  _prevState: TeamMemberFormState,
  formData: FormData
): Promise<TeamMemberFormState> {
  await requireAdminSession();

  const { name, specialty, photo, visible } = readTeamMemberForm(formData);
  if (!name || !specialty) return { error: "Completá el nombre y la especialidad." };
  if (!photo) return { error: "Subí una foto." };

  const translations = await translateFields({ specialty });
  await prisma.teamMember.update({ where: { id }, data: { name, specialty, photo, visible, translations } });

  revalidateEquipo();
  redirect("/admin/paginas/sobre-nosotros/equipo");
}

export async function deleteTeamMember(id: string): Promise<void> {
  await requireAdminSession();
  await prisma.teamMember.delete({ where: { id } });
  revalidateEquipo();
}

export async function toggleTeamMemberVisibility(id: string, visible: boolean): Promise<void> {
  await requireAdminSession();
  await prisma.teamMember.update({ where: { id }, data: { visible } });
  revalidateEquipo();
}

export async function reorderTeamMembers(orderedIds: string[]): Promise<void> {
  await requireAdminSession();

  await prisma.$transaction(
    orderedIds.map((id, order) => prisma.teamMember.update({ where: { id }, data: { order } }))
  );

  revalidateEquipo();
}
