"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface TeamMemberFormState {
  error?: string;
}

function revalidateEquipo() {
  revalidatePath("/sobre-nosotros");
  revalidatePath("/admin/equipo");
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
  await prisma.teamMember.create({
    data: { name, specialty, photo, visible, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidateEquipo();
  redirect("/admin/equipo");
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

  await prisma.teamMember.update({ where: { id }, data: { name, specialty, photo, visible } });

  revalidateEquipo();
  redirect("/admin/equipo");
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

export async function moveTeamMember(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdminSession();

  const all = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  const index = all.findIndex((m) => m.id === id);
  if (index === -1) return;
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= all.length) return;

  const a = all[index];
  const b = all[swapIndex];

  await prisma.$transaction([
    prisma.teamMember.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.teamMember.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidateEquipo();
}
