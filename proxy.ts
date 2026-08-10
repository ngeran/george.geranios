import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Guard /admin/* (except /admin/login). Verifies the session cookie (jose,
 * edge-compatible). Server actions under /admin are POSTs to matched routes,
 * so they're guarded too.
 *
 * Note: this was `middleware.ts` with an exported `middleware` function. Next.js
 * 16 renamed the convention to `proxy` (file + export); behavior is unchanged.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let ok = false;
  if (token) {
    try {
      const s = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, s);
      ok = true;
    } catch {
      ok = false;
    }
  }
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
