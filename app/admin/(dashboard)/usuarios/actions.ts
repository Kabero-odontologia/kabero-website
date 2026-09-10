"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export interface AdminUserFormState {
  error?: string;
  success?: boolean;
}

export async function createAdminUser(
  _prevState: AdminUserFormState,
  formData: FormData
): Promise<AdminUserFormState> {
  await requireAdminSession();

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!username || !password) {
    return { error: "Completá el usuario y la contraseña." };
  }
  if (password.length < 8) {
    return { error: "La contraseña necesita al menos 8 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    return { error: "Ya existe un usuario con ese nombre." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { username, passwordHash } });

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function deleteAdminUser(id: string): Promise<{ error?: string }> {
  const session = await requireAdminSession();

  if (id === session.adminId) {
    return { error: "No podés eliminar tu propio usuario mientras estás conectado con él." };
  }

  const count = await prisma.admin.count();
  if (count <= 1) {
    return { error: "Tiene que quedar al menos un usuario." };
  }

  await prisma.admin.delete({ where: { id } });
  revalidatePath("/admin/usuarios");
  return {};
}
