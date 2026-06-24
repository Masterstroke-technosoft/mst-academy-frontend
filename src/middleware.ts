import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/plans",
  "/academy-overview",
  "/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  const session = request.cookies.get("mst-session");
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    const search = request.nextUrl.search;
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all request paths except:
     * - api            (API routes)
     * - _next/static   (build output / static files)
     * - _next/image    (image optimization endpoint)
     * - any path with a static-asset file extension (e.g. /logo.png,
     *   /file.svg, /favicon.ico). These are served from the public/ folder
     *   and must stay reachable before login — otherwise the auth check
     *   redirects them to /login and they fail to load.
     */
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|woff2?|ttf|map)$).*)",
  ],
};
