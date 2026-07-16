"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  PlayCircle,
  ChevronRight,
  ClipboardCheck,
  Clock,
  BookOpen,
  Trophy,
  ArrowLeft,
  Zap,
} from "lucide-react";
import type { ModuleMeta, Phase } from "@/lib/types";
import {
  getSubmoduleProgress,
  getModuleProgressPercent,
  getModuleStatus,
  isSubmoduleLocked,
} from "@/lib/progress";
import { getCardSubmoduleTitle } from "@/lib/display-titles";
import { registerSubmoduleMetadata } from "@/lib/curriculum";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

async function fetchWithAuth(url: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(url, {
    credentials: "include",
    headers,
  });
}

export function ModuleDetail({
  mod,
  phase,
  allModuleIds,
  moduleSlugMap,
}: {
  mod: ModuleMeta;
  phase?: Phase;
  allModuleIds: number[];
  moduleSlugMap: Record<number, string[]>;
}) {
  const getSlugs = (id: number) => moduleSlugMap[id] ?? [];
  const { user, isAdmin, ready: authReady } = useAuth();
  const [, setRefresh] = useState(0);
  const [localSubmodules, setLocalSubmodules] = useState(mod.submodules);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [verificationChecked, setVerificationChecked] = useState(false);

  useEffect(() => {
    if (authReady) setRefresh((n) => n + 1);
  }, [authReady, isAdmin]);

  // Gate lesson content behind payment/verification status, same rules as
  // the /learn roadmap - this page is reachable directly by URL so it must
  // not expose curriculum content to unverified/unpaid users on its own.
  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    let profilePaymentVerified = false;

    async function fetchProfile() {
      try {
        const res = await fetchWithAuth(`${baseURL}/api/me`);
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            if (!cancelled) setUserProfile(data.user);
            if (data.user.isPaymentVerified || data.user.paymentVerified) {
              profilePaymentVerified = true;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }

    async function checkPaymentStatus() {
      const userIsAdmin = user?.role === "admin" || user?.role === "ADMIN";
      if (!userIsAdmin) {
        if (!cancelled) setIsPaymentVerified(profilePaymentVerified);
        return;
      }
      try {
        const res = await fetchWithAuth(`${baseURL}/api/node-purchase`);
        if (res.ok) {
          const data = await res.json();
          let list: any[] = [];
          if (Array.isArray(data)) list = data;
          else if (data?.purchase) list = [data.purchase];
          else if (data?.data) list = Array.isArray(data.data) ? data.data : [];
          else if (data?.purchases) list = Array.isArray(data.purchases) ? data.purchases : [];
          const isApproved = list.some((item) => item.status === "APPROVED");
          if (!cancelled) setIsPaymentVerified(isApproved || profilePaymentVerified);
        } else if (!cancelled) {
          setIsPaymentVerified(profilePaymentVerified);
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        if (!cancelled) setIsPaymentVerified(profilePaymentVerified);
      }
    }

    async function run() {
      if (user) {
        await fetchProfile();
        await checkPaymentStatus();
      }
      if (!cancelled) setVerificationChecked(true);
    }
    run();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, baseURL]);

  const isStudentOrValidatorRole =
    userProfile?.role?.toLowerCase() === "student" || userProfile?.role?.toLowerCase() === "validator";
  const needsVerification =
    !!userProfile &&
    (!isPaymentVerified ||
      (isStudentOrValidatorRole && (!userProfile.isStudentVerified || !!userProfile.studentRejectionNote)));

  useEffect(() => {
    // Submodules already carry hasAssessment / totalMarks from the parent.
    // The old /api/assignments sync 404s and was a no-op, so it's removed.
    setLocalSubmodules(mod.submodules);
    mod.submodules.forEach((sub) => {
      registerSubmoduleMetadata(mod.id, sub);
    });
  }, [mod]);

  const slugs = localSubmodules.map((s) => s.slug);
  const progress = getModuleProgressPercent(mod.id, slugs);
  const status = getModuleStatus(mod.id, allModuleIds, slugs, getSlugs);
  const locked = status === "locked";
  const completed = status === "completed";

  const completedCount = localSubmodules.filter((sub) => {
    const p = getSubmoduleProgress(mod.id, sub.slug);
    const hasAssessment = sub.hasAssessment || false;
    return hasAssessment ? (p.lessonComplete && p.assessmentComplete) : p.lessonComplete;
  }).length;

  const totalMarks = localSubmodules.reduce((sum, sub) => sum + sub.totalMarks, 0);
  const earnedMarks = localSubmodules.reduce((sum, sub) => {
    const p = getSubmoduleProgress(mod.id, sub.slug);
    return sum + (p.score || 0);
  }, 0);

  // Default-deny: don't reveal lesson content until we've confirmed the
  // viewer is payment/identity verified, or until we know they don't need
  // to be (this route is reachable directly by URL, bypassing /learn's gate).
  if (!authReady || !verificationChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
      </div>
    );
  }

  if (needsVerification) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="flex items-start gap-3.5 rounded-2xl border p-5 text-sm font-semibold backdrop-blur-md" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
          {!isPaymentVerified ? (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
          ) : (
            <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
          )}
          <div>
            <p className="font-bold" style={{ color: '#e31e24' }}>
              {!isPaymentVerified ? "Payment Verification Required" : "Student Verification Pending"}
            </p>
            <p className="mt-1.5 leading-relaxed" style={{ color: '#e31e24' }}>
              {!isPaymentVerified
                ? "Please complete your payment and wait for verification before accessing this module."
                : "Please wait some time. Once admin student verification is complete, this module will be unlocked."}
            </p>
            <Link
              href="/learn"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-mst-red px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
            >
              Go to Learning Tree
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero section */}
      <div className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-muted)]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/learn"
              className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-mst-red transition"
            >
              <ArrowLeft size={14} />
              Learning Tree
            </Link>
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-mst-red">Module {mod.id}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-mst-red/10 px-3 py-1 text-xs font-bold text-mst-red uppercase tracking-wider">
                  {phase?.title}
                </span>
                {completed && (
                  <span className="flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600">
                    <Trophy size={12} /> Completed
                  </span>
                )}
                {locked && (
                  <span className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
                    <Lock size={12} /> Locked
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-black text-[var(--text)] sm:text-4xl">
                Module {mod.id}: {mod.title}
              </h1>
              <p className="mt-3 text-base text-[var(--text-muted)] leading-relaxed">
                {mod.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <BookOpen size={20} className="mx-auto text-mst-red" />
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{localSubmodules.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Lessons</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <ClipboardCheck size={20} className="mx-auto text-blue-500" />
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{completedCount}/{localSubmodules.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Done</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <Zap size={20} className="mx-auto text-amber-500" />
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{totalMarks}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Marks</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <Trophy size={20} className="mx-auto text-green-500" />
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{earnedMarks}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Earned</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--text)]">
                Module Progress
              </span>
              <span className="text-2xl font-black text-mst-red">{progress}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--bg-muted)]">
              <div
                className="h-full bg-gradient-to-r from-mst-red to-orange-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            {locked && (
              <p className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                <Lock size={16} /> Complete previous modules to unlock this module
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submodules list */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-[var(--text)]">
          <BookOpen size={22} className="text-mst-red" />
          Lessons & Assessments
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Complete each lesson and pass its assessment to progress
        </p>

        <div className="mt-6 space-y-3">
          {localSubmodules.map((sub, i) => {
            const p = getSubmoduleProgress(mod.id, sub.slug);
            const hasAssessment = sub.hasAssessment || false;
            const done = hasAssessment ? (p.lessonComplete && p.assessmentComplete) : p.lessonComplete;
            const subLocked = isSubmoduleLocked(locked, i, mod.id, localSubmodules);
            const scoreText = p.score !== undefined && p.maxScore
              ? `${p.score}/${p.maxScore} (${Math.round((p.score / p.maxScore) * 100)}%)`
              : null;

            return (
              <div
                key={sub.slug}
                className={`group rounded-2xl border p-5 transition-all duration-200 ${subLocked
                  ? "border-[var(--border)] bg-[var(--bg-muted)] opacity-70"
                  : done
                    ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-mst-red/30 hover:shadow-lg hover:shadow-mst-red/5"
                  }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${done
                      ? "bg-green-500 text-white"
                      : subLocked
                        ? "bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border)]"
                        : "bg-mst-red/10 text-mst-red"
                      }`}>
                      {done ? <CheckCircle2 size={20} /> : sub.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text)] text-base">
                        {getCardSubmoduleTitle(sub.title)}
                      </h3>
                      {sub.subtitle && (
                        <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-2 max-w-xl">
                          {sub.subtitle}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {sub.hasAssessment && (
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <ClipboardCheck size={12} />
                            {sub.totalMarks} marks
                          </span>
                        )}
                        {p.lessonComplete && (
                          <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                            <BookOpen size={10} /> Lesson Done
                          </span>
                        )}
                        {p.assessmentComplete && scoreText && (
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${p.passed ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                            }`}>
                            {p.passed ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            Score: {scoreText}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${done ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                          {done ? "✅ 100% Completed" : `⏳ Progress (${(hasAssessment ? ((p.lessonComplete ? 50 : 0) + (p.assessmentComplete ? 50 : 0)) : (p.lessonComplete ? 100 : 0)) || 0}%)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {subLocked ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Lock size={12} />
                        Pass {i > 0 ? `${sub.id.split('.')[0]}.${Number(sub.id.split('.')[1]) - 1}` : "previous"} first
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/module/${mod.id}/${sub.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border)] bg-transparent px-4 py-2.5 text-xs font-bold text-[var(--text)] transition hover:border-mst-red/40 hover:bg-[var(--bg-muted)]"
                      >
                        <PlayCircle size={14} />
                        {p.lessonComplete ? "Review" : "Start"} Lesson
                      </Link>
                      {sub.hasAssessment && (
                        <Link
                          href={`/module/${mod.id}/${sub.slug}/assessment`}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-mst-red/20 transition hover:shadow-mst-red/40"
                        >
                          <ClipboardCheck size={14} />
                          {p.assessmentComplete ? "Retake" : "Assessment"}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition hover:border-mst-red/40"
          >
            <ArrowLeft size={16} />
            Back to Learning Tree
          </Link>
          {localSubmodules[0] && !locked && (
            <Link
              href={`/module/${mod.id}/${localSubmodules[0].slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40"
            >
              <Zap size={16} />
              {progress > 0 ? "Resume Learning" : "Start Module"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
