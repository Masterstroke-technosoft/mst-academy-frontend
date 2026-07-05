"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Monitor,
  EyeOff,
  Clipboard,
  Timer,
  Lock,
} from "lucide-react";
import type { Assessment, AssessmentQuestion, UserAnswer } from "@/lib/types";
import { scoreAssessment } from "@/lib/scoring";
import { markAssessmentComplete, PASS_THRESHOLD } from "@/lib/progress";
import { CodingWorkspace } from "./CodingWorkspace";
import { useAuth } from "@/components/AuthProvider";
import {
  playClick,
  playSelect,
  playWarning,
  playSubmit,
  playNavigate,
  playSuccess,
  playError,
  playViolated,
} from "@/lib/sounds";
import { sanitizeHtml } from "@/lib/text";
import {
  AssessmentCameraProctor,
  requestCameraPermission,
  CameraRequiredNotice,
  type CameraViolationType,
} from "./AssessmentCameraProctor";
import {
  stopCameraMonitoring,
} from "@/components/proctoring-service/camera-monitor";

function isCodingQuestion(q: AssessmentQuestion): boolean {
  if (["coding", "live_coding"].includes(q.type)) {
    return true;
  }
  if (q.type === "other" || q.type === "coding_project") {
    const text = q.text.toLowerCase();
    const hasCodeExtension = text.includes(".sol") || text.includes(".js") || text.includes(".ts") || text.includes(".py") || text.includes(".cpp") || text.includes(".c ");
    const hasCodingKeywords = text.includes("smart contract") || text.includes("deployment script") || text.includes("test suite") || text.includes("react frontend") || text.includes("solidity contract");
    return q.marks >= 3 && (hasCodeExtension || hasCodingKeywords);
  }
  return false;
}

function getQuestionTimeLimit(q: AssessmentQuestion): number {
  if ((q as any).timeLimit) {
    const limit = (q as any).timeLimit;
    if (typeof limit === "number") return limit;
    if (typeof limit === "string") {
      if (limit.endsWith("m")) return parseInt(limit) * 60;
      if (limit.endsWith("s")) return parseInt(limit);
      return parseInt(limit) * 60;
    }
  }

  const type = q.type as string;
  const diff = (q.difficulty || "medium").toLowerCase();

  if (
    type === "mcq" ||
    type === "true_false" ||
    type === "TRUE_FALSE" ||
    type === "true_false_justification" ||
    type === "TRUE_FALSE_WITH_JUSTIFICATION"
  ) {
    if (diff === "easy" || diff === "required") return 30;
    if (diff === "hard") return 60;
    return 45;
  }

  if (type === "descriptive") {
    if (diff === "easy" || diff === "required") return 5 * 60;
    if (diff === "hard") return 10 * 60;
    return 7 * 60;
  }

  if (isCodingQuestion(q)) {
    if (diff === "easy") return 20 * 60;
    if (diff === "hard") return 45 * 60;
    return 30 * 60;
  }

  return 10 * 60;
}

const MAX_VIOLATIONS = 3;

/* ─────────────── Warning Modal ─────────────── */
function violationMessage(type: string) {
  switch (type) {
    case "tab_switch":
      return "You switched away from the assessment tab. This has been logged.";
    case "fullscreen_exit":
      return "You exited fullscreen mode. This has been logged.";
    case "camera_off":
      return "Your camera was turned off or disconnected. This is treated as cheating.";
    case "camera_covered":
      return "Your camera appears blocked or covered. This is treated as cheating.";
    case "camera_denied":
      return "Camera access was denied during the assessment. This is treated as cheating.";
    default:
      return "A proctoring violation was detected.";
  }
}

