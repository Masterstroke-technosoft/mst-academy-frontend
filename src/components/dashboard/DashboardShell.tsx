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
  PlusCircle,
  AlertCircle,
  CheckCircle2,
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

  const [isApprovedPaymentModalOpen, setIsApprovedPaymentModalOpen] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  const fetchPaymentRequests = async () => {
    try {
      setLoadingPayments(true);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseURL}/api/node-purchase`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        // Handle both array responses and single purchase object responses
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data?.purchase) {
          list = [data.purchase];
        } else if (data?.data) {
          list = Array.isArray(data.data) ? data.data : [];
        } else if (data?.purchases) {
          list = Array.isArray(data.purchases) ? data.purchases : [];
        }
        // Ensure each entry has a consistent `id` field for UI logic
        const normalized = list.map((item) => ({
          ...item,
          id: (item as any)._id || (item as any).id,
        }));
        setPaymentRequests(normalized);
      } else {
        // No mock data – use an empty list if the endpoint returns a non‑OK status.
        setPaymentRequests([]);
      }
    } catch (err) {
      console.error("Error fetching payment requests:", err);
      // If an error occurs, clear the list to avoid showing stale mock data.
      setPaymentRequests([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleApprovePayment = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      showToast("Payment approved successfully!", "success");
      setPaymentRequests(prev =>
        prev.map(req =>
          (req.id === requestId || req._id === requestId)
            ? { ...req, status: "APPROVED" }
            : req
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
    <>
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
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
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
          <div className="mt-auto border-t border-[var(--border)] px-3 py-4 space-y-1">
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setIsApprovedPaymentModalOpen(true);
                  fetchPaymentRequests();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--border)]/40 hover:text-[var(--text)] cursor-pointer"
              >
                <CheckCircle2 size={16} />
                Approved Payment
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                try {
                  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
                  await fetch(`${baseURL}/api/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
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
                        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
                        await fetch(`${baseURL}/api/auth/logout`, {
                          method: "POST",
                          credentials: "include",
                          headers: {
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



      {isApprovedPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-7xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] my-8">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6 shrink-0">
              <div>
                <h3 className="text-xl font-black text-[var(--text)]">
                  Approved Payment Requests
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Verify payment details and allocate courses to users</p>
              </div>
              <button
                onClick={() => setIsApprovedPaymentModalOpen(false)}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {loadingPayments ? (
                <div className="flex h-40 items-center justify-center text-[var(--text-muted)]">
                  Loading payment requests...
                </div>
              ) : paymentRequests.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-[var(--text-muted)]">
                  <AlertCircle className="mb-2 h-8 w-8 opacity-50 text-[var(--text-muted)]" />
                  <p className="text-sm font-semibold">No payment requests found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto md:overflow-x-visible rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <table className="w-full text-left text-sm text-[var(--text-muted)]">
                    <thead className="bg-[var(--bg-muted)] text-xs font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-3 py-3 whitespace-nowrap">Account Holder</th>
                        <th className="px-3 py-3 whitespace-nowrap">Category</th>
                        <th className="px-3 py-3 whitespace-nowrap">Amount</th>
                        <th className="px-3 py-3 whitespace-nowrap">Date</th>
                        <th className="px-3 py-3 whitespace-nowrap">Transaction ID</th>
                        <th className="px-3 py-3 whitespace-nowrap">Method</th>
                        <th className="px-3 py-3 whitespace-nowrap">Upload Screenshot</th>
                        <th className="px-3 py-3 whitespace-nowrap">Status</th>
                        <th className="px-3 py-3 whitespace-nowrap text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {paymentRequests.map((req) => (
                        <tr key={req.id || req._id} className="transition-colors hover:bg-[var(--bg-muted)]/30">
                          <td className="px-3 py-3 font-semibold text-[var(--text)] whitespace-nowrap">
                            {req.accountHolderName}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className="inline-flex rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {req.category}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-black text-[var(--text)] text-sm whitespace-nowrap">
                            ₹{req.amountPaid}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {req.paymentDate ? new Date(req.paymentDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">
                            {req.transactionId}
                          </td>
                          <td className="px-3 py-3 font-medium whitespace-nowrap">
                            {req.paymentMethod}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            {req.paymentScreenshotUrl ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const fullUrl = req.paymentScreenshotUrl.startsWith('http') || req.paymentScreenshotUrl.startsWith('data:')
                                    ? req.paymentScreenshotUrl
                                    : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${req.paymentScreenshotUrl.startsWith('/') ? '' : '/'}${req.paymentScreenshotUrl}`;
                                  setPreviewScreenshotUrl(fullUrl);
                                }}
                                className="inline-flex items-center justify-center gap-1 font-bold text-xs bg-mst-red hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm whitespace-nowrap"
                              >
                                View
                              </button>
                            ) : (
                              <span className="inline-flex items-center justify-center gap-1 text-xs bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2.5 py-1 rounded-lg font-medium">No file</span>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${req.status === "APPROVED"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                              }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            {req.status !== "APPROVED" ? (
                              <button
                                type="button"
                                disabled={approvingId === (req._id || req.id)}
                                onClick={() => handleApprovePayment(req._id || req.id)}
                                className="rounded-lg bg-green-600 hover:bg-green-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                              >
                                Approve
                              </button>
                            ) : (
                              <span className="text-green-500 font-bold text-xs inline-flex items-center gap-1"><CheckCircle2 size={14} /> Ready</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] shrink-0 mt-6">
              <button
                type="button"
                onClick={() => setIsApprovedPaymentModalOpen(false)}
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-3xl max-h-[90vh] bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewScreenshotUrl(null)}
              className="absolute -top-3 -right-3 rounded-full bg-mst-red text-white p-1.5 hover:bg-red-700 transition shadow-lg cursor-pointer z-10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center rounded-xl bg-[var(--bg-muted)]">
              <img
                src={previewScreenshotUrl}
                alt="Payment Screenshot Preview"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${toast.type === "success"
          ? "border-green-500/30 bg-emerald-950/95 text-emerald-400"
          : "border-red-500/30 bg-red-950/95 text-red-400"
          }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <span className="text-sm font-extrabold">{toast.message}</span>
        </div>
      )}
    </>
  );
}
