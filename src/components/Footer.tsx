"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap, Network, LayoutDashboard, Compass, User } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { dashboardPath } from "@/lib/auth";

export function Footer({ forceShow = false }: { forceShow?: boolean } = {}) {
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          // Always visible at the top or at the very bottom
          if (currentScrollY < 30 || currentScrollY + windowHeight >= docHeight - 40) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
            // Scrolling down -> hide smoothly
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up -> show smoothly
            setIsVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isDashboardOrAdmin = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const segments = pathname.split("/").filter(Boolean);
  const isLessonPage = segments[0] === "module" && segments.length >= 3;

  if ((isDashboardOrAdmin || isLessonPage) && !forceShow) return null;

  const isLoggedIn = mounted && ready && !!user;
  const dashboardHref = user
    ? (dashboardPath(user.backendRole || user.role) || "/dashboard/non-validator")
    : "/login";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-300">
      {/* Main Footer Links & Copyright */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 pb-20 md:pb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Side - Legal Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
            <Link
              href="/refund-policy"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Refund Policy
            </Link>
            <span className="text-[var(--border)]">•</span>
            <Link
              href="/terms-conditions"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Center - Copyright */}
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 Masterstroke Academy. All Rights Reserved.
            </p>
            <p className="text-xs font-medium text-[var(--text)]/70">
              Operated by Masterstroke Technosoft Private Limited.
            </p>
          </div>

          {/* Right Side - Legal Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 text-xs">
            <Link
              href="/privacy-policy"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[var(--border)]">•</span>
            <Link
              href="/contact-us"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Navigation Menubar (Scroll-aware, mobile only) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-[340px] w-full px-2 flex items-center justify-between py-2">
          {/* Item 1: Curriculum (when not logged in) / Learning Tree (when logged in) */}
          <Link
            href={isLoggedIn ? "/learn" : "/academy-overview"}
            className={`w-24 flex flex-col items-center justify-center py-1 rounded-lg transition-colors group text-center shrink-0 ${
              (isLoggedIn && pathname.startsWith("/learn")) || (!isLoggedIn && pathname.startsWith("/academy-overview"))
                ? "text-mst-red font-semibold"
                : "text-[var(--text-muted)] hover:text-mst-red"
            }`}
          >
            {isLoggedIn ? (
              <Network className="w-5 h-5 transition-transform group-hover:scale-110 mb-0.5" />
            ) : (
              <GraduationCap className="w-5 h-5 transition-transform group-hover:scale-110 mb-0.5" />
            )}
            <span className="text-[11px] leading-tight text-center truncate w-full block">
              {isLoggedIn ? "Learning Tree" : "Curriculum"}
            </span>
          </Link>

          {/* Item 2: Start Learning / Dashboard */}
          {isLoggedIn ? (
            <Link
              href={dashboardHref}
              className={`w-24 flex flex-col items-center justify-center py-1 rounded-lg transition-colors group text-center shrink-0 ${
                pathname.startsWith("/dashboard")
                  ? "text-mst-red font-semibold"
                  : "text-[var(--text-muted)] hover:text-mst-red"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-110 mb-0.5" />
              <span className="text-[11px] leading-tight text-center truncate w-full block">Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/register"
              className={`w-24 flex flex-col items-center justify-center py-1 rounded-lg transition-colors group text-center shrink-0 ${
                pathname === "/register"
                  ? "text-mst-red font-semibold"
                  : "text-[var(--text-muted)] hover:text-mst-red"
              }`}
            >
              <Compass className="w-5 h-5 transition-transform group-hover:scale-110 mb-0.5" />
              <span className="text-[11px] leading-tight text-center truncate w-full block">Start Learning</span>
            </Link>
          )}

          {/* Item 3: Profile */}
          <Link
            href={isLoggedIn ? `${dashboardHref}#profile` : "/login"}
            onClick={() => {
              if (isLoggedIn && typeof window !== "undefined" && window.location.pathname === dashboardHref) {
                window.dispatchEvent(new Event("openProfile"));
              }
            }}
            className={`w-24 flex flex-col items-center justify-center py-1 rounded-lg transition-colors group text-center shrink-0 ${
              (isLoggedIn && pathname.startsWith("/dashboard")) || (!isLoggedIn && pathname === "/login")
                ? "text-mst-red font-semibold"
                : "text-[var(--text-muted)] hover:text-mst-red"
            }`}
          >
            <User className="w-5 h-5 transition-transform group-hover:scale-110 mb-0.5" />
            <span className="text-[11px] leading-tight text-center truncate w-full block">Profile</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
