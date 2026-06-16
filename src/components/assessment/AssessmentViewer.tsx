"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Award } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useProctoring } from "@/hooks/useProctoring";

interface Question {
  questionNumber: number;
  type: string;
  marks: number;
  difficulty: string;
  questionText: string;
  options?: Array<{ label: string; text: string }>;
  correctAnswer?: string;
  explanation?: string;
  statement?: string;
}

interface Assessment {
  _id?: any;
  submoduleId: string;
  setNumber?: number;
  title: string;
  estimatedTime: number;
  totalMarks: number;
  questions: Question[];
}

interface AssessmentViewerProps {
  assessment: Assessment;
  moduleId: number;
  slug: string;
}

export default function AssessmentViewer({
  assessment,
  moduleId,
  slug,
}: AssessmentViewerProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [justifications, setJustifications] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [dbUserId, setDbUserId] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const response = await fetch(`${baseURL}/api/users/profile`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            setDbUserId(data.user._id || data.user.id || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile in AssessmentViewer:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const { violations, warningCount, activeViolations, autoSubmitTriggered } = useProctoring();
  const [lastSeenWarningCount, setLastSeenWarningCount] = useState(0);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  const isViolationLocked = activeViolations.size > 0;

  useEffect(() => {
    if (warningCount > lastSeenWarningCount) {
      setShowWarningPopup(true);
      setLastSeenWarningCount(warningCount);
    }
  }, [warningCount, lastSeenWarningCount]);

  useEffect(() => {
    if (isViolationLocked) {
      setShowWarningPopup(true);
    }
  }, [isViolationLocked]);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleOptionSelect = useCallback(
    (label: string) => {
      if (!submitted) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.questionNumber]: label,
        }));
      }
    },
    [currentQuestion.questionNumber, submitted]
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, assessment.questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleSubmit = useCallback(async () => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const formattedAnswers = assessment.questions.map((q, idx) => {
      const isTrueFalse = q.type === "TRUE_FALSE_WITH_JUSTIFICATION";
      const answerVal = answers[q.questionNumber];
      if (isTrueFalse) {
        return {
          questionNumber: q.questionNumber,
          questionType: q.type,
          selectedAnswer: answerVal === "True" ? true : answerVal === "False" ? false : "",
          justification: justifications[q.questionNumber] || "",
        };
      } else {
        return {
          questionNumber: q.questionNumber,
          questionType: q.type,
          selectedOption: answerVal || "",
        };
      }
    });

    const payload = {
      userId: dbUserId || user?.id || user?._id || "",
      assignmentId: assessment._id || "",
      submoduleId: assessment.submoduleId || "",
      totalQuestions: assessment.questions.length,
      answers: formattedAnswers,
      proctoringViolations: violations,
    };

    try {
      const response = await fetch(`${baseURL}/api/assignment-submissions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Response Status : ${response.status}`);
      }
      const result = await response.json();
      console.log(result)
      setSubmissionResult(result.submission || result);
    } catch (error: any) {
      console.error(error?.message ?? error);
    }

    sessionStorage.setItem(
      `assessment-${moduleId}-${slug}`,
      JSON.stringify({ answers, assessment })
    );
    setSubmitted(true);
  }, [answers, assessment, moduleId, slug, user, justifications, dbUserId, violations]);

  useEffect(() => {
    if (autoSubmitTriggered && !submitted) {
      handleSubmit();
    }
  }, [autoSubmitTriggered]);

  const isAnswered = answers[currentQuestion.questionNumber];
  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    const results = submissionResult?.answers ? submissionResult.answers.map((ans: any, idx: number) => {
      const q = assessment.questions[idx] || {};
      return {
        qNum: idx + 1,
        answer: ans.selectedOption || (ans.selectedAnswer === true ? "True" : ans.selectedAnswer === false ? "False" : ""),
        isCorrect: ans.isCorrect,
        marks: q.marks || 0
      };
    }) : assessment.questions.map((q, idx) => {
      const answer = answers[q.questionNumber];
      const isCorrect = answer === q.correctAnswer;
      return { qNum: idx + 1, answer: answer || "", isCorrect, marks: q.marks };
    });

    const totalEarned = submissionResult?.score !== undefined ? submissionResult.score : (submissionResult?.partialScore !== undefined ? submissionResult.partialScore : results.reduce(
      (sum, r) => sum + (r.isCorrect ? r.marks : 0),
      0
    ));
    const percentage = Math.round((totalEarned / assessment.totalMarks) * 100);
    const passed = percentage >= 75;

    return (
      <div className="min-h-screen bg-[var(--bg)] flex justify-center items-start py-8 px-4 overflow-y-auto">
        <div className="max-w-2xl w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 text-center my-auto">
          <div className="mb-6">
            {passed ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-black text-green-500 mb-2">
                  Assessment Passed!
                </h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-black text-yellow-500 mb-2">
                  Assessment Not Passed
                </h2>
              </>
            )}
          </div>

          <div className="bg-[var(--bg-muted)] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-black text-mst-red">
                  {totalEarned}
                </div>
                <div className="text-sm text-[var(--text-muted)]">Marks Earned</div>
              </div>
              <div className="text-3xl text-[var(--text-muted)]">/</div>
              <div className="text-center">
                <div className="text-4xl font-black text-[var(--text-muted)]">
                  {assessment.totalMarks}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  Total Marks
                </div>
              </div>
            </div>
            <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${passed ? "bg-green-500" : "bg-yellow-500"
                  }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="mt-3 text-2xl font-bold text-[var(--text)]">
              {percentage}%
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {results.map((result) => (
              <div
                key={result.qNum}
                className={`flex items-center justify-between p-3 rounded-lg ${result.isCorrect
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
                  }`}
              >
                <span className="text-sm">
                  Question {result.qNum}:{" "}
                  <span
                    className={
                      result.isCorrect ? "text-green-500" : "text-red-500"
                    }
                  >
                    {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </span>
                <span
                  className={`font-semibold ${result.isCorrect ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {result.isCorrect ? result.marks : 0}/{result.marks}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/module/${moduleId}`}
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--bg-muted)] text-center"
            >
              Back to Module
            </Link>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setSubmitted(false);
              }}
              className="flex-1 rounded-lg bg-mst-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Left Sidebar - Question List */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-[var(--border)] lg:bg-[var(--surface)]">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
            All Questions
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {answeredCount} of {assessment.questions.length} answered
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {assessment.questions.map((q, idx) => (
            <button
              key={q.questionNumber}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-full text-left p-3 rounded-lg transition text-sm ${idx === currentQuestionIndex
                ? "bg-mst-red/20 border border-mst-red text-mst-red font-semibold"
                : "border border-transparent hover:bg-[var(--bg-muted)]"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Q{idx + 1}</span>
                <span className="text-xs">{q.marks}m</span>
              </div>
              <div className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">
                {q.questionText || q.statement}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase ${q.difficulty === "Easy" ? "text-green-500" :
                  q.difficulty === "Medium" ? "text-yellow-500" :
                    "text-red-500"
                  }`}>
                  {q.difficulty}
                </span>
                {answers[q.questionNumber] ? (
                  <span className="text-green-500 text-xs font-bold">✓</span>
                ) : (
                  <span className="text-[var(--text-muted)] text-xs">○</span>
                )}
              </div>
            </button>
          ))}
        </nav>
        <div className="border-t border-[var(--border)] p-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)]">Progress</span>
            <span className="font-semibold text-[var(--text)]">
              {Math.round((answeredCount / assessment.questions.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mst-red to-orange-500 transition-all"
              style={{
                width: `${(answeredCount / assessment.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <Link
                href={`/module/${slug}`}
                className="text-sm font-medium text-mst-red hover:underline flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Back to Lesson
              </Link>
              <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {assessment.estimatedTime} min
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  {assessment.totalMarks} marks
                </div>
              </div>


            </div>
            <h1 className="text-2xl font-black text-[var(--text)]">
              {assessment.title}
            </h1>
            <div className="mt-3 h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mst-red to-orange-500 transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%`,
                }}
              />
            </div>
            {/* Violation Banner */}
            {warningCount > 0 && (
              <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2">
                <div className="max-w-4xl mx-auto text-sm text-red-500 font-medium">
                  ⚠️ Proctoring alert: {violations[0]?.message}
                </div>
              </div>
            )}
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}{" "}
              • Answered: {answeredCount}/{assessment.questions.length}
            </div>
          </div>
        </div>

        {/* Scrollable Question Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 mb-8">
              {/* Question Number & Difficulty */}
              <div className="flex items-start justify-between mb-4">
                <span className="inline-block rounded-lg bg-mst-red/20 px-3 py-1 text-sm font-bold text-mst-red">
                  Q{currentQuestionIndex + 1} • {currentQuestion.marks} marks •{" "}
                  {currentQuestion.difficulty}
                </span>
                {isAnswered && (
                  <span className="text-sm font-semibold text-green-500">
                    ✓ Answered
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-6">
                {currentQuestion.questionText || currentQuestion.statement}
              </h2>

              {/* Options */}
              {currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleOptionSelect(option.label)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${answers[currentQuestion.questionNumber] === option.label
                        ? "border-mst-red bg-mst-red/5"
                        : "border-[var(--border)] hover:border-mst-red/50 hover:bg-[var(--bg-muted)]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${answers[currentQuestion.questionNumber] === option.label
                            ? "border-mst-red bg-mst-red"
                            : "border-[var(--border)]"
                            }`}
                        >
                          {answers[currentQuestion.questionNumber] === option.label && (
                            <span className="text-xs font-bold text-white">✓</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-[var(--text)]">
                            {option.label}
                          </div>
                          <div className="text-sm text-[var(--text-muted)]">
                            {option.text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* True/False with Justification */}
              {currentQuestion.type === "TRUE_FALSE_WITH_JUSTIFICATION" && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    {["True", "False"].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(val)}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition ${answers[currentQuestion.questionNumber] === val
                          ? "border-mst-red bg-mst-red text-white"
                          : "border-[var(--border)] text-[var(--text)] hover:border-mst-red/50"
                          }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Justify your answer..."
                    value={justifications[currentQuestion.questionNumber] || ""}
                    onChange={(e) => {
                      if (!submitted) {
                        setJustifications((prev) => ({
                          ...prev,
                          [currentQuestion.questionNumber]: e.target.value,
                        }));
                      }
                    }}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] p-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-mst-red focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation - Sticky at bottom */}
        <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="ml-auto rounded-lg bg-gradient-to-r from-mst-red to-red-600 px-6 py-3 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-mst-red/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submitttttt Assessment
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 rounded-lg bg-mst-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showWarningPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl text-center transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
            {/* Warning Icon */}
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/30">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Warning Alert Title */}
            <h3 className="text-xl font-extrabold text-[var(--text)] mb-3">
              Proctoring Alert
            </h3>
            
            {/* Warning Message Box */}
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm text-left font-medium">
              Warning: {warningCount} proctoring violation{warningCount > 1 ? "s" : ""} detected.
            </div>

            {/* Active sustained violation notice */}
            {isViolationLocked && (
              <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-6 text-sm text-left font-medium">
                {Array.from(activeViolations).map((type) => (
                  <p key={type}>
                    {
                      {
                        CAMERA_OFF: "Camera is blocked — please allow camera access to continue.",
                        CAMERA_BLACK: "Camera appears covered or dark — uncover your camera to continue.",
                        CAMERA_BLUR: "Camera feed is blurry or obstructed — fix your camera to continue.",
                        TAB_SWITCH: "You switched tabs — return focus to continue.",
                        MIC_OFF: "Microphone is blocked — please allow microphone access to continue.",
                        FULLSCREEN_EXIT: "You exited fullscreen — re-enter fullscreen to continue.",
                      }[type] ?? `Active violation: ${type}`
                    }
                  </p>
                ))}
              </div>
            )}

            {!isViolationLocked && <div className="mb-6" />}

            {/* Acknowledge Button */}
            <button
              onClick={() => { if (!isViolationLocked) setShowWarningPopup(false); }}
              disabled={isViolationLocked}
              className={`w-full py-3 text-white font-bold rounded-xl transition duration-200 shadow-lg active:scale-95 ${
                isViolationLocked
                  ? "bg-red-300 cursor-not-allowed shadow-red-200/20"
                  : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
              }`}
            >
              {isViolationLocked ? "Resolve violation to continue" : "I Understand"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
