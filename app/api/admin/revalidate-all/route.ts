import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";

// One-off escape hatch: forces every statically-generated public page to
// regenerate on its next request. Needed after a fresh deploy whose build
// ran against an empty database (the persistent disk isn't mounted during
// the build step) — the existing per-save `revalidatePath` calls only fire
// on the *next* admin edit, so freshly-restored content otherwise sits
// behind stale static HTML until something is manually re-saved.
export async function POST() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
