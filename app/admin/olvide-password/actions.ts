"use server";

import { prisma } from "@/lib/db";
import { generateResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

export interface ForgotPasswordState {
  submitted?: boolean;
  error?: string;
}

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  if (!identifier) {
    return { error: "Completá tu usuario o email." };
  }

  const admin = await prisma.admin.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });

  if (admin?.email) {
    const { token, tokenHash, expiry } = generateResetToken();
    await prisma.admin.update({
      where: { id: admin.id },
      data: { resetTokenHash: tokenHash, resetTokenExpiry: expiry },
    });
    const resetUrl = `https://kabero.org/admin/restablecer-password?token=${token}`;
    await sendPasswordResetEmail(admin.email, resetUrl);
  }

  // Same response whether or not the account/email exists, so this form
  // can't be used to discover which usernames or emails are registered.
  return { submitted: true };
}
