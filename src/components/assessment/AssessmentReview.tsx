"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ChevronLeft } from "lucide-react";
import type { AssessmentQuestion, QuestionResult, UserAnswer } from "@/lib/types";
import { sanitizeHtml } from "@/lib/text";

interface StoredPayload {
  results: QuestionResult[];
  questions: AssessmentQuestion[];
  submoduleTitle: string;
  answers: UserAnswer[];
}

export function AssessmentReview({
  moduleId,
  subSlug,
}: {
  moduleId: number;
  subSlug: string;
}) {
  const [data, setData] = useState<StoredPayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`assessment-${moduleId}-${subSlug}`);
    if (raw) {
      const p = JSON.parse(raw);
      setData({
        results: p.results,
        questions: p.questions,
        submoduleTitle: p.submoduleTitle,
        answers: p.answers || [],
      });
    }
  }, [moduleId, subSlug]);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-250">
        <Link 
          href={`/module/${moduleId}/${subSlug}/assessment`} 
          className="text-mst-red font-bold hover:underline"
        >
          Complete assessment first
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[var(--bg)] text-[var(--text)] transition-colors duration-250">
      
      {/* STICKY TOP HEADER */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black md:text-xl tracking-tight">Question Review</h1>
          <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">{data.submoduleTitle}</p>
        </div>
        <Link
          href={`/module/${moduleId}/${subSlug}/assessment/results`}
          className="inline-flex items-center gap-1 text-xs font-bold text-mst-red hover:underline"
        >
          <ChevronLeft size={14} /> Back to results
        </Link>
      </header>

      {/* REVIEW LIST */}
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        {data.results.map((r, i) => {
          const q = data.questions.find((x) => x.id === r.questionId);
          const isQuestionCoding = q && ["coding", "live_coding", "coding_project"].includes(q.type);
          const isCorrectAnswer = r.earned === r.max && r.max > 0;
          
          return (
            <article
              key={r.questionId}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden shadow-sm"
            >
              {/* Review Card Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-muted)] px-5 py-3">
                <span className="font-black text-sm">
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

              {/* Review Card Content */}
              <div className="p-6">
                
                {/* Question HTML */}
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
                          {isCorrectOpt && <span className="ml-auto font-bold text-[10px] uppercase text-green-500">Correct Option</span>}
                          {!isCorrectOpt && isUserSel && <span className="ml-auto font-bold text-[10px] uppercase text-red-500">Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Compare Answers Box */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Your Answer
                    </p>
                    {isQuestionCoding ? (
                      <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] p-3 font-mono text-[11px] text-[var(--text)] max-h-[220px]">
                        <code>{r.userAnswer || "(no answer)"}</code>
                      </pre>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--text)] font-semibold whitespace-pre-wrap leading-relaxed">
                        {r.userAnswer || "(no answer)"}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-500">
                      Correct Answer
                    </p>
                    
                    {isQuestionCoding ? (
                      <div className="mt-3">
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          Compare with the reference outline and rubric criteria in the feedback box below.
                        </p>
                        {q?.starterCode && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs font-bold text-green-500 hover:underline">
                              Show Starter Code Template
                            </summary>
                            <pre className="mt-2 overflow-x-auto rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] p-3 font-mono text-[11px] text-[var(--text)] max-h-[160px]">
                              <code>{q.starterCode}</code>
                            </pre>
                          </details>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
                        {r.correctAnswer || "See model answer & rubric below"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Coding Test Cases (if coding question results exist) */}
                {isQuestionCoding && r.codingResults && (
                  <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Compiler Verifications Summary
                      </span>
                      <span className="text-xs font-bold text-[var(--text)] font-mono">
                        Passed: {r.codingResults.passed} | Failed: {r.codingResults.failed}
                      </span>
                    </div>
                    {r.codingResults.testCases && r.codingResults.testCases.map((tc: any, tcIdx: number) => (
                      <div 
                        key={tcIdx}
                        className={`rounded-lg border p-3 text-xs bg-[var(--bg)] mb-2.5 last:mb-0 ${
                          tc.pass ? "border-green-500/25" : "border-red-500/25"
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
                          <span className="text-[9px] uppercase font-bold text-[var(--text-muted)]">Actual Output:</span>
                          <pre className="mt-0.5 rounded bg-[var(--bg-muted)] p-1.5 border border-[var(--border)] overflow-x-auto text-[var(--text)]">
                            {tc.actual || "(no output)"}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation Block */}
                <div className="mt-4 rounded-xl bg-[var(--bg-muted)] p-4 border border-[var(--border)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mst-red mb-2">
                    Explanation & Feedback
                  </p>
                  <div
                    className="prose prose-sm max-w-none text-xs text-[var(--text-muted)] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(
                        r.explanation || r.modelAnswer || q?.modelAnswer || q?.explanation || "No explanation provided."
                      ),
                    }}
                  />
                </div>

                {r.isAutoGraded !== undefined && (
                  <p className="mt-3 text-[10px] font-semibold text-[var(--text-muted)]">
                    {r.isAutoGraded
                      ? "Graded Automatically"
                      : "Manually reviewed criteria — compare with model answer guidelines above"}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
