"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  canAccessDashboard,
  roleLabel,
  type UserRole,
} from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StudentProfile } from "@/components/dashboard/StudentProfile";
import {
  LayoutDashboard,
  TreePine,
  ClipboardCheck,
  BarChart3,
  LogOut,
  BookOpen,
  User,
  Gift,
  Users,
} from "lucide-react";

const DASHBOARD_LINKS: { role: UserRole; href: string; label: string }[] = [
  { role: "student", href: "/dashboard/student", label: "Student" },
  { role: "validator", href: "/dashboard/validator", label: "Validator" },
  { role: "working-professional", href: "/dashboard/working-professional", label: "Working Professional" },
  { role: "non-validator", href: "/dashboard/non-validator", label: "General User" },
];

const getSidebarNav = (role: string, isAdmin: boolean) => [
  { href: `/dashboard/${role}`, icon: LayoutDashboard, label: "Overview" },
  { href: "/learn", icon: TreePine, label: "Learning Tree" },
  { href: `/dashboard/${role}#assessments`, icon: ClipboardCheck, label: "Assessments" },
  { href: `/dashboard/${role}#progress`, icon: BarChart3, label: "Progress" },
  ...(isAdmin
    ? [
      { href: "/admin/submissions", icon: BookOpen, label: "Submission Review" },
      { href: "/admin/users", icon: Users, label: "User Management" },
      { href: "/admin/referrals", icon: BarChart3, label: "Referral Analytics" },
    ]
    : []),
  ...(!isAdmin && role !== "admin"
    ? [{ href: `#refer`, icon: Gift, label: "Refer & Earn" }]
    : []),
  { href: `#profile`, icon: User, label: "Profile" },
];

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: UserRole;
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready, logout, isAdmin } = useAuth();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHash = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?role=${role}`);
      return;
    }
    if (!canAccessDashboard(role)) {
      router.replace("/login");
    }
  }, [ready, user, role, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[var(--bg)]">
      {/* ---- sidebar (desktop) ---- */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
        {/* profile */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mst-red text-sm font-bold text-white">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text)]">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {roleLabel(role)}
              {isAdmin && " · Admin"}
            </p>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {getSidebarNav(role, isAdmin).map((item) => {
            const Icon = item.icon;

            const itemHash = item.href.includes('#') ? item.href.substring(item.href.indexOf('#')) : "";
            const itemPath = item.href.includes('#') ? item.href.substring(0, item.href.indexOf('#')) || pathname : item.href;

            const isPathMatch = itemPath === pathname;
            const isHashMatch = itemHash === activeHash;
            const isActive = isPathMatch && isHashMatch;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.href.includes('#')) {
                    // Force a hashchange event so the page components update immediately
                    setTimeout(() => {
                      window.dispatchEvent(new HashChangeEvent("hashchange"));
                    }, 50);
                  }
                }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                  ? "bg-mst-red/10 text-mst-red"
                  : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                  }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-4">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Admin Dashboards
              </p>
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${role === link.role
                    ? "bg-mst-red/10 text-mst-red"
                    : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                    }`}
                >
                  <BookOpen size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* bottom */}
        <div className="mt-auto border-t border-[var(--border)] px-3 py-4">
          <button
            type="button"
            onClick={async () => {
              try {
                let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
                //const token = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTA4MWI4MTM2YjI4NzJmYzk5NjdjMjYiLCJlbWFpbCI6ImFkaXR5YTExMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4MDEzMTc1MywiZXhwIjoxNzgwNzM2NTUzfQ.hhPiWUrifjyEOoo_3y5ar9LWxjOVBIK9j7daTDjlELc; Path=/; HttpOnly; Expires=Sat, 06 Jun 2026 09:02:31 GMT";
                await fetch(`${baseURL}/api/auth/logout`, {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    //"Cookie": token,
                    // "Authorization" : `Bearer ${token}`,
                    "Content-Type": "application/json",

                  },
                });
              } catch (e) {
                console.error(e);
              }
              logout();
              router.push("/login");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside >

      {/* ---- main content ---- */}
      < div className="relative flex min-w-0 flex-1 flex-col overflow-hidden" >
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {/* mobile header */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mst-red text-sm font-bold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {user.fullName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
                      const token = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTA4MWI4MTM2YjI4NzJmYzk5NjdjMjYiLCJlbWFpbCI6ImFkaXR5YTExMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4MDEzMTc1MywiZXhwIjoxNzgwNzM2NTUzfQ.hhPiWUrifjyEOoo_3y5ar9LWxjOVBIK9j7daTDjlELc; Path=/; HttpOnly; Expires=Sat, 06 Jun 2026 09:02:31 GMT";
                      await fetch(`${baseURL}/api/auth/logout`, {
                        method: "POST",
                        headers: {
                          "Cookie": token,
                          // "Authorization" : `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      });
                    } catch (e) {
                      console.error(e);
                    }
                    logout();
                    router.push("/login");
                  }}
                  className="rounded-full border border-[var(--border)] p-2 text-[var(--text-muted)]"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* page header */}
            {activeHash !== "#profile" && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
                  {roleLabel(role)} Dashboard
                  {isAdmin && (
                    <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                      Admin Access
                    </span>
                  )}
                </p>
                <h1 className="mt-2 text-2xl font-black text-[var(--text)] sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Signed in as {user.fullName} ({user.email})
                </p>
              </div>
            )}

            {/* admin nav (mobile) */}
            {isAdmin && (
              <nav className="mb-6 flex flex-wrap gap-2 lg:hidden">
                {DASHBOARD_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${role === link.role
                      ? "bg-mst-red text-white"
                      : "border border-[var(--border)] text-[var(--text)] hover:border-mst-red"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* content */}
            <div className="space-y-6">
              {activeHash === "#profile" ? (
                <div className="animate-in fade-in duration-300">
                  <StudentProfile user={user} />
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </main>
      </div >
    </div >
  );
}
