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
import { Footer } from "@/components/Footer";
import {
  LayoutDashboard,
  TreePine,
  BarChart3,
  LogOut,
  BookOpen,
  User,
  Gift,
  Users,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

const DASHBOARD_LINKS: { role: UserRole; href: string; label: string }[] = [
  { role: "student", href: "/dashboard/student", label: "Student" },
  { role: "validator", href: "/dashboard/validator", label: "Validator" },
  { role: "working-professional", href: "/dashboard/working-professional", label: "Web3 Enthusiast" },
  { role: "non-validator", href: "/dashboard/non-validator", label: "General User" },
];

const getSidebarNav = (role: string, isAdmin: boolean) => [
  { href: `/dashboard/${role}`, icon: LayoutDashboard, label: "Overview" },
  { href: "/learn", icon: TreePine, label: "Learning Tree" },
  ...(!isAdmin
    ? [
      { href: `/dashboard/${role}#progress`, icon: BarChart3, label: "Progress" },
      { href: `/dashboard/${role}#submissions`, icon: BookOpen, label: "Submission Progress" }
    ]
    : []),
  ...(isAdmin
    ? [
      { href: "/admin/submissions", icon: BookOpen, label: "Submission Review" },
      { href: "/admin/users", icon: Users, label: "User Management" },
      { href: "/admin/referrals", icon: BarChart3, label: "Referral Analytics" },
      { href: "/admin/bulkemail/compose", icon: BookOpen, label: "Bulk Email" },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isApprovedPaymentModalOpen, setIsApprovedPaymentModalOpen] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [confirmingApproveId, setConfirmingApproveId] = useState<string | null>(null);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const fetchPaymentRequests = async () => {
    setPaymentSearch("");
    setPaymentStatusFilter("all");
    try {
      setLoadingPayments(true);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${baseURL}/api/node-purchase`, {
        method: "GET",
        credentials: "include",
        headers,
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

  const updatePaymentStatus = async (
    requestId: string,
    status: "APPROVED" | "REJECTED",
    note?: string
  ) => {
    setApprovingId(requestId);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const body: Record<string, unknown> = { status };
      if (status === "REJECTED") {
        body.rejectionNote = note;
      }

      const res = await fetch(`${baseURL}/api/node-purchase/${requestId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Failed to update payment status (${res.status})`);
      }

      setPaymentRequests(prev =>
        prev.map(req =>
          (req.id === requestId || req._id === requestId)
            ? { ...req, status, ...(status === "REJECTED" ? { rejectionNote: note } : {}) }
            : req
        )
      );
      showToast(
        status === "APPROVED" ? "Payment approved successfully!" : "Payment rejected successfully!",
        status === "APPROVED" ? "success" : "error"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to update payment status. Please try again.", "error");
    } finally {
      setApprovingId(null);
    }
  };

  const handleApprovePayment = (requestId: string) => updatePaymentStatus(requestId, "APPROVED");

  // Rejecting requires a note, so open the reject modal to collect it.
  const handleRejectPayment = (requestId: string) => {
    setRejectionNote("");
    setRejectingId(requestId);
  };

  const confirmRejectPayment = async () => {
    if (!rejectingId) return;
    if (!rejectionNote.trim()) {
      showToast("Please enter a rejection note.", "error");
      return;
    }
    await updatePaymentStatus(rejectingId, "REJECTED", rejectionNote.trim());
    setRejectingId(null);
    setRejectionNote("");
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

  const filteredPayments = paymentRequests.filter((req) => {
    const matchesSearch =
      paymentSearch.trim() === "" ||
      req.accountHolderName?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      req.transactionId?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      req.category?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      req.paymentMethod?.toLowerCase().includes(paymentSearch.toLowerCase());

    const matchesStatus =
      paymentStatusFilter === "all" ||
      req.status === paymentStatusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <aside className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:fixed md:top-16 md:left-0 md:flex z-20">
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
                <AlertCircle size={16} className="text-amber-500" />
                Approved Payments
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

        {/* ---- sidebar (mobile drawer) ---- */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Drawer content */}
            <aside className="relative flex w-64 max-w-xs flex-1 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-5 animate-in slide-in-from-left duration-200">
              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* profile */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-5 pt-2">
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
              <nav className="flex-1 space-y-1 py-4 overflow-y-auto">
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
                        setIsSidebarOpen(false);
                        if (item.href.includes('#')) {
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
                        onClick={() => setIsSidebarOpen(false)}
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
              <div className="mt-auto border-t border-[var(--border)] pt-4 space-y-1">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsApprovedPaymentModalOpen(true);
                      fetchPaymentRequests();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--border)]/40 hover:text-[var(--text)] cursor-pointer"
                  >
                    <AlertCircle size={16} className="text-amber-500" />
                    Approved Payments
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
            </aside>
          </div>
        )}

        {/* ---- main content ---- */}
        < div className="relative flex min-w-0 flex-1 flex-col overflow-hidden md:ml-64" >
          <main className="flex-1 overflow-y-auto flex flex-col justify-between">
            <div className={`mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 ${role === "admin" ? "max-w-[95vw]" : "max-w-5xl"}`}>
              {/* mobile header */}
              <div className="mb-6 flex items-center justify-between md:hidden">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition cursor-pointer"
                  >
                    <Menu size={20} />
                  </button>
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
                <nav className="mb-6 flex overflow-x-auto gap-2 md:hidden pb-2 scrollbar-none whitespace-nowrap">
                  {DASHBOARD_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${role === link.role
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
            <Footer forceShow />
          </main>
        </div >
      </div >



      {isApprovedPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-7xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] my-8">
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

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by name, transaction ID, category, method..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 pl-10 text-sm text-[var(--text)] focus:border-mst-red focus:outline-none transition-colors border-[var(--border)]"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] focus:border-mst-red focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {loadingPayments ? (
                <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <table className="w-full text-left text-xs text-[var(--text-muted)] animate-pulse">
                    <thead className="bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-2 py-2.5 whitespace-nowrap">Account Holder</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Category</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Amount</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Date</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Txn ID</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Method</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Screenshot</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Status</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {[...Array(5)].map((_, idx) => (
                        <tr key={idx} className="transition-colors">
                          <td className="px-2 py-4 whitespace-nowrap">
                            <div className="h-4 w-24 rounded bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 text-center whitespace-nowrap">
                            <div className="mx-auto h-5 w-20 rounded bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            <div className="h-4 w-12 rounded bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            <div className="h-4 w-16 rounded bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            <div className="h-4 w-28 rounded bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            <div className="h-4 w-10 rounded bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 text-center whitespace-nowrap">
                            <div className="mx-auto h-7 w-20 rounded-lg bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 text-center whitespace-nowrap">
                            <div className="mx-auto h-5 w-16 rounded-full bg-[var(--border)]/70"></div>
                          </td>
                          <td className="px-2 py-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <div className="h-7 w-14 rounded-lg bg-[var(--border)]/70"></div>
                              <div className="h-7 w-14 rounded-lg bg-[var(--border)]/70"></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-[var(--text-muted)]">
                  <AlertCircle className="mb-2 h-8 w-8 opacity-50 text-[var(--text-muted)]" />
                  <p className="text-sm font-semibold">
                    {paymentRequests.length === 0 ? "No payment requests found." : "No matching payment requests found."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <table className="w-full text-left text-xs text-[var(--text-muted)]">
                    <thead className="bg-[var(--bg-muted)] text-[10px] font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-2 py-2.5 whitespace-nowrap">Account Holder</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Category</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Amount</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Date</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Txn ID</th>
                        <th className="px-2 py-2.5 whitespace-nowrap">Method</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Screenshot</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Status</th>
                        <th className="px-2 py-2.5 whitespace-nowrap text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {filteredPayments.map((req) => (
                        <tr key={req.id || req._id} className="transition-colors hover:bg-[var(--bg-muted)]/30">
                          <td className="px-2 py-2.5 font-semibold text-[var(--text)] whitespace-nowrap">
                            {req.accountHolderName}
                          </td>
                          <td className="px-2 py-2.5 text-center whitespace-nowrap">
                            <span className="inline-flex rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {req.category}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 font-black text-[var(--text)] text-xs whitespace-nowrap">
                            ₹{req.amountPaid}
                          </td>
                          <td className="px-2 py-2.5 whitespace-nowrap">
                            {req.paymentDate ? new Date(req.paymentDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-2 py-2.5 font-mono text-[11px] whitespace-nowrap">
                            {req.transactionId}
                          </td>
                          <td className="px-2 py-2.5 font-medium whitespace-nowrap">
                            {req.paymentMethod}
                          </td>
                          <td className="px-2 py-2.5 text-center whitespace-nowrap">
                            {req.paymentScreenshotUrl ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const fullUrl = req.paymentScreenshotUrl.startsWith('http') || req.paymentScreenshotUrl.startsWith('data:')
                                    ? req.paymentScreenshotUrl
                                    : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${req.paymentScreenshotUrl.startsWith('/') ? '' : '/'}${req.paymentScreenshotUrl}`;
                                  setPreviewScreenshotUrl(fullUrl);
                                }}
                                className="inline-flex items-center justify-center font-bold text-[10px] bg-mst-red hover:bg-red-700 text-white px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-sm whitespace-nowrap w-16 text-center"
                              >
                                View
                              </button>
                            ) : (
                              <span className="inline-flex items-center justify-center text-[10px] bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2.5 py-1 rounded-md font-medium w-16 text-center">
                                No file
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-2.5 text-center whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ${req.status === "APPROVED"
                              ? "bg-green-600 border border-green-600"
                              : req.status === "REJECTED"
                                ? "bg-red-600 border border-red-600"
                                : "bg-amber-500 border border-amber-500"
                              }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 text-center whitespace-nowrap">
                            {req.status === "PENDING" ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={approvingId === (req._id || req.id)}
                                  onClick={() => setConfirmingApproveId(req._id || req.id)}
                                  className="rounded bg-green-600 hover:bg-green-700 px-2.5 py-1 text-[10px] font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  disabled={approvingId === (req._id || req.id)}
                                  onClick={() => handleRejectPayment(req._id || req.id)}
                                  className="rounded bg-red-600 hover:bg-red-700 px-2.5 py-1 text-[10px] font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : req.status === "APPROVED" ? (
                              <span className="text-green-500 font-bold text-[11px] inline-flex items-center gap-1 justify-center"><CheckCircle2 size={12} /> Ready</span>
                            ) : (
                              <span className="text-red-500 font-bold text-[11px] inline-flex items-center gap-1 justify-center"><AlertCircle size={12} /> Rejected</span>
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

      {rejectingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
              <div>
                <h3 className="text-lg font-black text-[var(--text)]">Reject Payment Request</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Please provide a reason. This note will be shared with the user.
                </p>
              </div>
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectionNote("");
                }}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Rejection Note
              </label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                rows={4}
                autoFocus
                placeholder="e.g. Transaction ID does not match the payment screenshot."
                className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-4">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setRejectionNote("");
                }}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={approvingId === rejectingId || !rejectionNote.trim()}
                onClick={confirmRejectPayment}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {approvingId === rejectingId ? "Rejecting…" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingApproveId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4">
              <div>
                <h3 className="text-lg font-black text-[var(--text)]">Approve Payment</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Are you sure you want to approve this payment request?
                </p>
              </div>
              <button
                onClick={() => setConfirmingApproveId(null)}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmingApproveId(null)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={approvingId === confirmingApproveId}
                onClick={async () => {
                  const id = confirmingApproveId;
                  setConfirmingApproveId(null);
                  await handleApprovePayment(id);
                }}
                className="rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {approvingId === confirmingApproveId ? "Approving…" : "Confirm"}
              </button>
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
