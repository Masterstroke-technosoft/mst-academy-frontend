"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Calendar, Hash, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface Submission {
  _id: string;
  assignmentId: string;
  submoduleId: string;
  setNumber: number;
  partialScore: number;
  score: number;
  totalQuestions: number;
  assignmentTitle: string;
  submoduleTitle: string;
  submittedAt: string;
}

function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const color =
    pct >= 80
      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
      : pct >= 50
      ? "text-amber-500 bg-amber-500/10 border-amber-500/30"
      : "text-mst-red bg-mst-red/10 border-mst-red/30";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {score}/{total}
      <span className="opacity-70">({pct}%)</span>
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function AssessmentsTab() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseURL}/api/assignment-submissions/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch submissions");
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
        <XCircle className="h-10 w-10 text-mst-red" />
        <p className="text-sm text-[var(--text-muted)]">{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">
        <div className="rounded-2xl bg-mst-red/10 p-4">
          <ClipboardCheck className="h-10 w-10 text-mst-red" />
        </div>
        <h2 className="mt-6 text-2xl font-black text-[var(--text)]">My Assessments</h2>
        <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">
          Complete modules on your Learning Roadmap to unlock assessments and certify your skills.
        </p>
      </div>
    );
  }

  const avgPct =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((acc, s) => acc + (s.totalQuestions > 0 ? s.score / s.totalQuestions : 0), 0) /
            submissions.length *
            100
        )
      : 0;

  const bestScore = submissions.reduce(
    (best, s) => {
      const pct = s.totalQuestions > 0 ? (s.score / s.totalQuestions) * 100 : 0;
      return pct > best ? pct : best;
    },
    0
  );

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Attempts", value: submissions.length, color: "text-blue-400" },
          { label: "Avg Score", value: `${avgPct}%`, color: "text-amber-500" },
          { label: "Best Score", value: `${Math.round(bestScore)}%`, color: "text-emerald-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center"
          >
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Submissions list */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="flex items-center gap-2 text-base font-black text-[var(--text)]">
            <ClipboardCheck className="h-5 w-5 text-mst-red" />
            Submission History
          </h2>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {submissions.map((sub, i) => {
            const pct = sub.totalQuestions > 0 ? Math.round((sub.score / sub.totalQuestions) * 100) : 0;
            const passed = pct >= 60;
            return (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-[var(--border)]/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {passed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-mst-red" />
                    )}
                    <p className="truncate text-sm font-bold text-[var(--text)]">{sub.assignmentTitle}</p>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Set {sub.setNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(sub.submittedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0">
                  <ScoreBadge score={sub.score} total={sub.totalQuestions} />
                  <div className="hidden sm:block w-20">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 80
                            ? "bg-emerald-500"
                            : pct >= 50
                            ? "bg-amber-500"
                            : "bg-mst-red"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
