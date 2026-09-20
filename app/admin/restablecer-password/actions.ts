"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { hashResetToken } from "@/lib/password-reset";

export interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) return { error: "El link no es válido. Pedí uno nuevo." };
  if (password.length < 8) return { error: "La contraseña necesita al menos 8 caracteres." };
  if (password !== confirmPassword) return { error: "Las contraseñas no coinciden." };

  const admin = await prisma.admin.findFirst({
    where: { resetTokenHash: hashResetToken(token), resetTokenExpiry: { gt: new Date() } },
  });
  if (!admin) return { error: "El link venció o ya fue usado. Pedí uno nuevo." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiry: null },
  });

  return { success: true };
}
