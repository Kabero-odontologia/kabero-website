import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cheap, optimistic redirect only — checks that the session cookie exists.
// Does NOT verify the signature (that needs `jwtVerify`, which needs the Node
// runtime's crypto and a DB-free check is fine here per Next.js's own guidance
// that Proxy should stay fast and not do real auth). Every admin Server Action
// independently re-checks the real, signed session via requireAdminSession().
const SESSION_COOKIE = "kabero_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