function ViolationWarningModal({
  type,
  count,
  onContinue,
  violated,
}: {
  type: string;
  count: number;
  onContinue: () => void;
  violated?: boolean;
}) {
  useEffect(() => {
    if (violated) playViolated();
    else playWarning();
  }, [violated]);
  const remaining = MAX_VIOLATIONS - count;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-red-500/30 bg-[var(--bg)] p-8 shadow-2xl">
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-full bg-red-500/15 p-4">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h2 className="mb-2 text-center text-xl font-black text-red-500">
          {violated ? "Assessment Violated" : "Security Violation Detected"}
        </h2>
        <p className="mb-4 text-center text-sm text-[var(--text-muted)]">
          {violationMessage(type)}
        </p>
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <p className="text-sm font-bold text-red-500">
            Warning {count} of {MAX_VIOLATIONS}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {remaining > 0
              ? `${remaining} more violation${remaining !== 1 ? "s" : ""} will auto-submit your assessment.`
              : "Your assessment is being submitted now."}
          </p>
        </div>
        {remaining > 0 && !violated && (
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Continue Assessment
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Entry Confirmation Screen ─────────────── */
function EntryConfirmationScreen({
  assessment,
  submoduleTitle,
  totalTimeLimit,
  onBegin,
}: {
  assessment: Assessment;
  submoduleTitle: string;
  totalTimeLimit: number;
  onBegin: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [cameraOk, setCameraOk] = useState(false);
  const [checkingCamera, setCheckingCamera] = useState(false);
  const questions = assessment.questions;
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);

  async function enableCamera() {
    setCheckingCamera(true);
    const ok = await requestCameraPermission();
    setCameraOk(ok);
    setCheckingCamera(false);
    if (ok) playSuccess();
    else playError();
  }

  const rules = [
    { icon: Monitor, text: "Fullscreen mode is required throughout the assessment" },
    { icon: EyeOff, text: "Tab switching is not allowed - violations are logged" },
    { icon: Clipboard, text: "Copy, paste, and cut are disabled" },
    { icon: Timer, text: "Assessment is timed - auto-submits when time runs out" },
    { icon: Lock, text: "Right-click and developer tools are blocked" },
    { icon: AlertTriangle, text: "Camera must stay ON - cheating triggers violation" },
    { icon: ShieldAlert, text: "3 violations = assessment violated & auto-submitted" },
  ];

  return (
    <div className="flex h-full items-center justify-center bg-[var(--bg)] p-6">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-mst-red/10 p-4">
            <ShieldAlert className="h-10 w-10 text-mst-red" />
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-black text-[var(--text)]">
          Assessment Rules
        </h1>
        <p className="mb-6 text-center text-sm text-[var(--text-muted)]">
          {submoduleTitle}
        </p>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-center">
            <p className="text-lg font-black text-[var(--text)]">{questions.length}</p>
            <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Questions</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-center">
            <p className="text-lg font-black text-[var(--text)]">{totalMarks}</p>
            <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Total Marks</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-center">
            <p className="text-lg font-black text-[var(--text)]">{Math.ceil(totalTimeLimit / 60)}m</p>
            <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Time Limit</p>
          </div>
        </div>

        {/* Rules */}
        <ul className="mb-6 space-y-2.5">
          {rules.map((rule, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-[var(--text)]">
              <rule.icon className="h-4 w-4 shrink-0 text-mst-red" />
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>

        {/* Agreement checkbox */}
        <div className="mb-4">
          <CameraRequiredNotice ok={cameraOk} />
          {!cameraOk && (
            <button
              type="button"
              onClick={enableCamera}
              disabled={checkingCamera}
              className="mt-3 w-full rounded-full border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-600 transition hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              {checkingCamera ? "Checking camera…" : "Enable camera to continue"}
            </button>
          )}
        </div>

        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition hover:border-mst-red/50">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#e63946] rounded"
          />
          <span className="text-sm text-[var(--text)]">
            I understand and agree to follow these rules. I acknowledge that violations will be recorded and may result in automatic submission.
          </span>
        </label>

        <button
          type="button"
          onClick={() => {
            playSubmit();
            onBegin();
          }}
          disabled={!agreed || !cameraOk}
          className="w-full rounded-full bg-mst-red px-6 py-3.5 text-sm font-bold text-white transition hover:bg-mst-red-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
interface FullscreenAssessmentProps {
  moduleId: number;
  subSlug: string;
  submoduleId: string;
  submoduleTitle: string;
  assessment: Assessment;
}

export function FullscreenAssessment({
  moduleId,
  subSlug,
  submoduleId,
  submoduleTitle,
  assessment,
}: FullscreenAssessmentProps) {
  const questions = assessment.questions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [startedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const current = questions[index];
  const storageKey = `mst-assessment-draft-${moduleId}-${subSlug}`;
  const { isAdmin } = useAuth();
  const router = useRouter();
  const exitTimerRef = useRef<number | null>(null);
  const [exitClickCount, setExitClickCount] = useState(0);
  const codingQuestionActive = isCodingQuestion(current);

  // Anti-cheat state
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [warningModal, setWarningModal] = useState<{
    type: string;
    count: number;
    violated?: boolean;
  } | null>(null);
  const [cameraViolationCount, setCameraViolationCount] = useState(0);
  const [assessmentViolated, setAssessmentViolated] = useState(false);
  const tabSwitchRef = useRef(0);
  const fullscreenExitRef = useRef(0);
  const cameraViolationRef = useRef(0);
  const hasAutoSubmitted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalViolationCount =
    tabSwitchCount + fullscreenExitCount + cameraViolationCount;

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
      }
      // Cleanup camera when component unmounts
      stopCameraMonitoring();
    };
  }, []);

  const [totalTimeLimit] = useState(() => {
    const hasProjectQuestion = questions.some(
      q => q.marks >= 3 && (q.type === "other" || q.type === "coding_project")
    );
    if (hasProjectQuestion) {
      return 45 * 60;
    }
    return questions.reduce((acc, q) => acc + getQuestionTimeLimit(q), 0);
  });

  const timeLeft = Math.max(0, totalTimeLimit - elapsed);

  // Load draft answers from sessionStorage
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(storageKey);
      if (draft) {
        const { answers: a, index: i } = JSON.parse(draft);
        if (a) setAnswers(a);
        if (typeof i === "number") setIndex(i);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // Save draft answers to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ answers, index })
    );
  }, [answers, index, storageKey]);

  // Keep track of elapsed time (only after assessment started)
  useEffect(() => {
    if (!assessmentStarted) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startedAt, assessmentStarted]);

  const setAnswer = useCallback(
    (q: AssessmentQuestion, value: string, selectedKey?: string, codingResults?: any) => {
      setAnswers((prev) => ({
        ...prev,
        [q.id]: { questionId: q.id, value, selectedKey, codingResults },
      }));
    },
    []
  );

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handleSubmit = useCallback(() => {
    const answerList = Object.values(answers);
    const { results, totalEarned, totalMax } = scoreAssessment(
      questions,
      answerList
    );
    const pct = Math.round((totalEarned / totalMax) * 100);
    const violatedNow = assessmentViolated || totalViolationCount >= MAX_VIOLATIONS;
    const passed = !violatedNow && pct >= PASS_THRESHOLD;
    const durationSec = Math.floor((Date.now() - startedAt) / 1000);

    const attempted = answerList.filter(a => a.value.trim().length > 0 || a.selectedKey).length;
    const skipped = questions.length - attempted;

    markAssessmentComplete(moduleId, subSlug, totalEarned, totalMax, passed);

    const payload = {
      results,
      totalEarned,
      totalMax,
      percentage: pct,
      passed,
      durationSec,
      answers: answerList,
      questions,
      submoduleTitle,
      submoduleId,
      attempted,
      skipped,
      completedAt: new Date().toISOString(),
      violated: assessmentViolated || totalViolationCount >= MAX_VIOLATIONS,
      violationCount: totalViolationCount,
    };

    sessionStorage.setItem(
      `assessment-${moduleId}-${subSlug}`,
      JSON.stringify(payload)
    );
    sessionStorage.removeItem(storageKey);

    // Stop camera and exit fullscreen before navigation
    stopCameraMonitoring();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }

    window.location.href = `/module/${moduleId}/${subSlug}/assessment/results`;
  }, [
    answers,
    moduleId,
    questions,
    startedAt,
    submoduleId,
    submoduleTitle,
    subSlug,
    storageKey,
    assessmentViolated,
    totalViolationCount,
  ]);

  // Auto-submit when time is up
  useEffect(() => {
    if (!assessmentStarted) return;
    if (totalTimeLimit > 0 && elapsed >= totalTimeLimit) {
      handleSubmit();
    }
  }, [elapsed, totalTimeLimit, handleSubmit, assessmentStarted]);

  const triggerAutoSubmit = useCallback(() => {
    if (hasAutoSubmitted.current) return;
    if (isAdmin) return;
    hasAutoSubmitted.current = true;
    handleSubmit();
  }, [handleSubmit, isAdmin]);

  const handleCameraViolation = useCallback(
    (type: CameraViolationType) => {
      if (isAdmin) return;
      cameraViolationRef.current += 1;
      setCameraViolationCount(cameraViolationRef.current);
      const total =
        tabSwitchRef.current + fullscreenExitRef.current + cameraViolationRef.current;
      if (total >= MAX_VIOLATIONS) {
        setAssessmentViolated(true);
        setWarningModal({ type, count: total, violated: true });
        triggerAutoSubmit();
      } else {
        setWarningModal({ type, count: total });
      }
    },
    [isAdmin, triggerAutoSubmit]
  );

  /* ─── Fullscreen enforcement ─── */
  const requestFullscreen = useCallback(() => {
    try {
      document.documentElement.requestFullscreen?.();
    } catch {
      /* some browsers block this */
    }
  }, []);

  useEffect(() => {
    if (!assessmentStarted) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && assessmentStarted) {
        fullscreenExitRef.current += 1;
        setFullscreenExitCount(fullscreenExitRef.current);
        const total =
          tabSwitchRef.current + fullscreenExitRef.current + cameraViolationRef.current;
        if (total >= MAX_VIOLATIONS) {
          setAssessmentViolated(true);
          setWarningModal({ type: "fullscreen_exit", count: total, violated: true });
          triggerAutoSubmit();
        } else {
          setWarningModal({ type: "fullscreen_exit", count: total });
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [assessmentStarted, triggerAutoSubmit]);

  /* ─── Tab switch detection ─── */
  useEffect(() => {
    if (!assessmentStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        setTabSwitchCount(tabSwitchRef.current);
        const total =
          tabSwitchRef.current + fullscreenExitRef.current + cameraViolationRef.current;
        if (total >= MAX_VIOLATIONS) {
          setAssessmentViolated(true);
          setWarningModal({ type: "tab_switch", count: total, violated: true });
          triggerAutoSubmit();
        } else {
          setWarningModal({ type: "tab_switch", count: total });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [assessmentStarted, triggerAutoSubmit]);

  /* ─── Copy/Paste/Cut prevention ─── */
  useEffect(() => {
    if (!assessmentStarted) return;
    const container = containerRef.current;
    if (!container) return;

    const handleCopy = (e: Event) => {
      const target = e.target as HTMLElement;
      const isMonaco = target.closest(".monaco-editor");
      if (!isMonaco) e.preventDefault();
    };
    const handleCut = (e: Event) => {
      const target = e.target as HTMLElement;
      const isMonaco = target.closest(".monaco-editor");
      if (!isMonaco) e.preventDefault();
    };
    const handlePaste = (e: Event) => {
      const target = e.target as HTMLElement;
      const isMonaco = target.closest(".monaco-editor");
      if (!isMonaco) e.preventDefault();
    };

    container.addEventListener("copy", handleCopy);
    container.addEventListener("cut", handleCut);
    container.addEventListener("paste", handlePaste);

    return () => {
      container.removeEventListener("copy", handleCopy);
      container.removeEventListener("cut", handleCut);
      container.removeEventListener("paste", handlePaste);
    };
  }, [assessmentStarted]);

  /* ─── Keyboard shortcut prevention ─── */
  useEffect(() => {
    if (!assessmentStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTextInput = target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable;
      const isMonaco = target.closest(".monaco-editor");

      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        const blockedKeys = ["c", "v", "a", "s", "p", "u"];
        if (blockedKeys.includes(e.key.toLowerCase())) {
          if (isMonaco) return;
          if (isTextInput && (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "v")) {
            return;
          }
          e.preventDefault();
          return;
        }

        if (e.shiftKey && e.key.toLowerCase() === "i") {
          e.preventDefault();
          return;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [assessmentStarted]);

  /* ─── Begin assessment handler ─── */
  const handleBeginAssessment = useCallback(() => {
    setAssessmentStarted(true);
    requestFullscreen();
  }, [requestFullscreen]);

  const handleWarningDismiss = useCallback(() => {
    setWarningModal(null);
    requestFullscreen();
  }, [requestFullscreen]);

  function handleExitAttempt() {
    if (!codingQuestionActive) {
      stopCameraMonitoring();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }
      router.push(`/module/${moduleId}/${subSlug}`);
      return;
    }

    if (!isAdmin) {
      return;
    }

    if (exitClickCount === 0) {
      setExitClickCount(1);
      exitTimerRef.current = window.setTimeout(() => setExitClickCount(0), 2000);
      return;
    }

    stopCameraMonitoring();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
    router.push(`/module/${moduleId}/${subSlug}`);
  }

  /* ─── Entry confirmation screen ─── */
  if (!assessmentStarted) {
    return (
      <EntryConfirmationScreen
        assessment={assessment}
        submoduleTitle={submoduleTitle}
        totalTimeLimit={totalTimeLimit}
        onBegin={handleBeginAssessment}
      />
    );
  }

  if (!current) return null;

  const currentAnswer = answers[current.id];
  const hasCodingSubmission = codingQuestionActive && !!currentAnswer?.codingResults;
  const progress = ((index + 1) / questions.length) * 100;
  const totalMaxMarks = questions.reduce((s, q) => s + q.marks, 0);
  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className="assessment-lockdown flex h-full flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-250"
      style={{ userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties}
    >
      {!isAdmin && (
        <AssessmentCameraProctor
          active={assessmentStarted && !assessmentViolated}
          onViolation={handleCameraViolation}
          placement={codingQuestionActive ? "bottom" : "top"}
        />
      )}

      {/* Warning Modal */}
      {warningModal && (
        <ViolationWarningModal
          type={warningModal.type}
          count={warningModal.count}
          violated={warningModal.violated}
          onContinue={handleWarningDismiss}
        />
      )}

      {assessmentViolated && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="mx-4 max-w-md rounded-2xl border-2 border-red-500 bg-red-950/40 p-10 text-center">
            <p className="text-3xl font-black uppercase tracking-widest text-red-500">
              Violated
            </p>
            <p className="mt-3 text-sm text-red-200">
              Cheating or proctoring rules were broken. Your assessment is being submitted.
            </p>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mst-red">
            {submoduleId} Assessment
          </p>
          <h1 className="truncate text-base font-black text-[var(--text)] md:text-lg">
            {submoduleTitle}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {/* Violation indicator */}
          {totalViolationCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5">
              <AlertTriangle size={12} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-500">
                {assessmentViolated ? "VIOLATED" : `${totalViolationCount}/${MAX_VIOLATIONS}`}
              </span>
            </div>
          )}
          <div className="text-right">
            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Time Remaining</p>
            <p className={`flex items-center gap-1 font-mono text-sm font-black ${timeLeft < 60 ? "text-mst-red animate-pulse" : "text-[var(--text)]"
              }`}>
              <Clock size={14} /> {formatTime(timeLeft)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Question</p>
            <p className="text-sm font-black text-[var(--text)]">
              {index + 1} <span className="text-[var(--text-muted)] font-normal">of</span>{" "}
              {questions.length}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExitAttempt}
            disabled={codingQuestionActive && !isAdmin}
            className={`rounded-full p-2 transition ${codingQuestionActive && !isAdmin ? "cursor-not-allowed opacity-50 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]" : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)]"}`}
            title={codingQuestionActive ? (isAdmin ? "Double-click to exit coding panel" : "Cannot exit until code is submitted") : "Exit assessment"}
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* DETAILED PROGRESS BAR */}
      <div className="flex items-center gap-3 px-4 py-2 md:px-6 bg-[var(--bg-muted)] border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
        <div className="w-32 bg-[var(--border)] h-2 rounded-full overflow-hidden shrink-0">
          <div
            className="bg-gradient-to-r from-orange-500 to-mst-red h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-semibold text-[var(--text)]">
          {Math.round(progress)}% Complete ({index + 1} of {questions.length} questions)
        </span>
      </div>

      {/* QUESTION BODY OR CODING WORKSPACE */}
      {isCodingQuestion(current) ? (
        <div className="min-h-0 flex-1">
          <CodingWorkspace
            question={current}
            questionIndex={index}
            value={currentAnswer?.value || ""}
            submoduleId={submoduleId}
            onChange={(v, results) => setAnswer(current, v, undefined, results)}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden bg-[var(--bg)]">
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="mx-auto max-w-3xl">
              {/* Question Metadata Row */}
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="rounded bg-mst-red/10 px-2.5 py-1 text-xs font-bold text-mst-red uppercase tracking-wider">
                  Q{current.number + 1}
                </span>
                <span className="rounded bg-[var(--bg-muted)] border border-[var(--border)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--text-muted)]">
                  {current.type.replace(/_/g, " ")}
                </span>
                <span className="rounded bg-[var(--bg-muted)] border border-[var(--border)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--text-muted)]">
                  {current.difficulty || "Medium"}
                </span>
                <span className="text-xs font-semibold text-[var(--text-muted)] ml-2">
                  {current.marks} mark{current.marks !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Question Text */}
              <div
                className="text-base md:text-lg leading-relaxed text-[var(--text)] font-semibold mb-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.text) }}
              />

              {/* MCQ Options */}
              {current.type === "mcq" && current.options && (
                <ul className="space-y-3">
                  {current.options.map((opt) => {
                    const sel = currentAnswer?.selectedKey === opt.key;
                    return (
                      <li key={opt.key}>
                        <button
                          type="button"
                          onClick={() => { playSelect(); setAnswer(current, opt.text, opt.key); }}
                          className={`w-full rounded-xl border-2 px-5 py-4 text-left text-sm transition font-medium ${sel
                            ? "border-mst-red bg-mst-red/10 text-[var(--text)] shadow-sm"
                            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-muted)]"
                            }`}
                        >
                          <span className="mr-3 font-bold text-mst-red">
                            {opt.key}.
                          </span>
                          {opt.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {((current.type as string) === "true_false" ||
                (current.type as string) === "TRUE_FALSE" ||
                (current.type as string) === "true_false_justification" ||
                (current.type as string) === "TRUE_FALSE_WITH_JUSTIFICATION") && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      {["TRUE", "FALSE"].map((v) => {
                        const sel = currentAnswer?.value?.startsWith(v);
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              playSelect();
                              const just =
                                (currentAnswer?.value || "").split("\n---\n")[1] ||
                                "";
                              const isJustification =
                                (current.type as string) === "true_false_justification" ||
                                (current.type as string) === "TRUE_FALSE_WITH_JUSTIFICATION";
                              setAnswer(
                                current,
                                isJustification
                                  ? `${v}\n---\n${just}`
                                  : v,
                                v
                              );
                            }}
                            className={`flex-1 rounded-xl border-2 py-4 font-bold transition text-center ${sel
                              ? "border-mst-red bg-mst-red/15 text-[var(--text)]"
                              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--bg-muted)] hover:border-[var(--border-strong)]"
                              }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                    {((current.type as string) === "true_false_justification" ||
                      (current.type as string) === "TRUE_FALSE_WITH_JUSTIFICATION") && (
                        <textarea
                          rows={5}
                          placeholder="Mandatory justification (at least 40 characters)…"
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-mst-red focus:outline-none"
                          style={{ userSelect: "text", WebkitUserSelect: "text" } as React.CSSProperties}
                          value={
                            (currentAnswer?.value || "").split("\n---\n")[1] || ""
                          }
                          onChange={(e) => {
                            const verdict =
                              (currentAnswer?.value || "").split("\n---\n")[0] ||
                              "";
                            setAnswer(current, `${verdict}\n---\n${e.target.value}`);
                          }}
                        />
                      )}
                  </div>
                )}

              {/* Descriptive / Project answers */}
              {(current.type === "descriptive" ||
                current.type === "other" ||
                current.type === "coding_project") &&
                !isCodingQuestion(current) && (
                  <textarea
                    rows={8}
                    placeholder="Type your answer here (minimum 40 words recommended, auto-saved)…"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-mst-red focus:outline-none"
                    style={{ userSelect: "text", WebkitUserSelect: "text" } as React.CSSProperties}
                    value={currentAnswer?.value || ""}
                    onChange={(e) => setAnswer(current, e.target.value)}
                  />
                )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CONTROLS */}
      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4 md:px-8">
        <button
          type="button"
          disabled={index === 0 || codingQuestionActive}
          onClick={() => { playNavigate(); setIndex((i) => i - 1); }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition disabled:opacity-30"
          title={codingQuestionActive ? "Cannot navigate away during coding question" : undefined}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          type="button"
          onClick={handleExitAttempt}
          disabled={codingQuestionActive && !isAdmin}
          className={`text-xs font-semibold transition ${codingQuestionActive && !isAdmin ? "cursor-not-allowed text-[var(--text-muted)] opacity-50" : "text-[var(--text-muted)] hover:text-mst-red"}`}
          title={codingQuestionActive ? (isAdmin ? "Double-click to exit coding panel" : "Cannot exit until code is submitted") : "Save and exit lesson"}
        >
          Save & exit lesson
        </button>

        {index < questions.length - 1 ? (
          <button
            type="button"
            disabled={codingQuestionActive && !hasCodingSubmission}
            onClick={() => { playNavigate(); setIndex((i) => i + 1); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-mst-red hover:bg-mst-red-dark px-6 py-2.5 text-sm font-bold text-white transition disabled:opacity-30"
            title={codingQuestionActive && !hasCodingSubmission ? "Submit code before continuing" : undefined}
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { playSubmit(); handleSubmit(); }}
            disabled={codingQuestionActive && !hasCodingSubmission}
            className="rounded-full bg-mst-red hover:bg-mst-red-dark px-8 py-2.5 text-sm font-bold text-white transition disabled:opacity-30"
            title={codingQuestionActive && !hasCodingSubmission ? "Submit code before finishing assessment" : undefined}
          >
            Submit Assessment
          </button>
        )}
      </footer>
    </div>
  );
}
