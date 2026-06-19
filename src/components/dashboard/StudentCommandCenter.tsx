"use client";

import { useAuth } from "@/components/AuthProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Curriculum } from "@/lib/types";
import { canAccessDashboard, roleLabel } from "@/lib/auth";
import { computeStudentAnalytics } from "@/lib/student-analytics";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Flame,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Play,
  Sparkles,
  Target,
  Trophy,
  TreePine,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Clock,
  Gift,
  Copy,
  Wallet,
  CheckCircle2,
  User,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  BarChart3,
  Users,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { StudentProfile } from "@/components/dashboard/StudentProfile";
import { ReferAndEarnTab } from "@/components/dashboard/ReferAndEarnTab";
import { AssessmentsTab } from "@/components/dashboard/AssessmentsTab";

function PlaceholderTab({ title, icon: Icon, description }: { title: string; icon: any; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm min-h-[400px]">
      <div className="rounded-2xl bg-mst-red/10 p-4">
        <Icon className="h-10 w-10 text-mst-red" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-[var(--text)]">{title}</h2>
      <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface)]/60 p-6 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-mst-red/30 hover:shadow-[0_12px_40px_rgba(227,30,36,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.1)] ${className}`}
      style={glow ? { boxShadow: `0 0 40px ${glow}` } : undefined}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-mst-red/10 opacity-30 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Gauge({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} stroke="var(--border)" strokeWidth="8" fill="none" />
        <circle
          cx="44"
          cy="44"
          r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <p className="-mt-12 text-lg font-black text-[var(--text)]">{value}%</p>
      <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

export function StudentCommandCenter({ curriculum }: { curriculum: Curriculum }) {
  const router = useRouter();
  const { user, ready, logout, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [allocationForm, setAllocationForm] = useState({
    accountHolderName: "",
    category: "",
    amountPaid: "",
    paymentDate: "",
    transactionId: "",
    paymentMethod: "",
    paymentScreenshotUrl: "",
    additionalNotes: "",
  });
  const [screenshotFileName, setScreenshotFileName] = useState("");
  const [allocationErrors, setAllocationErrors] = useState<Record<string, string>>({});
  const [isSubmittingAllocation, setIsSubmittingAllocation] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          const compressedBase64 = await compressImage(rawBase64);
          setAllocationForm(prev => ({
            ...prev,
            paymentScreenshotUrl: compressedBase64,
          }));
          setScreenshotFileName(file.name);
        } catch (err) {
          console.error("Compression failed, using raw base64:", err);
          setAllocationForm(prev => ({
            ...prev,
            paymentScreenshotUrl: rawBase64,
          }));
          setScreenshotFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!allocationForm.accountHolderName.trim()) {
      errors.accountHolderName = "Account holder name is required";
    }
    if (!allocationForm.category) {
      errors.category = "Category is required";
    }
    if (!allocationForm.amountPaid || isNaN(Number(allocationForm.amountPaid)) || Number(allocationForm.amountPaid) <= 0) {
      errors.amountPaid = "Amount paid is required and must be greater than 0";
    }
    if (!allocationForm.paymentDate) {
      errors.paymentDate = "Payment date is required";
    }
    if (!allocationForm.transactionId.trim()) {
      errors.transactionId = "Transaction ID is required";
    }
    if (!allocationForm.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    }
    if (!allocationForm.paymentScreenshotUrl.trim()) {
      errors.paymentScreenshotUrl = "Payment screenshot is required";
    }

    if (Object.keys(errors).length > 0) {
      setAllocationErrors(errors);
      return;
    }

    setAllocationErrors({});
    setIsSubmittingAllocation(true);

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const payload = {
        accountHolderName: allocationForm.accountHolderName,
        category: allocationForm.category,
        amountPaid: Number(allocationForm.amountPaid),
        paymentDate: new Date(allocationForm.paymentDate).toISOString(),
        transactionId: allocationForm.transactionId,
        paymentMethod: allocationForm.paymentMethod,
        paymentScreenshotUrl: allocationForm.paymentScreenshotUrl,
        additionalNotes: allocationForm.additionalNotes.trim() || undefined,
      };

      const res = await fetch(`${baseURL}/api/node-purchase`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Course allocation request submitted successfully!", "success");
        // No need to fetch payment requests here; the admin dashboard handles its own data refresh
        setIsAllocationModalOpen(false);
        setAllocationForm({
          accountHolderName: "",
          category: "",
          amountPaid: "",
          paymentDate: "",
          transactionId: "",
          paymentMethod: "",
          paymentScreenshotUrl: "",
          additionalNotes: "",
        });
        setScreenshotFileName("");
      } else {
        let errMsg = "Failed to submit course allocation request";
        try {
          const errData = await res.json();
          errMsg = errData.message || errData.error || errMsg;
        } catch (_) {}
        showToast(errMsg, "error");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      showToast(err?.message || "Failed to submit course allocation request", "error");
    } finally {
      setIsSubmittingAllocation(false);
    }
  };
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#assessments") return "assessments";
      if (hash === "#progress") return "progress";
      if (hash === "#profile") return "profile";
      if (hash === "#refer") return "refer";
    }
    return "overview";
  });
  const [monthOffset, setMonthOffset] = useState(0);
  const [basePath, setBasePath] = useState("/dashboard/student");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBasePath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#assessments") setActiveTab("assessments");
      else if (hash === "#progress") setActiveTab("progress");
      else if (hash === "#profile") setActiveTab("profile");
      else if (hash === "#refer") setActiveTab("refer");
      else setActiveTab("overview");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login?role=student");
      return;
    }
    if (!canAccessDashboard("student") && !canAccessDashboard("validator") && !canAccessDashboard("working-professional") && !canAccessDashboard("non-validator")) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const [apiData, setApiData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchDashboardData = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseURL}/api/dashboard/${user.id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setApiData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [user?.id]);

  const analytics = useMemo(() => {
    if (!mounted) return null;
    const local = computeStudentAnalytics(curriculum);
    if (apiData) {
      if (apiData.courseProgress) {
        local.overallProgress = Math.round(apiData.courseProgress.progressPercentage || 0);
        local.modulesCompleted = apiData.courseProgress.completedModules || 0;
        local.totalModules = apiData.courseProgress.totalModules || local.totalModules;

        // Recalculate completionDonut dynamically using completed, in progress and locked modules
        const completed = local.modulesCompleted;
        const unlockedIds = apiData.courseProgress.unlockedModuleIds || [];
        const inProgress = Math.max(0, unlockedIds.length - completed);
        const locked = Math.max(0, local.totalModules - completed - inProgress);

        local.completionDonut = [
          { name: "Completed", value: completed, color: "#22c55e" },
          { name: "In Progress", value: inProgress, color: "#f97316" },
          { name: "Locked", value: locked, color: "#64748b" },
        ];
      }
      if (apiData.averageScore !== undefined && apiData.averageScore !== null) {
        local.averageScore = apiData.averageScore;
      }
      if (apiData.totalStudyMinutes !== undefined && apiData.totalStudyMinutes !== null) {
        local.totalStudyHours = Math.round((apiData.totalStudyMinutes / 60) * 10) / 10;
      }
      if (apiData.percentile !== undefined && apiData.percentile !== null) {
        local.percentile = apiData.percentile;
      }
      if (apiData.rank !== undefined && apiData.rank !== null) {
        local.rank = apiData.rank;
      }
      if (apiData.currentStreak !== undefined && apiData.currentStreak !== null) {
        local.streakDays = apiData.currentStreak;
      }
      if (apiData.modulePerformance && Array.isArray(apiData.modulePerformance)) {
        local.moduleScores = apiData.modulePerformance.map((item: any) => ({
          name: item.moduleTitle || `M${item.moduleId}`,
          score: item.averageScore || item.totalScore || 0,
          moduleId: item.moduleId,
        }));
      }

      // Recompute activityHeatmap based on apiData.activityDates
      if (apiData.activityDates && Array.isArray(apiData.activityDates)) {
        const activeDatesMap = new Map<string, number>();
        apiData.activityDates.forEach((d: any) => {
          let dateStr = "";
          let count = 1;
          if (typeof d === "string") {
            dateStr = d.slice(0, 10);
          } else if (d && typeof d.date === "string") {
            dateStr = d.date.slice(0, 10);
            if (typeof d.activityCount === "number") {
              count = d.activityCount;
            }
          } else if (d && typeof d.toISOString === "function") {
            dateStr = d.toISOString().slice(0, 10);
          } else if (d && typeof d.slice === "function") {
            dateStr = d.slice(0, 10);
          }
          if (dateStr) {
            activeDatesMap.set(dateStr, count);
          }
        });

        local.activityHeatmap = local.activityHeatmap.map((item) => ({
          date: item.date,
          count: activeDatesMap.has(item.date) ? activeDatesMap.get(item.date) || 0 : 0,
        }));

        // Recompute dailyStudy based on activeDatesMap and selectedDate
        const totalActivityCount = apiData.activityDates.reduce((sum: number, d: any) => {
          let count = 0;
          if (typeof d === "string") count = 1;
          else if (d && typeof d.date === "string") count = d.activityCount || 1;
          else if (d) count = 1;
          return sum + count;
        }, 0) || 1;
        const totalStudyMinutes = apiData.totalStudyMinutes || 0;

        local.dailyStudy = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const key = d.toISOString().slice(0, 10);
          const dayName = d.toLocaleString('en-US', { weekday: 'short' });
          const dayDate = d.getDate();

          let logins = activeDatesMap.has(key) ? 1 : 0;
          if (key === selectedDate) {
            logins = 2; // Increase logins when selected
          }

          let minutes = 0;
          if (activeDatesMap.has(key)) {
            const count = activeDatesMap.get(key) || 1;
            if (totalStudyMinutes > 0) {
              minutes = Math.round((count / totalActivityCount) * totalStudyMinutes);
            } else {
              minutes = count * 30; // fallback: 30 mins per activity
            }
          }

          if (key === selectedDate) {
            minutes = Math.round(minutes * 1.5) + 15; // Increase graph study time for selected date
          }

          return {
            day: `${dayName} ${dayDate}`,
            minutes,
            logins,
          };
        });
      }
    }
    return local;
  }, [mounted, curriculum, apiData, selectedDate]);

  if (!ready || !user || !analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
      </div>
    );
  }

  const firstName = user.fullName.split(" ")[0];
  const referralCode = `MST-${user.id.slice(-6).toUpperCase()}`;
  const referralLink = "Comming Soon"

  // Custom referrals based on validator2 vs another user
  const isAnotherUser = user.fullName.toLowerCase().includes("another") || user.email.toLowerCase().includes("another");

  const referralRecords: { name: string; joinedAt: string; status: string; eligible: boolean }[] = isAnotherUser ? [
    //   { name: "Suresh M.", joinedAt: "22 May 2026", status: "Registered", eligible: false },
  ] : [
    //   { name: "Riya S.", joinedAt: "12 May 2026", status: "Purchased course", eligible: true },
    //   { name: "Aman K.", joinedAt: "14 May 2026", status: "Purchased course", eligible: true },
    //   { name: "Neha P.", joinedAt: "16 May 2026", status: "Registered", eligible: false },
    //   { name: "Vikram T.", joinedAt: "18 May 2026", status: "Purchased course", eligible: true },
    //   { name: "Priya M.", joinedAt: "21 May 2026", status: "Registered", eligible: false },
  ];

  const successfulReferrals = referralRecords.filter((record) => record.eligible).length;
  const withdrawUnlocked = successfulReferrals > 0;
  const xpPct = Math.round(
    ((analytics.xp % 120) / Math.max(analytics.xpToNext, 1)) * 100
  );
  const currentPhaseIndex = Math.max(1, analytics.phaseJourney.findIndex(p => p.phaseId === analytics.currentPhaseId) + 1);

  const today = new Date();
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const currentMonth = currentMonthDate.getMonth();
  const currentYear = currentMonthDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'short', year: 'numeric' });

  const monthData = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(Date.UTC(currentYear, currentMonth, i + 1));
    const key = d.toISOString().slice(0, 10);
    const existing = analytics.activityHeatmap.find(h => h.date === key);
    return { date: key, count: existing ? existing.count : 0 };
  });

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] bg-[var(--bg)] overflow-hidden">
        {/* Sidebar attached to left edge */}
        <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex relative z-20">
          {/* profile */}
          <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mst-red text-sm font-bold text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text)]">
                {user.fullName}
              </p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Phase {currentPhaseIndex}
              </p>
            </div>
          </div>
          {/* nav */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {[
              { id: "overview", href: basePath, icon: LayoutDashboard, label: "Overview" },
              { href: "/learn", icon: TreePine, label: "Learning Tree" },
              { id: "assessments", href: `${basePath}#assessments`, icon: ClipboardCheck, label: "Assessments" },
              { id: "progress", href: `${basePath}#progress`, icon: BarChart3, label: "Progress" },
              ...(!isAdmin ? [{ id: "refer", href: `${basePath}#refer`, icon: Gift, label: "Refer & Earn" }] : []),
              ...(isAdmin ? [
                { href: "/admin/submissions", icon: BookOpen, label: "Submission Review" },
                { href: "/admin/users", icon: Users, label: "User Management" },
                { href: "/admin/referrals", icon: BarChart3, label: "Referral Analytics" },
              ] : []),
              { id: "profile", href: `${basePath}#profile`, icon: User, label: "Profile" },
            ].map((item) => {
              const isActive = item.id ? activeTab === item.id : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (item.id) {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                    ? "bg-mst-red/10 text-mst-red"
                    : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                    }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            {isAdmin && (
              <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-4">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  Admin Dashboards
                </p>
                {[
                  { role: "student", href: "/dashboard/student", label: "Student" },
                  { role: "validator", href: "/dashboard/validator", label: "Validator" },
                  { role: "working-professional", href: "/dashboard/working-professional", label: "Working Professional" },
                  { role: "non-validator", href: "/dashboard/non-validator", label: "General User" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]`}
                  >
                    <BookOpen size={16} />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
          <div className="mt-auto border-t border-[var(--border)] px-3 py-4 space-y-1">
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsAllocationModalOpen(true)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--border)]/40 hover:text-[var(--text)] cursor-pointer"
              >
                <PlusCircle size={16} />
                Request Course Allocation
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
                window.location.href = '/login';
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Wrapper */}
        <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Ambient background isolated to main area */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 20% 10%, rgba(168,85,247,0.12), transparent 55%), radial-gradient(ellipse 45% 35% at 80% 80%, rgba(59,130,246,0.1), transparent 50%)",
            }}
            aria-hidden
          />

          {/* Main */}
          <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:py-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="mx-auto max-w-6xl">
              {/* Mobile header */}
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <p className="text-sm font-bold text-[var(--text)]">
                  Command Center
                </p>
                <ThemeToggle />
              </div>

              {activeTab === 'profile' ? (
                <StudentProfile user={user} />
              ) : activeTab === 'refer' ? (
                <ReferAndEarnTab
                  referralCode={referralCode}
                  referralLink={referralLink}
                  referralRecords={referralRecords}
                  successfulReferrals={successfulReferrals}
                  withdrawUnlocked={withdrawUnlocked}
                />
              ) : activeTab === 'assessments' ? (
                <AssessmentsTab />
              ) : activeTab === 'progress' ? (
                <PlaceholderTab
                  title="Learning Progress"
                  icon={BarChart3}
                  description="Track your course completion, activity heatmap, and performance analytics here as you learn."
                />
              ) : (
                <>
                  {/* Hero */}
                  <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface)]/40 p-6 backdrop-blur-3xl sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_80px_rgba(168,85,247,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                  >
                    <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px] transition-all duration-1000 group-hover:bg-purple-500/30 group-hover:scale-110" />
                    <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-mst-red/20 blur-[100px] transition-all duration-1000 group-hover:bg-mst-red/30 group-hover:scale-110" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-mst-red">
                          Personal learning command center
                        </p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
                          Welcome back, {firstName} <span className="inline-block origin-[70%_70%] hover:animate-pulse cursor-default">👋</span>
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                          You are ahead of{" "}
                          <strong className="text-[var(--text)]">{analytics.percentile}%</strong> of
                          learners this week. Keep pushing - your next milestone is close.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <span className="flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1.5 text-xs font-bold text-orange-500 shadow-sm backdrop-blur-sm transition hover:bg-orange-500/20">
                            <Flame className="mr-1.5 h-4 w-4" />
                            {analytics.streakDays}d streak
                          </span>
                          <span className="flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-400 shadow-sm backdrop-blur-sm transition hover:bg-purple-500/20">
                            Phase: {analytics.currentPhaseTitle.slice(0, 28)}
                          </span>
                          <span className="flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-400 shadow-sm backdrop-blur-sm transition hover:bg-blue-500/20">
                            Rank #{analytics.rank}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-5">
                        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              fill="none"
                              stroke="url(#lvlGrad)"
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={`${analytics.overallProgress * 2.64} 264`}
                            />
                            <defs>
                              <linearGradient id="lvlGrad" x1="0" y1="0" x2="100" y2="100">
                                <stop offset="0%" stopColor="#e31e24" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="text-center">
                            <p className="text-2xl font-black text-[var(--text)]">P{currentPhaseIndex}</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              Phase
                            </p>
                          </div>
                        </div>
                        <div className="min-w-[150px]">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">XP Progress</p>
                          <p className="mt-1 text-2xl font-black tracking-tight text-[var(--text)]">
                            {analytics.overallProgress}% <span className="text-sm font-bold text-[var(--text-muted)]">Complete</span>
                          </p>
                          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--border)]/50 shadow-inner">
                            <motion.div
                              className="relative h-full rounded-full bg-gradient-to-r from-mst-red via-purple-500 to-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, analytics.overallProgress)}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                          <p className="mt-2 flex justify-between text-[11px] font-medium text-[var(--text-muted)]">
                            <span>{100 - analytics.overallProgress}% to go</span>
                            {analytics.overallProgress < 100 && (
                              <span className="font-bold text-[var(--text)]">Keep learning</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="relative mt-8 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent p-5 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:from-purple-500/15">
                    <div className="absolute -left-px top-1/2 h-1/2 w-[3px] -translate-y-1/2 rounded-full bg-purple-500" />
                    <p className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-purple-400" />
                      <span className="leading-relaxed">
                        <strong className="font-extrabold tracking-wide text-[var(--text)]">AI Mentor:</strong>{" "}
                        {analytics.insights[0] ?? "Start your first lesson to unlock personalized insights."}
                      </span>
                    </p>
                  </div> */}
                  </motion.section>

                  {/* Stats grid */}
                  <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {[
                      { label: "Completion", value: `${analytics.overallProgress}%`, icon: Target, color: "text-mst-red", bg: "bg-mst-red/10 border-mst-red/20" },
                      { label: "Modules", value: `${analytics.modulesCompleted}/${analytics.totalModules}`, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
                      { label: "Avg Score", value: analytics.averageScore > 0 ? `${analytics.averageScore}%` : "—", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
                      { label: "Study Time", value: `${analytics.totalStudyHours}h`, icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
                      // { label: "Focus", value: `${analytics.focusScore}%`, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
                      //{ label: "Consistency", value: `${analytics.revisionConsistency}%`, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
                      { label: "Coins", value: "—", icon: Flame, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
                      { label: "Percentile", value: `Top ${analytics.percentile}%`, icon: Trophy, color: "text-mst-red", bg: "bg-mst-red/10 border-mst-red/20" },
                    ].map((s, i) => (
                      <GlassCard key={s.label} className="!p-6 flex flex-col gap-3 group cursor-default">
                        <div className={`w-fit rounded-xl border ${s.bg} p-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <s.icon className={`h-5 w-5 ${s.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            {s.label}
                          </p>
                          <p className="mt-1 text-2xl font-black text-[var(--text)] tracking-tight">{s.value}</p>
                        </div>
                      </GlassCard>
                    ))}
                  </section>

                  {/* Phase journey */}
                  <section id="refer-earn" className="mt-8 scroll-mt-24">
                    <h2 className="mb-4 text-lg font-black text-[var(--text)]">Learning Journey</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {analytics.phaseJourney.map((ph, i) => (
                        <Link
                          key={ph.phaseId}
                          href="/learn"
                          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${ph.status === "active"
                            ? "border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-transparent shadow-lg shadow-orange-500/10"
                            : ph.status === "completed"
                              ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent"
                              : "border-[var(--border)] bg-[var(--surface)]/60 opacity-70 hover:opacity-100"
                            }`}
                        >
                          {ph.status === "active" && (
                            <span className="absolute right-4 top-4 h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                          )}
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Phase {i + 1}
                          </p>
                          <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-[var(--text)]">{ph.title}</p>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--border)] shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${ph.status === "completed"
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-mst-red to-orange-500"
                                }`}
                              style={{ width: `${ph.percent}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs font-bold text-[var(--text-muted)]">{ph.percent}%</p>
                        </Link>
                      ))}
                    </div>
                  </section>

                  {/* Charts row 1 */}
                  {/* <section className="mt-8 grid gap-4 lg:grid-cols-2">
                  <GlassCard>
                    <h3 className="text-sm font-black text-[var(--text)]">Your Learning Growth</h3>
                    <div className="mt-4 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.growthData}>
                          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                          <Line type="monotone" dataKey="progress" stroke="#e31e24" strokeWidth={2.5} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <h3 className="text-sm font-black text-[var(--text)]">Skill Strength Analysis</h3>
                    <div className="mt-2 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={analytics.skillRadar}>
                          <PolarGrid stroke="var(--border)" />
                          <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                          <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </section> */}

                  {/* Charts row 2 */}
                  <section className="mt-4 grid gap-4 lg:grid-cols-3">
                    <GlassCard className="lg:col-span-1">
                      <h3 className="text-sm font-black text-[var(--text)]">Course Completion</h3>
                      <div className="mt-2 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.completionDonut}
                              dataKey="value"
                              innerRadius={45}
                              outerRadius={70}
                              paddingAngle={4}
                            >
                              {analytics.completionDonut.map((e) => (
                                <Cell key={e.name} fill={e.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold">
                        {analytics.completionDonut.map((e) => (
                          <span key={e.name} className="flex items-center gap-1 text-[var(--text-muted)]">
                            <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                            {e.name}
                          </span>
                        ))}
                      </div>
                    </GlassCard>

                    <GlassCard className="lg:col-span-2">
                      <h3 className="text-sm font-black text-[var(--text)]">Module Performance</h3>
                      <div className="mt-4 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.moduleScores.length ? analytics.moduleScores : [{ name: "—", score: 0, moduleId: 0 }]}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#e31e24" maxBarSize={28} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  </section>

                  {/* Heatmap + study time */}
                  <section className="mt-4 grid gap-4 lg:grid-cols-2">
                    <GlassCard>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-[var(--text)]">Daily Consistency</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setMonthOffset(prev => prev - 1)} className="p-1 rounded-md hover:bg-[var(--bg-muted)] transition-colors">
                            <ChevronLeft className="h-4 w-4 text-[var(--text-muted)]" />
                          </button>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] min-w-[70px] text-center">
                            {monthName}
                          </span>
                          <button onClick={() => setMonthOffset(prev => prev + 1)} className="p-1 rounded-md hover:bg-[var(--bg-muted)] transition-colors" disabled={monthOffset >= 0}>
                            <ChevronRight className={`h-4 w-4 ${monthOffset >= 0 ? 'text-[var(--border)]' : 'text-[var(--text-muted)]'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2 sm:gap-2.5">
                        {monthData.map((d) => (
                          <button
                            key={d.date}
                            title={`${d.date}: ${d.count} activities`}
                            onClick={() => setSelectedDate(d.date)}
                            className={`h-6 w-6 sm:h-8 sm:w-8 shrink-0 rounded-md transition-transform hover:scale-110 focus:outline-none cursor-pointer ${selectedDate === d.date ? "ring-2 ring-[var(--text)] ring-offset-2 ring-offset-[var(--surface)] scale-105" : ""
                              }`}
                            style={{
                              background:
                                d.count === 0
                                  ? "var(--border)"
                                  : "#e31e24",
                            }}
                          />
                        ))}
                      </div>
                      {selectedDate && (
                        <div className="mt-4 p-3 rounded-xl bg-[var(--surface)]/80 border border-[var(--border)] text-xs text-[var(--text-muted)] flex justify-between items-center animate-in fade-in slide-in-from-top-1 duration-200">
                          <div>
                            <span className="font-bold text-[var(--text)]">Selected Date:</span> {selectedDate} &bull;{" "}
                            <span className="font-bold text-[var(--text)]">Activities:</span> {monthData.find(m => m.date === selectedDate)?.count || 0}
                          </div>
                          <button
                            onClick={() => setSelectedDate(null)}
                            className="text-[10px] uppercase font-bold text-mst-red hover:underline"
                          >
                            Clear Selection
                          </button>
                        </div>
                      )}
                    </GlassCard>

                    <GlassCard>
                      <h3 className="text-sm font-black text-[var(--text)]">Weekly Study Time</h3>
                      <div className="mt-4 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.dailyStudy}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  </section>

                  {/* AI Insights */}
                  {/* <section className="mt-8">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[var(--text)]">
                    <Brain className="h-5 w-5 text-purple-400" />
                    AI Improvement Insights
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {analytics.insights.map((text, i) => (
                      <GlassCard key={i} glow="rgba(168,85,247,0.12)">
                        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{text}</p>
                      </GlassCard>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <GlassCard>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Strengths</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                        {analytics.strengths.length ? analytics.strengths.join(" · ") : "Complete assessments to discover strengths"}
                      </p>
                    </GlassCard>
                    <GlassCard>
                      <p className="text-xs font-bold uppercase tracking-wider text-orange-500">Improve</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                        {analytics.weaknesses.length ? analytics.weaknesses.join(" · ") : "Keep learning — weaknesses will appear here"}
                      </p>
                    </GlassCard>
                  </div>
                </section> */}

                  {/* Learning health */}
                  {/* <section className="mt-8">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[var(--text)]">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Learning Health
                  </h2>
                  <GlassCard>
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                      <Gauge value={100 - analytics.health.burnoutRisk} label="Energy" color="#22c55e" />
                      <Gauge value={analytics.health.focusScore} label="Focus" color="#f97316" />
                      <Gauge value={analytics.health.retentionScore} label="Retention" color="#a855f7" />
                      <Gauge value={analytics.health.revisionHealth} label="Revision" color="#3b82f6" />
                      <Gauge value={analytics.health.learningSpeed} label="Speed" color="#eab308" />
                      <Gauge value={analytics.health.confidence} label="Confidence" color="#e31e24" />
                    </div>
                  </GlassCard>
                </section> */}

                  {/* Next actions */}
                  <section className="mt-8">
                    <h2 className="mb-4 text-lg font-black text-[var(--text)]">What To Do Next</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {analytics.nextActions.map((action) => (
                        <Link
                          key={action.label}
                          href={action.href}
                          className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-mst-red/40 hover:bg-mst-red/5 hover:shadow-[0_10px_30px_rgba(227,30,36,0.1)]"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-mst-red/0 via-mst-red/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="relative z-10 flex items-center gap-3">
                            {action.icon === "play" && <Play className="h-5 w-5 text-mst-red transition-transform duration-300 group-hover:scale-110" />}
                            {action.icon === "map" && <MapIcon className="h-5 w-5 text-purple-400 transition-transform duration-300 group-hover:scale-110" />}
                            {action.icon === "brain" && <Brain className="h-5 w-5 text-blue-400 transition-transform duration-300 group-hover:scale-110" />}
                            {action.icon === "trophy" && <Trophy className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:scale-110" />}
                            <span className="text-sm font-bold text-[var(--text)] group-hover:text-mst-red transition-colors">{action.label}</span>
                          </div>
                          <ArrowRight className="relative z-10 h-4 w-4 text-[var(--text-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-mst-red" />
                        </Link>
                      ))}
                    </div>
                  </section>

                  {/* Achievements + ranking */}
                  <section className="mt-8 grid gap-4 lg:grid-cols-2">
                    <div>
                      <h2 className="mb-4 text-lg font-black text-[var(--text)]">Achievements</h2>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {analytics.achievements.map((a) => (
                          <div
                            key={a.id}
                            className={`rounded-2xl border p-4 text-center transition ${a.unlocked
                              ? "border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                              : "border-[var(--border)] bg-[var(--surface)]/50 opacity-50 grayscale"
                              }`}
                          >
                            <span className="text-2xl">{a.emoji}</span>
                            <p className="mt-2 text-xs font-black text-[var(--text)]">{a.title}</p>
                            <p className="mt-1 text-[10px] text-[var(--text-muted)]">{a.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <GlassCard glow="rgba(227,30,36,0.1)">
                      <h3 className="text-sm font-black text-[var(--text)]">Community Ranking</h3>
                      <p className="mt-4 text-4xl font-black text-gradient-red">#{analytics.rank}</p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Top {analytics.percentile}% of academy learners
                      </p>
                      <div className="mt-4 space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Modules completed</span>
                          <span className="font-bold">{analytics.modulesCompleted}/{analytics.totalModules}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Coin balance</span>
                          <span className="font-bold text-amber-500">— $MSTC</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Current module</span>
                          <span className="font-bold truncate max-w-[160px]">{analytics.activeModuleTitle}</span>
                        </p>
                      </div>
                      <Link
                        href="/leaderboard"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mst-red hover:underline"
                      >
                        View full leaderboard
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </GlassCard>
                  </section>



                  <div className="mt-10 pb-8 text-center">
                    <Link
                      href="/learn"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-mst-red/25 transition hover:brightness-110"
                    >
                      <TreePine className="h-5 w-5" />
                      Continue on Learning Roadmap
                    </Link>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {isAllocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] my-8">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4 shrink-0">
              <h3 className="text-lg font-black text-[var(--text)]">
                Request Course Allocation
              </h3>
              <button
                onClick={() => setIsAllocationModalOpen(false)}
                className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAllocationSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Account Holder Name <span className="text-mst-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={allocationForm.accountHolderName}
                    onChange={(e) => setAllocationForm({ ...allocationForm, accountHolderName: e.target.value })}
                    className={`w-full rounded-lg border ${allocationErrors.accountHolderName ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    placeholder="Enter account holder name"
                  />
                  {allocationErrors.accountHolderName && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.accountHolderName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Category <span className="text-mst-red">*</span>
                  </label>
                  <select
                    value={allocationForm.category}
                    onChange={(e) => setAllocationForm({ ...allocationForm, category: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all text-[var(--text)]"
                  >
                    <option value="">Select Category</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="VALIDATOR">VALIDATOR</option>
                    <option value="WORKING_PROFESSIONAL">WORKING PROFESSIONAL</option>
                    <option value="NON_VALIDATOR">NON VALIDATOR</option>
                  </select>
                  {allocationErrors.category && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.category}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Amount Paid <span className="text-mst-red">*</span>
                  </label>
                  <input
                    type="number"
                    value={allocationForm.amountPaid}
                    onChange={(e) => setAllocationForm({ ...allocationForm, amountPaid: e.target.value })}
                    className={`w-full rounded-lg border ${allocationErrors.amountPaid ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    placeholder="2999"
                  />
                  {allocationErrors.amountPaid && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.amountPaid}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Payment Date <span className="text-mst-red">*</span>
                  </label>
                  <input
                    type="date"
                    value={allocationForm.paymentDate}
                    onChange={(e) => setAllocationForm({ ...allocationForm, paymentDate: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all"
                  />
                  {allocationErrors.paymentDate && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.paymentDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Transaction ID <span className="text-mst-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={allocationForm.transactionId}
                    onChange={(e) => setAllocationForm({ ...allocationForm, transactionId: e.target.value })}
                    className={`w-full rounded-lg border ${allocationErrors.transactionId ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    placeholder="UTR123456789"
                  />
                  {allocationErrors.transactionId && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.transactionId}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Payment Method <span className="text-mst-red">*</span>
                  </label>
                  <select
                    value={allocationForm.paymentMethod}
                    onChange={(e) => setAllocationForm({ ...allocationForm, paymentMethod: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all text-[var(--text)]"
                  >
                    <option value="">Select Method</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  {allocationErrors.paymentMethod && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.paymentMethod}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Upload payment screenshot <span className="text-mst-red">*</span>
                  </label>
                  <div className={`flex items-center gap-3 w-full rounded-lg border ${allocationErrors.paymentScreenshotUrl ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-1.5`}>
                    <label
                      htmlFor="screenshotUploadInput"
                      className="cursor-pointer rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-bold text-[var(--text)] hover:bg-[var(--border)] transition-all shrink-0 shadow-sm"
                    >
                      Choose File
                    </label>
                    <span className="text-[10px] text-[var(--text-muted)] truncate">
                      {screenshotFileName ? screenshotFileName : "No file chosen"}
                    </span>
                    <input
                      id="screenshotUploadInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleScreenshotUpload}
                    />
                  </div>
                  {allocationErrors.paymentScreenshotUrl && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.paymentScreenshotUrl}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Additional Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={allocationForm.additionalNotes}
                    onChange={(e) => setAllocationForm({ ...allocationForm, additionalNotes: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all"
                    placeholder="Payment completed successfully"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAllocationModalOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAllocation}
                  className="rounded-xl bg-mst-red hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAllocation ? 'Submitting...' : 'Request Allocation'}
                </button>
              </div>
            </form>
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
