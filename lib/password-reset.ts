import "server-only";
import crypto from "crypto";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// The raw token goes in the emailed link; only its hash is stored, so a
// leaked database dump can't be used to reset anyone's password directly.
export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return { token, tokenHash: hashResetToken(token), expiry: new Date(Date.now() + RESET_TOKEN_TTL_MS) };
}

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
