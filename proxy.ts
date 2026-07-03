import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";
import { SESSION_COOKIE, type Role } from "@/lib/auth/config";

const ROUTE_ROLES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/storefront", roles: ["storefront", "admin"] },
  { prefix: "/admin", roles: ["admin"] },
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session || !rule.roles.includes(session.role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/storefront/:path*", "/admin/:path*"],
};
