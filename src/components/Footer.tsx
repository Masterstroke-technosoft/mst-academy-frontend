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
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => setCurrentHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
      
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
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

  if (isLessonPage && !forceShow) return null;

  const isLoggedIn = mounted && ready && !!user;
  const dashboardHref = user
    ? (dashboardPath(user.backendRole || user.role) || "/dashboard/non-validator")
    : "/login";

  const renderMainFooter = !isDashboardOrAdmin || forceShow;

  return (
    <footer className={renderMainFooter ? "border-t border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-300" : ""}>
      {/* Main Footer Links & Copyright */}
      {renderMainFooter && (
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 xl:pr-28 py-6 pb-24 md:py-4 md:pb-4">
          <div className="flex flex-col items-center justify-between gap-5 md:gap-4 xl:flex-row">
            {/* Left Side - Exploration & Knowledge Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs xl:justify-start">
              <Link
                href="/about"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                About
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/faq"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                FAQ
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/glossary"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Glossary
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/testimonials"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Testimonials
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/placements"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Placements
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/blockchain-course-india"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Blockchain Course India
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/compare"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Compare
              </Link>
            </div>

            {/* Center - Copyright */}
            <div className="flex flex-col items-center justify-center text-center space-y-0.5">
              <p className="text-xs text-[var(--text-muted)]">
                © 2026 Masterstroke Academy. All Rights Reserved.
              </p>
              <p className="text-xs font-medium text-[var(--text)]/70">
                Operated by Masterstroke Technosoft Private Limited.
              </p>
            </div>

            {/* Right Side - Legal & Support Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs xl:justify-end">
              <Link
                href="/privacy-policy"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Privacy Policy
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/terms-conditions"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Terms & Conditions
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/refund-policy"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Refund Policy
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href="/contact-us"
                className="font-medium text-mst-red hover:text-red-600 transition-colors whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}

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
            onClick={() => setCurrentHash("")}
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
              onClick={() => {
                if (typeof window !== "undefined" && window.location.pathname === dashboardHref) {
                  window.location.hash = "";
                  window.dispatchEvent(new Event("hashchange"));
                }
                setCurrentHash("");
              }}
              className={`w-24 flex flex-col items-center justify-center py-1 rounded-lg transition-colors group text-center shrink-0 ${
                pathname.startsWith("/dashboard") && currentHash !== "#profile"
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
              onClick={() => setCurrentHash("")}
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
              if (isLoggedIn && typeof window !== "undefined") {
                if (window.location.pathname === dashboardHref) {
                  window.location.hash = "profile";
                  window.dispatchEvent(new Event("hashchange"));
                }
                setCurrentHash("#profile");
              }
            }}
            className={`w-24 flex flex-col items-center justify-center py-1 rounded-lg transition-colors group text-center shrink-0 ${
              (isLoggedIn && pathname.startsWith("/dashboard") && currentHash === "#profile") || (!isLoggedIn && pathname === "/login")
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
