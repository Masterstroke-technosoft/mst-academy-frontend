"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  GitBranch,
  Inbox,
  Clock,
  Award,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { Curriculum } from "@/lib/types";

interface SubmissionProgressTabProps {
  user: any;
  curriculum: Curriculum;
}

interface SubmissionItem {
  submissionId: string;
  submoduleId: string;
  submoduleTitle: string;
  selectedAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  submittedAt: string;
  passed: boolean;
  evaluated: boolean;
}

export function SubmissionProgressTab({ user, curriculum }: SubmissionProgressTabProps) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Map submodule IDs to titles from local curriculum data
  const submodulesMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (curriculum?.phases) {
      curriculum.phases.forEach((phase) => {
        const phaseModules = curriculum.modules?.filter((m) => m.phaseId === phase.id) || [];
        phaseModules.forEach((mod) => {
          mod.submodules?.forEach((sub) => {
            const id = sub.id || (sub as any)._id;
            if (id) {
              map[id] = sub.title;
            }
          });
        });
      });
    }
    return map;
  }, [curriculum]);

  const getSubmissionTime = (id: string, createdAt?: string) => {
    if (createdAt) return new Date(createdAt).toLocaleString();
    try {
      if (id && id.length === 24) {
        const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
        return new Date(timestamp).toLocaleString();
      }
    } catch (e) {}
    return "N/A";
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setErrorMsg(null);
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        let res = await fetch(`${baseURL}/api/assignment-submissions`, {
          method: "GET",
          credentials: "include",
          headers,
        });

        if (!res.ok) {
          // Try user-specific endpoint if general list is not accessible
          res = await fetch(`${baseURL}/api/assignment-submissions/user/${user.id || user._id}`, {
            method: "GET",
            credentials: "include",
            headers,
          });
        }

        if (!res.ok) {
          // Fallback to practical list
          res = await fetch(`${baseURL}/api/assignment-submissions/practical`, {
            method: "GET",
            credentials: "include",
            headers,
          });
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch submissions: ${res.statusText || res.status}`);
        }

        const data = await res.json();
        const rawSubmissions = Array.isArray(data) ? data : data?.data || [];
        
        const filteredList: SubmissionItem[] = [];

        rawSubmissions.forEach((sub: any) => {
          // Identify if this submission belongs to the current user
          const subUser = sub.user;
          const subUserId = subUser ? (subUser._id || subUser.id) : sub.userId;
          const subUserEmail = subUser?.email || sub.userEmail;

          const isMySubmission = 
            (subUserId && subUserId === user.id) || 
            (subUserEmail && subUserEmail.toLowerCase() === user.email.toLowerCase());

          if (isMySubmission) {
            const answers = sub.answers || [];
            answers.forEach((ans: any) => {
              if (ans.questionType === "PRACTICAL") {
                const subId = sub.submodule || sub.submoduleId || "";
                const evaluated = sub.evaluated || false;
                const scoreVal = sub.score ?? sub.partialScore ?? 0;
                
                // Assuming standard assignment total marks is 10, or falls back to custom marks
                const maxScoreVal = sub.totalMarks || 10;
                const percentage = Math.round((scoreVal / maxScoreVal) * 100);
                const passed = percentage >= 70;

                filteredList.push({
                  submissionId: sub._id || sub.id,
                  submoduleId: subId,
                  submoduleTitle: submodulesMap[subId] || sub.submoduleTitle || `Submodule (${subId.substring(0, 8)})`,
                  selectedAnswer: ans.selectedAnswer || ans.submission || "",
                  isCorrect: evaluated,
                  score: scoreVal,
                  maxScore: maxScoreVal,
                  passed: passed,
                  evaluated: evaluated,
                  submittedAt: getSubmissionTime(
                    sub._id || sub.id,
                    sub.createdAt || sub.updatedAt
                  ),
                });
              }
            });
          }
        });

        // Sort by submitted date descending
        filteredList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setSubmissions(filteredList);
      } catch (err: any) {
        console.error("Error loading student submissions:", err);
        setErrorMsg(err.message || "Failed to load submission progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, submodulesMap]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => !s.evaluated).length;
    const passed = submissions.filter((s) => s.evaluated && s.passed).length;
    const failed = submissions.filter((s) => s.evaluated && !s.passed).length;
    return { total, pending, passed, failed };
  }, [submissions]);

  const isLink = (val: string) => {
    return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("github.com");
  };

  const formatLink = (val: string) => {
    if (val.startsWith("github.com")) {
      return `https://${val}`;
    }
    return val;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface)]/40 p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mst-red/5 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-mst-red/30 bg-mst-red/10 px-3 py-1 text-xs font-bold text-mst-red uppercase tracking-wider mb-4">
            <Sparkles size={12} className="animate-spin" />
            Live Review Queue
          </div>
          <h2 className="text-2xl font-black text-[var(--text)] sm:text-3xl">Submission Progress</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Track the status of your practical assessment submissions. Submissions are reviewed by our engineering mentors, and marks/grades will appear below once evaluated.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-mst-red/30 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Submitted</p>
          <h3 className="mt-2 text-3xl font-black text-[var(--text)]">{stats.total}</h3>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-amber-500/30 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Pending Review</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-[var(--text)]">{stats.pending}</h3>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-green-500/30 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Passed</p>
          <h3 className="mt-2 text-3xl font-black text-green-500">{stats.passed}</h3>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:border-red-500/30 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Failed</p>
          <h3 className="mt-2 text-3xl font-black text-red-500">{stats.failed}</h3>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
          <p className="mt-4 text-sm text-[var(--text-muted)] font-medium">Fetching your submission records...</p>
        </div>
      ) : errorMsg ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-500 shadow-sm">
          <h3 className="font-bold text-lg mb-2">Error Loading Submissions</h3>
          <p className="text-sm">{errorMsg}</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-16 text-center shadow-sm min-h-[300px]">
          <Inbox size={48} className="text-[var(--text-muted)] opacity-40 mb-4" />
          <h3 className="text-xl font-bold text-[var(--text)]">No submissions found</h3>
          <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)] leading-relaxed">
            You haven't submitted any practical assessments yet. Start learning and submit assignments to track your progress here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((item) => {
            const hasLink = isLink(item.selectedAnswer);
            return (
              <div
                key={item.submissionId}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm hover:border-mst-red/20 transition-all duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={11} />
                      Submitted on {item.submittedAt}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[var(--text)] group-hover:text-mst-red transition-colors">
                      {item.submoduleTitle}
                    </h4>
                    
                    {/* Submitted Answer / Github link */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">Submission:</span>
                      {hasLink ? (
                        <a
                          href={formatLink(item.selectedAnswer)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-mst-red hover:underline"
                        >
                          <GitBranch size={12} className="shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-[400px]">
                            {item.selectedAnswer.replace(/^https?:\/\/(www\.)?/, "")}
                          </span>
                          <ExternalLink size={10} className="shrink-0" />
                        </a>
                      ) : (
                        <span className="truncate text-xs font-mono bg-[var(--bg-muted)] px-2.5 py-1 rounded max-w-[200px] sm:max-w-[400px] text-[var(--text)]">
                          {item.selectedAnswer || "Empty submission"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge & Score */}
                  <div className="flex flex-row items-center justify-between border-t border-[var(--border)] pt-4 sm:border-0 sm:pt-0 sm:flex-col sm:items-end gap-3 shrink-0">
                    <div>
                      {!item.evaluated ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-500 shadow-sm">
                          <Clock size={12} className="animate-spin" />
                          Pending Review
                        </span>
                      ) : item.passed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-bold text-green-500 shadow-sm">
                          <CheckCircle2 size={12} />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-500 shadow-sm">
                          <XCircle size={12} />
                          Failed
                        </span>
                      )}
                    </div>

                    {item.evaluated && (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--text)]">
                        <Award size={14} className="text-mst-red" />
                        <span>Score:</span>
                        <span className="text-base font-black text-mst-red">
                          {item.score} <span className="text-xs font-normal text-[var(--text-muted)]">/ {item.maxScore}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
