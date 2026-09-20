"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!username || !email || !password) {
    return { error: "Completá el usuario, el email y la contraseña." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El email no es válido." };
  }
  if (password.length < 8) {
    return { error: "La contraseña necesita al menos 8 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const [existingUsername, existingEmail] = await Promise.all([
    prisma.admin.findUnique({ where: { username } }),
    prisma.admin.findUnique({ where: { email } }),
  ]);
  if (existingUsername) {
    return { error: "Ya existe un usuario con ese nombre." };
  }
  if (existingEmail) {
    return { error: "Ya existe un usuario con ese email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { username, email, passwordHash } });

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function updateAdminUser(
  id: string,
  _prevState: AdminUserFormState,
  formData: FormData
): Promise<AdminUserFormState> {
  const session = await requireAdminSession();
  const isSelf = id === session.adminId;

  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!username || !email) {
    return { error: "Completá el usuario y el email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "El email no es válido." };
  }

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) {
    return { error: "No se encontró este usuario." };
  }

  const [existingUsername, existingEmail] = await Promise.all([
    prisma.admin.findUnique({ where: { username } }),
    prisma.admin.findUnique({ where: { email } }),
  ]);
  if (existingUsername && existingUsername.id !== id) {
    return { error: "Ya existe un usuario con ese nombre." };
  }
  if (existingEmail && existingEmail.id !== id) {
    return { error: "Ya existe un usuario con ese email." };
  }

  // Password fields are optional here — leave them blank to keep the current
  // one. Changing your OWN password still requires the current one (so an
  // unattended session can't be used to lock out the real account owner);
  // editing someone else's account skips that, same as deleting it outright
  // already requires no extra confirmation beyond an active admin session.
  let passwordHash: string | undefined;
  if (newPassword) {
    if (newPassword.length < 8) {
      return { error: "La contraseña nueva necesita al menos 8 caracteres." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Las contraseñas nuevas no coinciden." };
    }
    if (isSelf) {
      if (!currentPassword) {
        return { error: "Ingresá tu contraseña actual para cambiarla." };
      }
      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) {
        return { error: "La contraseña actual no es correcta." };
      }
    }
    passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.admin.update({
    where: { id },
    data: { username, email, ...(passwordHash ? { passwordHash } : {}) },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
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
