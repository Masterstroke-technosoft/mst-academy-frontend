import { NextResponse } from "next/server";

export function middleware() {
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
     *   /file.svg, /favicon.ico, /sitemap.xml, /robots.txt). These are
     *   served from the public/ folder and must stay reachable before
     *   login - otherwise the auth check redirects them to /login and
     *   they fail to load (or search engines can't crawl them).
     */
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|woff2?|ttf|map|xml|txt|webmanifest|json)$).*)",
  ],
};
