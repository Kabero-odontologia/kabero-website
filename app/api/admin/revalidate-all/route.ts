import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";

// Forces every statically-generated public page to regenerate on its next
// request. Needed after every deploy: Render's build step runs without the
// persistent disk mounted, so `next build` always statically generates
// pages against an empty database — the real data only exists once the
// server is actually running. scripts/render-start.sh calls this itself
// right after boot (authenticated via the `x-internal-secret` header,
// since there's no admin browser session at that point); it also accepts a
// normal admin session for manual/on-demand use.
export async function POST(request: NextRequest) {
  const internalSecret = request.headers.get("x-internal-secret");
  const isInternal = Boolean(internalSecret) && internalSecret === process.env.SESSION_SECRET;

  if (!isInternal) {
    try {
      await requireAdminSession();
    } catch {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
