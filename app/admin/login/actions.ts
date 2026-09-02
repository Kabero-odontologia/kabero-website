"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Completá usuario y contraseña." };
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await createSession({ adminId: admin.id, username: admin.username });
  redirect("/admin");
}
