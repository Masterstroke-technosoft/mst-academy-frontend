/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkOnly } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // 1. ALL ASSESSMENT & PROCTORING ROUTES -> STRICTLY NETWORK ONLY (NEVER CACHED)
    {
      matcher: ({ url }) => url.pathname.includes("/assessment"),
      handler: new NetworkOnly(),
    },

    // 2. ALL INTERNAL API ROUTES -> STRICTLY NETWORK ONLY (NEVER CACHED)
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },

    // 3. ALL EXTERNAL BACKEND API CALLS (NestJS, CMS, Devtunnels) -> STRICTLY NETWORK ONLY
    {
      matcher: ({ url, sameOrigin }) => {
        if (!sameOrigin) {
          const host = url.hostname.toLowerCase();
          return (
            host.includes("masterstroke.academy") ||
            host.includes("staging-course.masterstroke.academy") ||
            host.includes("railway.app") ||
            host === "localhost" ||
            host === "127.0.0.1"
          );
        }
        return false;
      },
      handler: new NetworkOnly(),
    },

    // 4. AUTHENTICATION & SENSITIVE USER ROUTES -> STRICTLY NETWORK ONLY
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/register") ||
        url.pathname.startsWith("/forgot-password") ||
        url.pathname.startsWith("/admin") ||
        // All role dashboards render per-user PII (bank details, referral
        // earnings, submissions). Note /dashboard/admin is NOT caught by the
        // /admin prefix above, so it needs this rule too.
        url.pathname.startsWith("/dashboard"),
      handler: new NetworkOnly(),
    },

    // 5. DEFAULT ASSET & STATIC CONTENT CACHING (Next.js chunks, fonts, images)
    ...defaultCache,
  ],
});

serwist.addEventListeners();
