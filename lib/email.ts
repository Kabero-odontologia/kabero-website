import "server-only";
import { Resend } from "resend";

// No API key locally until the kabero.org domain is verified in Resend — in
// that case we log the link instead of sending, so the reset flow is still
// testable end-to-end without a real inbox.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — would have sent password reset link to ${to}: ${resetUrl}`);
    return;
  }

  // resend.emails.send() reports failures via `{ error }`, not by throwing —
  // log it rather than let it surface as an unhandled error to the admin
  // requesting the reset (e.g. while kabero.org is still pending domain
  // verification in Resend).
  const { error } = await resend.emails.send({
    from: "Kabero Admin <no-reply@kabero.org>",
    to,
    subject: "Restablecer tu contraseña — Kabero Admin",
    html: `
      <p>Pediste restablecer tu contraseña del panel de administración de Kabero.</p>
      <p><a href="${resetUrl}">Hacé clic acá para elegir una nueva contraseña</a></p>
      <p>Este link vence en 1 hora. Si no fuiste vos, podés ignorar este email.</p>
    `,
  });
  if (error) {
    console.error(`[email] Resend failed to send password reset to ${to}:`, error);
  }
}
