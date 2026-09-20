import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Cheap, optimistic redirect only — checks that the session cookie exists.
// Does NOT verify the signature (that needs `jwtVerify`, which needs the Node
// runtime's crypto and a DB-free check is fine here per Next.js's own guidance
// that Proxy should stay fast and not do real auth). Every admin Server Action
// independently re-checks the real, signed session via requireAdminSession().
const SESSION_COOKIE = "kabero_admin_session";
// Reachable without a session — the login page itself, and the forgot/reset
// password flow (which exists precisely to recover access with no session).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/olvide-password", "/admin/restablecer-password"];

const intlMiddleware = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin is a separate, unlocalized root layout (see app/admin/layout.tsx) —
  // resolve auth here and return immediately, before next-intl ever sees the
  // request, so locale negotiation/redirects never run on admin routes.
  if (pathname.startsWith("/admin")) {
    if (!PUBLIC_ADMIN_PATHS.includes(pathname)) {
      const hasSession = request.cookies.has(SESSION_COOKIE);
      if (!hasSession) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Runs on every route except Next internals, API routes, and files that
  // look like static assets (anything with a dot in the last segment) —
  // this now covers the public locale-prefixed routes too, not just /admin.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
