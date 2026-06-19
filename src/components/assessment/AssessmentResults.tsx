"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Award, CheckSquare, AlertTriangle, Play, HelpCircle, ArrowRight } from "lucide-react";
import type { AssessmentQuestion, QuestionResult, UserAnswer } from "@/lib/types";
import { playSuccess, playError, playViolated } from "@/lib/sounds";
import { sanitizeHtml } from "@/lib/text";

interface StoredPayload {
  results: QuestionResult[];
  totalEarned: number;
  totalMax: number;
  percentage: number;
  passed: boolean;
  durationSec: number;
  answers: UserAnswer[];
  questions: AssessmentQuestion[];
  submoduleTitle: string;
  submoduleId: string;
  attempted?: number;
  skipped?: number;
  completedAt: string;
  violated?: boolean;
  violationCount?: number;
}

export function AssessmentResults({
  moduleId,
  subSlug,
}: {
  moduleId: number;
  subSlug: string;
}) {
  const [data, setData] = useState<StoredPayload | null>(null);
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem(`assessment-${moduleId}-${subSlug}`);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredPayload;
      setData(parsed);
      setTimeout(() => {
        if (parsed.violated) playViolated();
        else if (parsed.passed) playSuccess();
        else playError();
      }, 300);
    }
  }, [moduleId, subSlug]);

  useEffect(() => {
    if (!data?.passed) return;
    if (countdown <= 0) {
      router.push("/dashboard/student");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [data?.passed, countdown, router]);

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[var(--bg)] p-8 text-center text-[var(--text)] transition-colors duration-250">
        <p className="text-[var(--text-muted)] mb-4">No results found.</p>
        <Link
          href={`/module/${moduleId}/${subSlug}/assessment`}
          className="rounded-full bg-mst-red hover:bg-mst-red-dark px-6 py-2.5 text-sm font-semibold text-white transition"
        >
          Start Assessment
        </Link>
      </div>
    );
  }

  const mins = Math.floor(data.durationSec / 60);
  const secs = data.durationSec % 60;
  
  // Recalculate stats if missing in older session storage payloads
  const totalQuestions = data.questions.length;
  const attemptedCount = data.attempted ?? data.answers.filter(a => a.value.trim().length > 0 || a.selectedKey).length;
  const skippedCount = data.skipped ?? (totalQuestions - attemptedCount);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[var(--bg)] text-[var(--text)] transition-colors duration-250">
      
      {/* Auto-redirect banner for passed assessments */}
      {data.passed && (
        <div className="border-b border-green-500/20 bg-green-500/10 px-6 py-3 text-center">
          <p className="text-sm font-semibold text-green-600 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            Assessment Passed! Redirecting to Dashboard in {countdown}s...
            <Link
              href="/dashboard/student"
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-500 px-4 py-1 text-xs font-bold text-white hover:bg-green-600 transition"
              onClick={() => setCountdown(-1)}
            >
              Go Now <ArrowRight size={12} />
            </Link>
            <button
              type="button"
              onClick={() => setCountdown(9999)}
              className="ml-1 text-xs text-green-600 underline hover:no-underline"
            >
              Stay here
            </button>
          </p>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-muted)] px-6 py-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mst-red/10 px-3.5 py-1 text-xs font-bold text-mst-red uppercase tracking-wider mb-3">
          <Award size={13} /> Assessment Report
        </span>
        <h1 className="text-2xl font-black md:text-3xl tracking-tight text-[var(--text)]">
          {data.submoduleTitle}
        </h1>
        <p className="mt-2 text-xs font-semibold text-[var(--text-muted)]">
          Completed on {new Date(data.completedAt).toLocaleString()}
        </p>

        {/* SUMMARY CARD PANEL */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* SCORE */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Score</p>
            <p className="mt-2 text-4xl font-black text-mst-red">
              {data.totalEarned}
              <span className="text-sm font-normal text-[var(--text-muted)]">/{data.totalMax}</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[var(--text-muted)]">Marks Earned</p>
          </div>

          {/* PERCENTAGE */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Percentage</p>
            <p className="mt-2 text-4xl font-black text-[var(--text)]">
              {data.percentage}%
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[var(--text-muted)]">
              Threshold: 75% to Pass
            </p>
          </div>

          {/* PASS / FAIL / VIOLATED */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Status</p>
            <p
              className={`mt-2 text-3xl font-black ${
                data.violated
                  ? "text-red-500"
                  : data.passed
                    ? "text-green-500"
                    : "text-amber-500"
              }`}
            >
              {data.violated ? "VIOLATED" : data.passed ? "PASSED" : "REVIEWED"}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase">
              {data.violated ? (
                <span className="text-red-500">
                  ⚠ Cheating detected ({data.violationCount ?? 0} violations)
                </span>
              ) : data.passed ? (
                <span className="text-green-500">✓ Completed Module</span>
              ) : (
                <span className="text-amber-500">⚠ Verify Outlines</span>
              )}
            </p>
          </div>

          {/* DURATION & ATTEMPT STATS */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Time & Stats</p>
            <p className="mt-2 text-2xl font-black text-[var(--text)]">
              {mins}m {secs}s
            </p>
            <div className="mt-2 flex justify-center gap-3 text-[10px] font-semibold text-[var(--text-muted)]">
              <span>Attempted: <b className="text-[var(--text)]">{attemptedCount}</b></span>
              <span>Skipped: <b className="text-[var(--text)]">{skippedCount}</b></span>
            </div>
          </div>
        </div>
      </header>

      {/* QUICK LINK CONTROLS */}
      <div className="flex flex-wrap justify-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-6 py-4">
        {data.passed && (
          <Link
            href="/dashboard/student"
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-xs font-bold text-white transition shadow-sm hover:shadow-green-500/30"
          >
            Go to Dashboard
          </Link>
        )}
        <Link
          href={`/module/${moduleId}/${subSlug}/assessment/review`}
          className="rounded-full bg-mst-red hover:bg-mst-red-dark px-6 py-2.5 text-xs font-bold text-white transition shadow-sm"
        >
          Review Questions
        </Link>
        {!data.passed && (
          <Link
            href={`/module/${moduleId}/${subSlug}/assessment`}
            className="rounded-full border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-6 py-2.5 text-xs font-bold transition text-amber-600"
          >
            Retake Assessment
          </Link>
        )}
        <Link
          href={`/module/${moduleId}/${subSlug}`}
          className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] hover:bg-[var(--bg-muted)] px-6 py-2.5 text-xs font-bold transition text-[var(--text)]"
        >
          Back to Lesson
        </Link>
        <Link
          href={`/module/${moduleId}`}
          className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] hover:bg-[var(--bg-muted)] px-6 py-2.5 text-xs font-bold transition text-[var(--text)]"
        >
          Module Overview
        </Link>
        <Link
          href="/dashboard/student"
          className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] hover:bg-[var(--bg-muted)] px-6 py-2.5 text-xs font-bold transition text-[var(--text)]"
        >
          Dashboard
        </Link>
      </div>

      {/* DETAILED QUESTION REVIEW LIST */}
      <div className="mx-auto max-w-4xl w-full px-6 py-10 flex-1">
        <h2 className="text-xl font-bold tracking-tight mb-6 text-[var(--text)]">
          Detailed Question Review
        </h2>

        <div className="space-y-6">
          {data.results.map((r, i) => {
            const q = data.questions.find((x) => x.id === r.questionId);
            const isQuestionCoding = q && ["coding", "live_coding", "coding_project"].includes(q.type);
            const isCorrectAnswer = r.earned === r.max && r.max > 0;
            
            return (
              <article
                key={r.questionId}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden shadow-sm hover:shadow transition"
              >
                {/* Question Card Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-muted)] px-5 py-3.5">
                  <span className="font-black text-sm text-[var(--text)]">
                    Question {i + 1} <span className="text-xs font-normal text-[var(--text-muted)]">({q?.type.replace(/_/g, " ")})</span>
                  </span>
                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                    isCorrectAnswer
                      ? "bg-green-500/10 text-green-500 border-green-500/25"
                      : r.earned > 0
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/25"
                        : "bg-red-500/10 text-red-500 border-red-500/25"
                  }`}>
                    {r.earned} / {r.max} marks
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  
                  {/* Question Text */}
                  {q && (
                    <div
                      className="text-sm md:text-base text-[var(--text)] leading-relaxed font-semibold mb-6"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(q.text) }}
                    />
                  )}

                  {/* MCQ Options Display */}
                  {q?.type === "mcq" && q.options && (
                    <div className="mb-6 space-y-2">
                      {q.options.map((opt) => {
                        const isUserSel = r.userAnswer === opt.text || r.userAnswer === opt.key;
                        const isCorrectOpt = opt.isCorrect;
                        
                        return (
                          <div 
                            key={opt.key}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-xs ${
                              isCorrectOpt 
                                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 font-semibold"
                                : isUserSel
                                  ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 font-semibold"
                                  : "bg-[var(--bg-muted)] border-[var(--border)] text-[var(--text-muted)]"
                            }`}
                          >
                            <span className="font-bold">{opt.key}.</span>
                            <span>{opt.text}</span>
                            {isCorrectOpt && <span className="ml-auto font-bold text-[10px] uppercase">Correct Option</span>}
                            {!isCorrectOpt && isUserSel && <span className="ml-auto font-bold text-[10px] uppercase">Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Answers Comparison Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    
                    {/* User Answer Column */}
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Your Submission
                        </p>
                        {isQuestionCoding ? (
                          <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] p-3 font-mono text-[11px] text-[var(--text)] leading-relaxed max-h-[220px]">
                            <code>{r.userAnswer || "(no code submitted)"}</code>
                          </pre>
                        ) : (
                          <p className="mt-2 text-sm text-[var(--text)] font-medium whitespace-pre-wrap">
                            {r.userAnswer || "(no answer provided)"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer Column */}
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-green-500">
                          Correct / Reference Solution
                        </p>
                        
                        {isQuestionCoding ? (
                          <div className="mt-3">
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                              Review the model solution outline and guidelines below.
                            </p>
                            {q?.starterCode && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs font-bold text-green-500 hover:underline">
                                  Show Starter / Template Code
                                </summary>
                                <pre className="mt-2 overflow-x-auto rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] p-3 font-mono text-[11px] text-[var(--text)] max-h-[160px]">
                                  <code>{q.starterCode}</code>
                                </pre>
                              </details>
                            )}
                          </div>
                        ) : (
                          <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
                            {r.correctAnswer || "See explanation below"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CODING QUESTIONS DETAILED COMPILER TESTS */}
                  {isQuestionCoding && r.codingResults && (
                    <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
                      <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Compiler Test Case Executions
                        </span>
                        <span className="text-xs font-bold text-[var(--text)] font-mono">
                          Passed: {r.codingResults.passed} | Failed: {r.codingResults.failed}
                        </span>
                      </div>
                      
                      {r.codingResults.testCases && r.codingResults.testCases.length > 0 ? (
                        <div className="space-y-3">
                          {r.codingResults.testCases.map((tc: any, tcIdx: number) => (
                            <div 
                              key={tcIdx}
                              className={`rounded-lg border p-3 text-xs bg-[var(--bg)] ${
                                tc.pass 
                                  ? "border-green-500/25" 
                                  : "border-red-500/25"
                              }`}
                            >
                              <div className="flex items-center gap-2 font-bold mb-2">
                                {tc.pass ? (
                                  <CheckCircle2 size={13} className="text-green-500" />
                                ) : (
                                  <XCircle size={13} className="text-red-500" />
                                )}
                                <span className={tc.pass ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                  {tc.name}
                                </span>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2 text-[11px] font-mono mt-1">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Input:</span>
                                  <pre className="mt-0.5 rounded bg-[var(--bg-muted)] p-1.5 border border-[var(--border)] overflow-x-auto text-[var(--text)]">
                                    {tc.input}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Expected Output:</span>
                                  <pre className="mt-0.5 rounded bg-[var(--bg-muted)] p-1.5 border border-[var(--border)] overflow-x-auto text-[var(--text)]">
                                    {tc.expected}
                                  </pre>
                                </div>
                              </div>
                              <div className="mt-2 text-[11px] font-mono">
                                <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Actual Output/Details:</span>
                                <pre className="mt-0.5 rounded bg-[var(--bg-muted)] p-1.5 border border-[var(--border)] overflow-x-auto text-[var(--text)]">
                                  {tc.actual || "(no output)"}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)]">No test cases found.</p>
                      )}
                    </div>
                  )}

                  {/* Explanation Block */}
                  <div className="mt-4 rounded-xl bg-[var(--bg-muted)] p-4 border border-[var(--border)]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-mst-red mb-2">
                      Explanation & Grading Rubric
                    </p>
                    <div
                      className="prose prose-sm max-w-none text-xs text-[var(--text-muted)] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(
                          r.explanation || r.modelAnswer || q?.modelAnswer || "No detailed explanation provided."
                        ),
                      }}
                    />
                  </div>

                  {r.isAutoGraded !== undefined && (
                    <p className="mt-3 text-[10px] font-semibold text-[var(--text-muted)]">
                      {r.isAutoGraded
                        ? "Graded Automatically (System Verifications)"
                        : "Requires manual evaluation — compare details with rubric guidelines above"}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
