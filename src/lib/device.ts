"use client";

import { useEffect, useState } from "react";

/**
 * Checks whether the current user is accessing via a mobile phone or tablet.
 * Detects mobile/tablet User-Agents, iPadOS touch emulation, and viewports < 1024px.
 */
export function isMobileOrTablet(): boolean {
  if (typeof window === "undefined") return false;

  // 1. User agent check
  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|tablet|silk|kindle/i;
  const isMobileUA = mobileRegex.test(ua);

  // 2. iPadOS on modern iPads (reports as Macintosh with touch points)
  const isIPadOS = /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;

  // 3. Screen width check (phones and tablets are typically < 1024px)
  const isSmallScreen = window.innerWidth < 1024;

  return isMobileUA || isIPadOS || isSmallScreen;
}

/**
 * React hook that returns whether the current device is a mobile or tablet.
 * Hydration-safe (defaults to false until mounted, updates on resize).
 */
export function useIsMobileOrTablet(): boolean {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    const check = () => {
      setIsBlocked(isMobileOrTablet());
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isBlocked;
}
