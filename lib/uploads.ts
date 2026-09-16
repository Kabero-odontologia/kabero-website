import path from "node:path";

// On Render, admin-uploaded files must live on the persistent disk (anything
// else is wiped on every redeploy) — RENDER_DISK_PATH is set in the start
// script's environment. Locally there's no disk, so this just resolves to
// the repo's own public/uploads.
export function uploadsDir() {
  const disk = process.env.RENDER_DISK_PATH;
  return disk ? path.join(disk, "uploads") : path.join(process.cwd(), "public", "uploads");
}
