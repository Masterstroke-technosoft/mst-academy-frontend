"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  MarkerType,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { useEffect, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Curriculum, ModuleMeta, SubmoduleMeta } from "@/lib/types";
import type { ModuleStatus } from "@/lib/progress";
import { useTheme } from "@/components/ThemeProvider";
import { useRoadmapStore } from "@/components/learn/roadmap/roadmapStore";
import { getCardSubmoduleTitle } from "@/lib/display-titles";
import { getModule, getSubmodule, registerSubmoduleMetadata, registerModuleIdMapping } from "@/lib/curriculum";
import {
  getModuleProgressPercent,
  getSubmoduleProgress,
  getModuleStatus,
  isSubmoduleLocked,
  PASS_THRESHOLD,
} from "@/lib/progress";
import { useAuth } from "@/components/AuthProvider";
import {
  AlertCircle,
  Clock,
  BookOpen,
  ChevronRight,
  Flame,
  Globe,
  Lock,
  Sparkles,
  Star,
  Trophy,
  Zap,
  Monitor,
} from "lucide-react";
import { playExpand, playNavigate, playSelect } from "@/lib/sounds";

type PhaseNodeVisual = {
  phaseId: string;
  title: string;
  color: string;
  active: boolean;
  dimmed: boolean;
  modulesCount: number;
};

type ModuleNodeVisual = {
  module: ModuleMeta;
  phaseId: string;
  color: string;
  status: ModuleStatus;
  progress: number;
  locked: boolean;
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
};

type SubmoduleNodeVisual = {
  module: ModuleMeta;
  sub: SubmoduleMeta;
  index: number;
  color: string;
  locked: boolean;
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
  progressPct: number;
};

const PHASE_STYLE = {
  "phase-1": { icon: Globe, color: "#3b82f6", gradient: "from-blue-500/35 to-cyan-400/15", label: "Foundation" },
  "phase-2": { icon: Zap, color: "#a855f7", gradient: "from-purple-500/35 to-violet-400/15", label: "Tooling" },
  "phase-3": { icon: Star, color: "#22c55e", gradient: "from-emerald-500/30 to-teal-400/15", label: "Build" },
  "phase-4": { icon: Trophy, color: "#e31e24", gradient: "from-red-500/35 to-orange-400/15", label: "Launch" },
} satisfies Record<string, { icon: any; color: string; gradient: string; label: string }>;

function tint(color: string, alphaHex: string) {
  // Accepts hex-like colors. We keep it simple by using opacity overlay where needed.
  return `${color}${alphaHex}`;
}

const PhaseCardNode = memo(function PhaseCardNode({
  data,
}: {
  data: PhaseNodeVisual & { onSelect: () => void };
}) {
  const phaseStyle = PHASE_STYLE[data.phaseId as keyof typeof PHASE_STYLE];
  const Icon = phaseStyle?.icon ?? Globe;
  const { color, active, dimmed, title, modulesCount } = data;
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: dimmed ? 0.35 : 1,
        scale: dimmed ? 0.93 : active ? 1.02 : 1,
        filter: dimmed ? "blur(1.4px)" : "blur(0px)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      onClick={() => {
        playExpand();
        data.onSelect();
      }}
      style={{ cursor: "pointer" }}
      className="relative"
    >
      {/* Handles for snake routing */}
      <Handle type="source" position={Position.Right} id="right-source" className="opacity-0" />
      <Handle type="target" position={Position.Left} id="left-target" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className="opacity-0" />
      <Handle type="target" position={Position.Top} id="top-target" className="opacity-0" />
      <Handle type="source" position={Position.Left} id="left-source" className="opacity-0" />
      <Handle type="target" position={Position.Right} id="right-target" className="opacity-0" />
      <div
        className={`group relative flex flex-col justify-between h-[180px] w-[min(100vw-3rem,420px)] max-w-[420px] sm:w-[360px] md:w-[420px] rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md p-5 sm:p-6 shadow-lg`}
        style={{
          boxShadow: active
            ? `0 18px 60px ${color}33`
            : dimmed
              ? "none"
              : "0 10px 40px rgba(0,0,0,0.06)",
          borderColor: active ? tint(color, "66") : undefined,
        }}
      >
        <div
          className={`absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${active ? "opacity-100" : ""
            }`}
          style={{
            background: `linear-gradient(135deg, ${color}33, transparent 55%), radial-gradient(ellipse at 30% 30%, ${color}22, transparent 60%)`,
          }}
        />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${color}26, transparent 60%)`,
                  border: `1px solid ${tint(color, "50")}`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  Phase {data.phaseId.split("-")[1]} • {phaseStyle?.label ?? "Phase"}
                </p>
                <h3 className="text-lg font-extrabold text-[var(--text)] line-clamp-2">{title}</h3>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-bold text-[var(--text-muted)]">
                {modulesCount} modules
              </span>
              {active && (
                <span className="rounded-full bg-mst-red/10 px-3 py-1 text-[11px] font-bold text-mst-red">
                  Expanded
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <ChevronRight className="h-5 w-5 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="relative flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              style={{
                width: active ? "100%" : "35%",
                background: `linear-gradient(90deg, ${color}40, ${color})`,
                boxShadow: active ? `0 0 10px ${color}55` : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const ModuleCardNode = memo(function ModuleCardNode({ data }: { data: ModuleNodeVisual }) {
  const { module, status, progress, locked, active, dimmed, color } = data;
  const title = module.title;
  const subCount = module.submodules.length;

  const badge =
    status === "completed"
      ? "Completed"
      : status === "active"
        ? "In Progress"
        : "Locked";

  return (
    <motion.div
      initial={false}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: active ? 1.03 : 1.01 }}
      animate={{
        opacity: dimmed ? 0.35 : 1,
        scale: active ? 1.03 : 1,
        filter: dimmed ? "blur(1.2px)" : "blur(0px)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="relative"
      style={{ pointerEvents: locked ? "none" : "auto" }}
      onClick={() => {
        if (!locked) {
          playNavigate();
          data.onSelect();
        }
      }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} id="left-target" className="opacity-0" />
      <Handle type="source" position={Position.Right} id="right-source" className="opacity-0" />
      <div
        className={`w-[min(100vw-3rem,480px)] max-w-[480px] min-h-[175px] flex flex-col justify-between rounded-3xl border bg-[var(--surface)]/80 backdrop-blur-md p-6 shadow-md transition-all duration-300 ${active
          ? "border-[var(--border-strong)]"
          : locked
            ? "border-[var(--border)] opacity-80"
            : "border-[var(--border)] hover:shadow-xl hover:-translate-y-1"
          }`}
        style={{
          borderColor: active ? tint(color, "80") : undefined,
          boxShadow: active ? `0 18px 60px ${color}33` : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl mt-0.5"
              style={{
                background: `linear-gradient(135deg, ${color}22, transparent 60%)`,
                border: `1px solid ${tint(color, "55")}`,
              }}
            >
              <BookOpen className="h-5 w-5" style={{ color }} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Module {module.index}
              </p>
              <h4 className="mt-1 line-clamp-2 text-lg font-extrabold text-[var(--text)]">
                {title}
              </h4>
            </div>
          </div>
          <div className="shrink-0 mt-0.5">
            {status === "locked" ? (
              <Lock className="h-4 w-4 text-[var(--text-muted)]/70" />
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-mst-red/10 px-2.5 py-1 text-[10px] font-bold text-mst-red"
                style={{ background: `${color}18`, color }}
              >
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[var(--text-muted)] font-medium">
              {progress === 100 ? "Completed" : "Progress"}
            </span>
            <span className="font-bold" style={{ color }}>
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]" aria-hidden>
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${progress}%`,
                background: status === "completed"
                  ? `linear-gradient(90deg, #22c55e, ${color})`
                  : `linear-gradient(90deg, ${color}, #ff7a18)`,
                boxShadow: active ? `0 0 20px ${color}55` : undefined,
              }}
            />
          </div>
        </div>

        {active && (
          <div className="pointer-events-none absolute -right-2 -top-2 h-10 w-10 rounded-full bg-mst-red/10 blur-[10px]" />
        )}
      </div>
    </motion.div>
  );
});

const SubmoduleChipNode = memo(function SubmoduleChipNode({
  data,
}: {
  data: SubmoduleNodeVisual;
}) {
  const { module, index, sub, locked, active, dimmed, color, progressPct } = data;
  const title = getCardSubmoduleTitle(sub.title);

  return (
    <motion.div
      initial={false}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: active ? 1.07 : 1.02 }}
      animate={{
        opacity: dimmed ? 0.35 : 1,
        scale: active ? 1.05 : 1,
        filter: dimmed ? "blur(1px)" : "blur(0px)",
      }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      onClick={() => {
        if (!locked) {
          playSelect();
          data.onSelect();
        }
      }}
      style={{ cursor: locked ? "not-allowed" : "pointer", pointerEvents: locked ? "none" : "auto" }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} id="left-target" className="opacity-0" />
      <Handle type="source" position={Position.Right} id="right-source" className="opacity-0" />
      <div
        className={`w-[min(100vw-3rem,400px)] max-w-[400px] rounded-2xl border bg-[var(--surface)]/80 backdrop-blur-md p-5 shadow-sm transition-all duration-300 ${active
          ? "border-[var(--border-strong)] shadow-xl"
          : locked
            ? "opacity-70"
            : "hover:-translate-y-0.5 hover:shadow-md"
          }`}
        style={{
          borderColor: active ? tint(color, "85") : undefined,
          boxShadow: active ? `0 18px 50px ${color}2a` : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {module.index || 1}.{index + 1}
            </p>
            <p className="mt-1 line-clamp-2 text-base font-bold text-[var(--text)]">{title}</p>
          </div>
          <div className="shrink-0">
            {locked ? (
              <Lock className="h-4 w-4 text-[var(--text-muted)]/70" />
            ) : active ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-mst-red/10 px-2 py-1 text-[10px] font-bold text-mst-red" style={{ background: `${color}18`, color }}>
                Active
              </span>
            ) : (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]">
                +
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-[var(--text-muted)]">
          <span>{progressPct === 100 ? "Completed" : "Progress"}</span>
          <span style={{ color }}>{progressPct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--border)]" aria-hidden>
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${color}, #ff7a18)` }}
          />
        </div>
      </div>
    </motion.div>
  );
});

function CameraController({ targetNodeIds }: { targetNodeIds: string[] }) {
  const rf = useReactFlow();

  useEffect(() => {
    if (!targetNodeIds.length) return;
    const t = setTimeout(() => {
      try {
        rf.fitView({
          nodes: targetNodeIds.map((id) => ({ id })) as any,
          padding: 0.12,
          duration: 750,
          minZoom: 0.85,
          maxZoom: 1.1,
        });
      } catch {
        // ignore
      }
    }, 60);
    return () => clearTimeout(t);
  }, [rf, targetNodeIds]);

  return null;
}

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

function computeProgressPctForSubmodule(moduleId: string | number, slug: string) {
  const p = getSubmoduleProgress(moduleId, slug);
  const sub = getSubmodule(moduleId, slug);
  const hasAssessment = sub?.hasAssessment ?? false;
  if (!hasAssessment) {
    return p.lessonComplete ? 100 : 0;
  }
  const base = (p.lessonComplete ? 50 : 0) + (p.assessmentComplete ? 50 : 0);
  return Math.min(100, Math.round(base));
}

function Breadcrumb({
  phaseTitle,
  moduleTitle,
  subTitle,
  onBackPhase,
  onBackModule,
  onResetAll,
}: {
  phaseTitle?: string;
  moduleTitle?: string;
  subTitle?: string;
  onBackPhase: () => void;
  onBackModule: () => void;
  onResetAll: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={onResetAll}
        className="text-xs font-bold text-mst-red hover:underline"
      >
        Home
      </button>
      {phaseTitle && (
        <>
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
          <button
            type="button"
            onClick={onBackPhase}
            className="text-xs font-bold text-[var(--text-muted)] hover:text-mst-red hover:underline"
          >
            {phaseTitle}
          </button>
        </>
      )}
      {moduleTitle && (
        <>
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
          <button
            type="button"
            onClick={onBackModule}
            className="text-xs font-bold text-[var(--text-muted)] hover:text-mst-red hover:underline"
          >
            {moduleTitle}
          </button>
        </>
      )}
      {subTitle && (
        <>
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
          <span className="text-xs font-bold text-[var(--text)]">{subTitle}</span>
        </>
      )}
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" className="shrink-0">
      <circle cx="19" cy="19" r={r} stroke="rgba(227,30,36,0.18)" strokeWidth="6" fill="none" />
      <circle
        cx="19"
        cy="19"
        r={r}
        stroke="url(#mstGrad)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform="rotate(-90 19 19)"
      />
      <defs>
        <linearGradient id="mstGrad" x1="0" y1="0" x2="38" y2="38">
          <stop offset="0%" stopColor="#e31e24" />
          <stop offset="100%" stopColor="#ff7a18" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LearningRoadmap({ curriculum: initialCurriculum }: { curriculum: Curriculum }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [showMobileWarningPopup, setShowMobileWarningPopup] = useState(false);

  const {
    activePhaseId,
    activeModuleId,
    activeSubmoduleSlug,
    setPhase,
    setModule,
    setSubmodule,
    resetAll,
    backToModule,
    backToPhase,
  } = useRoadmapStore();

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  const courseId = "6a2934912b48a13769669f8e";

  const [userProfile, setUserProfile] = useState<any>(null);
  const [hasSubmittedPayment, setHasSubmittedPayment] = useState(false);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);

  useEffect(() => {
    let profilePaymentVerified = false;

    async function fetchProfile() {
      try {
        const res = await fetchWithAuth(`${baseURL}/api/me`);
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUserProfile(data.user);
            if (data.user.isPaymentVerified || data.user.paymentVerified) {
              profilePaymentVerified = true;
              setIsPaymentVerified(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }
    async function checkPaymentStatus() {
      const isAdmin = user?.role === "admin" || user?.role === "ADMIN";
      if (!isAdmin) {
        setIsPaymentVerified(profilePaymentVerified);
        setHasSubmittedPayment(profilePaymentVerified);
        return;
      }
      try {
        const res = await fetchWithAuth(`${baseURL}/api/node-purchase`);
        if (res.ok) {
          const data = await res.json();
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
          if (list.length > 0) {
            setHasSubmittedPayment(true);
            const isApproved = list.some(item => item.status === "APPROVED");
            setIsPaymentVerified(isApproved || profilePaymentVerified);
          } else {
            setHasSubmittedPayment(false);
            setIsPaymentVerified(profilePaymentVerified);
          }
        } else {
          setIsPaymentVerified(profilePaymentVerified);
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        setIsPaymentVerified(profilePaymentVerified);
      }
    }
    async function loadData() {
      if (user) {
        await fetchProfile();
        await checkPaymentStatus();
      }
    }
    loadData();
  }, [user, baseURL]);

  const [fetchedPhases, setFetchedPhases] = useState<any[]>([]);

  const [fetchedModules, setFetchedModules] = useState<any[]>([]);

  const [fetchedSubmodules, setFetchedSubmodules] = useState<Record<string, any[]>>({});
  const isFetchingSubmodules = !!activeModuleId && !fetchedSubmodules[String(activeModuleId)];

  // Fetch course phases & single phases on mount
  useEffect(() => {
    async function loadPhases() {
      try {
        const res = await fetchWithAuth(`${baseURL}/api/phases/course/${courseId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const sorted = [...json.data].sort((a, b) => (a.index || 0) - (b.index || 0));
            // The list endpoint already returns full phase documents, so no
            // per-phase detail fetch is needed (avoids an N+1 request storm).
            setFetchedPhases(sorted);
          }
        }
      } catch (err) {
        console.error("Error fetching course phases:", err);
      }
    }
    loadPhases();
  }, [baseURL, courseId]);

  // Fetch modules & single modules when activePhaseId is set
  const activePhaseDbId = useMemo(() => {
    if (!activePhaseId) return null;
    if (activePhaseId.startsWith("phase-")) {
      const idx = parseInt(activePhaseId.split("-")[1], 10) - 1;
      const ph = fetchedPhases[idx];
      return ph ? (ph._id || ph.id) : null;
    }
    return activePhaseId;
  }, [activePhaseId, fetchedPhases]);

  useEffect(() => {
    if (!activePhaseDbId) return;

    async function loadModules() {
      try {
        const res = await fetchWithAuth(`${baseURL}/api/modules/phase/${activePhaseDbId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const sorted = [...json.data].sort((a, b) => (a.index || 0) - (b.index || 0));
            // The list endpoint already returns full module documents, so no
            // per-module detail fetch is needed (avoids an N+1 request storm).
            setFetchedModules((prev) => {
              const filtered = prev.filter((pm) => String(pm.phaseId) !== String(activePhaseDbId));
              return [...filtered, ...sorted];
            });
          }
        }
      } catch (err) {
        console.error("Error fetching modules by phase:", err);
      }
    }
    loadModules();
  }, [baseURL, activePhaseDbId]);

  // Fetch submodules & single submodules when activeModuleId is set
  useEffect(() => {
    if (!activeModuleId) return;

    async function loadSubmodules() {
      try {
        const res = await fetchWithAuth(`${baseURL}/api/submodules/module/${activeModuleId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const sorted = [...json.data].sort((a, b) => (a.index || 0) - (b.index || 0));
            // The list endpoint already returns full submodule documents
            // (including hasAssessment / totalMarks), so neither a per-submodule
            // detail fetch nor the assignments sync is needed here. The
            // /api/assignments call also 404s, so it was a no-op anyway.
            setFetchedSubmodules((prev) => ({
              ...prev,
              [String(activeModuleId)]: sorted,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching submodules by module:", err);
      }
    }
    loadSubmodules();
  }, [baseURL, activeModuleId]);

  // Build the dynamic curriculum object
  const curriculum = useMemo(() => {
    if (fetchedPhases.length === 0) {
      return initialCurriculum;
    }

    const sortedPhases = [...fetchedPhases].sort((a, b) => (a.index || 0) - (b.index || 0));

    const phases = sortedPhases.map((p, idx) => {
      const uiId = `phase-${idx + 1}`;
      const phaseModules = fetchedModules.filter((m) => String(m.phaseId) === String(p._id || p.id));
      return {
        id: uiId,
        title: p.description || p.title || `Phase ${idx + 1}`,
        modules: phaseModules.map((m) => m._id || m.id),
        realmodulecount: p.realmodulecount,
        moduleCount: p.moduleCount,
      };
    });

    const modules = fetchedModules.map((m) => {
      const phaseIdx = sortedPhases.findIndex((p) => String(p._id || p.id) === String(m.phaseId));
      const uiPhaseId = phaseIdx !== -1 ? `phase-${phaseIdx + 1}` : m.phaseId;
      const moduleId = m._id || m.id;

      registerModuleIdMapping(moduleId, m.index);

      const staticMod = getModule(m.index);
      const hasFetched = fetchedSubmodules[moduleId] !== undefined;
      const subList = hasFetched
        ? fetchedSubmodules[moduleId]
        : (String(moduleId) === String(activeModuleId) ? [] : (staticMod?.submodules || []));

      const submodules = subList.map((s: any, sIdx: number) => {
        const staticSub = staticMod?.submodules[sIdx];
        const subObj = {
          id: s.id || s._id,
          slug: s.slug || s._id || s.id,
          filename: s.filename || s.contentFile || "",
          title: s.title || "",
          subtitle: s.subtitle || s.description || "",
          hasAssessment: s.hasAssessment !== undefined ? s.hasAssessment : (staticSub?.hasAssessment || false),
          totalMarks: s.totalMarks || staticSub?.totalMarks || 0,
          toc: s.toc || [],
        };
        registerSubmoduleMetadata(moduleId, subObj);
        return subObj;
      });

      return {
        id: moduleId,
        slug: m.slug || String(moduleId),
        title: m.title || "",
        phaseId: uiPhaseId,
        description: m.description || "",
        submodules,
        index: m.index,
      };
    });

    return { phases, modules };
  }, [initialCurriculum, fetchedPhases, fetchedModules, fetchedSubmodules]);

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [viewportW, setViewportW] = useState(1200);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouse({ x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) });
  };

  useEffect(() => {
    setMounted(true);
    const sync = () => setViewportW(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const isMobile = viewportW < 640;
  const isTablet = viewportW >= 640 && viewportW < 1024;

  const phaseById = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        title: string;
        modules: any[];
        realmodulecount?: string | number;
        moduleCount?: number;
      }
    >();
    for (const p of curriculum.phases) map.set(p.id, p);
    return map;
  }, [curriculum.phases]);

  const activePhase = activePhaseId ? phaseById.get(activePhaseId) : undefined;
  const modulesInActivePhase = useMemo(() => {
    if (!activePhaseId) return [];
    return curriculum.modules.filter((m) => String(m.phaseId) === String(activePhaseId));
  }, [activePhaseId, curriculum.modules]);

  const activeModule = useMemo(() => {
    if (!activeModuleId) return undefined;
    return curriculum.modules.find((m) => String(m.id) === String(activeModuleId));
  }, [activeModuleId, curriculum.modules]);

  const activeSubmodule = useMemo(() => {
    if (!activeModule || !activeSubmoduleSlug) return undefined;
    return activeModule.submodules.find((s) => String(s.slug) === String(activeSubmoduleSlug));
  }, [activeModule, activeSubmoduleSlug]);

  const nodesAndEdges = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const phaseOrder = ["phase-1", "phase-2", "phase-3", "phase-4"];
    const allModuleIds = curriculum.modules.map((m) => m.id);
    const getSlugs = (id: any) =>
      curriculum.modules.find((mm) => String(mm.id) === String(id))?.submodules.map((s) => s.slug) ?? [];

    const cardW = isMobile ? 280 : isTablet ? 300 : 320;
    let moduleGapY = isMobile ? 220 : 240;
    if (activePhaseId === "phase-3" && !activeModuleId) {
      moduleGapY = 170; // Reduced gap specifically for Phase 3
    }
    const subGapY = isMobile ? 150 : 160;

    // ── Submodule view: ONLY selected module + its lessons (vertical stack) ──
    if (activeModuleId && activeModule && activePhaseId) {
      const style = PHASE_STYLE[activePhaseId as keyof typeof PHASE_STYLE];
      const color = style?.color ?? "#e31e24";
      const mod = activeModule;
      const slugs = mod.submodules.map((s) => s.slug);
      const status = getModuleStatus(mod.id, allModuleIds, slugs, getSlugs);
      const progress = getModuleProgressPercent(mod.id, slugs);
      const moduleLocked = status === "locked";
      const centerX = isMobile ? 20 : 80;

      nodes.push({
        id: `module-${mod.id}`,
        type: "moduleCard",
        position: { x: centerX, y: 0 },
        data: {
          module: mod,
          phaseId: activePhaseId,
          color,
          status,
          progress,
          locked: moduleLocked,
          active: true,
          dimmed: false,
          onSelect: () => { },
        } satisfies ModuleNodeVisual,
        draggable: false,
      });

      let lastUnlockedIndex = -1;
      mod.submodules.forEach((sub, i) => {
        const locked = isSubmoduleLocked(moduleLocked, i, mod.id, mod.submodules);
        if (!locked) {
          lastUnlockedIndex = i;
        }
      });

      mod.submodules.forEach((sub, i) => {
        const locked = isSubmoduleLocked(moduleLocked, i, mod.id, mod.submodules);
        const active = activeSubmoduleSlug === sub.slug;
        const dimmed = activeSubmoduleSlug != null && activeSubmoduleSlug !== sub.slug;
        const progressPct = computeProgressPctForSubmodule(mod.id, sub.slug);
        const subId = `sub-${mod.id}-${sub.slug}`;

        nodes.push({
          id: subId,
          type: "subChip",
          position: { x: centerX + (isMobile ? 0 : 20), y: 170 + i * subGapY },
          data: {
            module: mod,
            sub,
            index: i,
            color,
            locked,
            active,
            dimmed,
            onSelect: () => {
              if (viewportW <= 1024) {
                setShowMobileWarningPopup(true);
              } else if (!locked) {
                setSubmodule(sub.slug);
              }
            },
            progressPct,
          } satisfies SubmoduleNodeVisual,
          draggable: false,
        });

        // Edges removed per user request for a simpler look without connecting lines
      });

      return { nodes, edges };
    }

    // ── Module view: ONLY modules in selected phase (Snake Grid) ──
    if (activePhaseId) {
      const style = PHASE_STYLE[activePhaseId as keyof typeof PHASE_STYLE];
      const color = style?.color ?? "#e31e24";
      const modules = modulesInActivePhase;
      const startX = isMobile ? 20 : isTablet ? 40 : 60;
      const modGapX = isMobile ? 0 : isTablet ? 460 : 500;

      modules.forEach((mod, i) => {
        const slugs = mod.submodules.map((s) => s.slug);
        const status = getModuleStatus(mod.id, allModuleIds, slugs, getSlugs);
        const progress = getModuleProgressPercent(mod.id, slugs);
        const locked = status === "locked";

        const row = Math.floor(i / 2);
        const col = isMobile ? 0 : i % 2;
        const yRow = isMobile ? i : row;

        nodes.push({
          id: `module-${mod.id}`,
          type: "moduleCard",
          position: { x: startX + col * modGapX, y: yRow * moduleGapY },
          data: {
            module: mod,
            phaseId: activePhaseId,
            color,
            status,
            progress,
            locked,
            active: false,
            dimmed: false,
            onSelect: () => {
              if (viewportW <= 1024) {
                setShowMobileWarningPopup(true);
              } else if (!locked) {
                setModule(mod.id);
              }
            },
          } satisfies ModuleNodeVisual,
          draggable: false,
        });

        // No arrows between modules per user request
      });

      return { nodes, edges };
    }

    // ── Phase view: 2x2 snake grid ──
    const phaseGapX = isMobile ? cardW + 24 : isTablet ? 420 : 500;
    const phaseGapY = isMobile ? 240 : 260;

    for (let i = 0; i < phaseOrder.length; i++) {
      const phaseId = phaseOrder[i]!;
      const style = PHASE_STYLE[phaseId as keyof typeof PHASE_STYLE];
      const phase = phaseById.get(phaseId);
      const modulesCount = phase ? (Number(phase.realmodulecount) || phase.modules.length || phase.moduleCount || 0) : 0;

      const col = isMobile ? 0 : (i === 0 || i === 3 ? 0 : 1);
      const row = isMobile ? i : (i < 2 ? 0 : 1);

      nodes.push({
        id: `phase-${phaseId}`,
        type: "phaseCard",
        position: {
          x: col * phaseGapX,
          y: row * phaseGapY,
        },
        data: {
          phaseId,
          title: phase?.title ?? phaseId,
          color: style?.color ?? "#e31e24",
          active: false,
          dimmed: false,
          modulesCount,
          onSelect: () => setPhase(phaseId),
        } satisfies PhaseNodeVisual & { onSelect: () => void },
        draggable: false,
      });
    }

    if (!isMobile) {
      const edgeStyle = { stroke: "#e31e24", strokeWidth: 3, opacity: 0.6 };
      const markerEnd = { type: MarkerType.ArrowClosed, color: "#e31e24", width: 12, height: 12 };

      // Phase 1 -> Phase 2
      edges.push({
        id: `e-phase-0`,
        source: `phase-${phaseOrder[0]}`,
        target: `phase-${phaseOrder[1]}`,
        sourceHandle: "right-source",
        targetHandle: "left-target",
        type: "smoothstep",
        animated: true,
        style: edgeStyle,
        markerEnd,
      });
      // Phase 2 -> Phase 3
      edges.push({
        id: `e-phase-1`,
        source: `phase-${phaseOrder[1]}`,
        target: `phase-${phaseOrder[2]}`,
        sourceHandle: "bottom-source",
        targetHandle: "top-target",
        type: "smoothstep",
        animated: true,
        style: edgeStyle,
        markerEnd,
      });
      // Phase 3 -> Phase 4
      edges.push({
        id: `e-phase-2`,
        source: `phase-${phaseOrder[2]}`,
        target: `phase-${phaseOrder[3]}`,
        sourceHandle: "left-source",
        targetHandle: "right-target",
        type: "smoothstep",
        animated: true,
        style: edgeStyle,
        markerEnd,
      });
    }

    return { nodes, edges };
  }, [
    activePhaseId,
    activeModuleId,
    activeSubmoduleSlug,
    modulesInActivePhase,
    curriculum,
    isLight,
    isMobile,
    isTablet,
    phaseById,
    setPhase,
    setModule,
    setSubmodule,
    activeModule,
  ]);

  const { nodes, edges } = nodesAndEdges;

  const graphHeight = useMemo(() => {
    if (activeModuleId && activeModule) {
      return Math.max(480, 220 + activeModule.submodules.length * (isMobile ? 150 : 160));
    }
    if (activePhaseId) {
      const count = modulesInActivePhase.length;
      if (activePhaseId === "phase-3") {
        const rows = isMobile ? count : Math.ceil(count / 2);
        return Math.max(640, rows * 170 + 80);
      }
      return isMobile ? 520 : 640;
    }
    return isMobile ? 520 : 640;
  }, [activeModuleId, activeModule, activePhaseId, modulesInActivePhase.length, isMobile]);

  const targetFitIds = useMemo(() => {
    if (activeModuleId && activeModule) {
      return [
        `module-${activeModuleId}`,
        ...activeModule.submodules.map((sub) => `sub-${activeModuleId}-${sub.slug}`)
      ];
    }
    if (activePhaseId) {
      const moduleIds = curriculum.modules
        .filter((m) => m.phaseId === activePhaseId)
        .map((m) => `module-${m.id}`);
      return moduleIds;
    }
    return curriculum.phases.map((p) => `phase-${p.id}`);
  }, [activeSubmoduleSlug, activeModuleId, activePhaseId, curriculum.phases, curriculum.modules, activeModule]);

  const nodeTypes = useMemo(
    () => ({
      phaseCard: PhaseCardNode,
      moduleCard: ModuleCardNode,
      subChip: SubmoduleChipNode,
    }),
    []
  );

  const phaseTitle = activePhase?.title;
  const moduleTitle = activeModule?.title;
  const subTitle = activeSubmodule ? getCardSubmoduleTitle(activeSubmodule.title) : undefined;

  const activeSubIndex =
    activeModule && activeSubmodule
      ? activeModule.submodules.findIndex((s) => s.slug === activeSubmodule.slug)
      : -1;

  const activeModuleStatus = activeModule
    ? getModuleStatus(
      activeModule.id,
      curriculum.modules.map((m) => m.id),
      activeModule.submodules.map((s) => s.slug),
      (id) => curriculum.modules.find((mm) => String(mm.id) === String(id))?.submodules.map((s) => s.slug) ?? []
    )
    : null;

  const moduleLocked = activeModuleStatus === "locked";

  const lastUnlockedIndex = useMemo(() => {
    if (!activeModule) return -1;
    let lastIdx = -1;
    activeModule.submodules.forEach((sub, i) => {
      const locked = isSubmoduleLocked(moduleLocked, i, activeModule.id, activeModule.submodules);
      if (!locked) {
        lastIdx = i;
      }
    });
    return lastIdx;
  }, [activeModule, moduleLocked]);

  const subProgressPct =
    activeModule && activeSubmodule
      ? computeProgressPctForSubmodule(activeModule.id, activeSubmodule.slug)
      : 0;

  const activeSubProgress = useMemo(() => {
    if (!activeModule || !activeSubmodule) return null;
    return getSubmoduleProgress(activeModule.id, activeSubmodule.slug);
  }, [activeModule, activeSubmodule]);

  const subLocked =
    activeModule && activeSubmodule
      ? isSubmoduleLocked(
        moduleLocked,
        activeModule.submodules.findIndex((s) => s.slug === activeSubmodule.slug),
        activeModule.id,
        activeModule.submodules
      )
      : false;

  const detailCta = useMemo(() => {
    if (!activeModule || !activeSubmodule) return null;
    const canOpen = !subLocked;
    const lessonHref = `/module/${activeModule.id}/${activeSubmodule.slug}`;
    const assessmentHref = `/module/${activeModule.id}/${activeSubmodule.slug}/assessment`;
    const hasAssessment = activeSubmodule.hasAssessment;
    return { canOpen, lessonHref, assessmentHref, hasAssessment };
  }, [activeModule, activeSubmodule, subLocked]);

  const particles = useMemo(() => {
    // Deterministic positions (avoid Math.random during SSR)
    const base: Array<[number, number, number, number]> = [
      [8, 22, 4, 0.0],
      [18, 58, 3, 0.3],
      [28, 18, 2, 0.7],
      [38, 66, 3, 0.1],
      [48, 28, 2, 0.55],
      [58, 62, 4, 0.2],
      [68, 22, 3, 0.8],
      [76, 54, 2, 0.45],
      [84, 24, 4, 0.25],
      [10, 72, 2, 0.6],
      [24, 44, 3, 0.15],
      [40, 12, 2, 0.9],
      [62, 34, 3, 0.4],
      [74, 10, 2, 0.7],
      [90, 46, 3, 0.33],
      [6, 38, 4, 0.22],
    ];

    return base.map(([leftPct, topPct, size, delay], i) => ({
      id: `p-${i}`,
      leftPct,
      topPct,
      size,
      delay,
    }));
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            Loading learning roadmap…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg)] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* cinematic background */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            isLight
              ? "radial-gradient(ellipse 60% 45% at 30% 20%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(168,85,247,0.12), transparent 60%)"
              : "radial-gradient(ellipse 60% 45% at 30% 20%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(168,85,247,0.14), transparent 60%)",
          transform: `translate(${(mouse.x - 0.5) * 18}px, ${(mouse.y - 0.5) * 14}px)`,
          transition: "transform 120ms ease-out",
        }}
        aria-hidden
      />

      {/* floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${p.leftPct}%`,
            top: `${p.topPct}%`,
            width: p.size,
            height: p.size,
            background: isLight ? "rgba(59,130,246,0.18)" : "rgba(168,85,247,0.22)",
            boxShadow: isLight
              ? "0 0 18px rgba(59,130,246,0.25)"
              : "0 0 18px rgba(168,85,247,0.25)",
          }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 0.85, y: [10, -18, 8], scale: [0.85, 1.1, 0.95] }}
          transition={{
            duration: 6.5 + p.delay,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Hero strip */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)] p-[1px]"
        >
          <div
            className="absolute inset-0 animate-[shimmer-slide_4s_linear_infinite] opacity-80"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(168,85,247,0.45), rgba(59,130,246,0.45), rgba(227,30,36,0.5), transparent)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="relative rounded-[15px] bg-[var(--surface)]/85 px-5 py-4 backdrop-blur-md sm:px-6 sm:py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-mst-red">
                  Academy Roadmap
                </p>
                <h1 className="text-xl font-black text-[var(--text)] sm:text-2xl">
                  <span className="text-gradient-red">4 Phases</span> · 21 Modules · Your Path
                </h1>
                <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                  Tap a phase → pick a module → open lessons. Everything fits on screen - no clutter.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <Breadcrumb
            phaseTitle={phaseTitle}
            moduleTitle={moduleTitle}
            subTitle={subTitle}
            onResetAll={resetAll}
            onBackPhase={() => {
              backToPhase();
            }}
            onBackModule={() => {
              backToModule();
            }}
          />

          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-2 text-xs font-bold text-[var(--text-muted)] backdrop-blur-md">
              <Flame className="h-4 w-4 text-orange-500" />
              XP + streak
            </span>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-mst-red/20 transition hover:brightness-110"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {userProfile && (userProfile.role?.toLowerCase() === "student" || userProfile.role?.toLowerCase() === "validator") && (!userProfile.isStudentVerified || !!userProfile.studentRejectionNote || !isPaymentVerified) && (
        <div className="relative z-10 mx-auto mt-4 max-w-7xl px-4 sm:px-6">
          {!isPaymentVerified ? (
            (!userProfile.transactionId || !userProfile.transactionId.trim()) && !hasSubmittedPayment ? (
              <div className="flex items-start gap-3.5 rounded-2xl border p-4 text-xs font-semibold backdrop-blur-md" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Payment Pending</p>
                  <p className="mt-1 leading-relaxed" style={{ color: '#e31e24' }}>Please complete your payment first to access the curriculum. Once paid, ensure your Transaction ID is updated in your profile settings.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3.5 rounded-2xl border p-4 text-xs font-semibold backdrop-blur-md" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
                <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Payment Verification Pending</p>
                  <p className="mt-1 leading-relaxed" style={{ color: '#e31e24' }}>Please wait some time. Once admin payment verification is complete, your curriculum will be unlocked.</p>
                </div>
              </div>
            )
          ) : (!userProfile.isStudentVerified || userProfile.studentRejectionNote) ? (
            <div className="flex items-start gap-3.5 rounded-2xl border p-4 text-xs font-semibold backdrop-blur-md" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
              {userProfile.studentRejectionNote ? (
                <>
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Student Verification Rejected</p>
                    <p className="mt-1 leading-relaxed" style={{ color: '#e31e24' }}>
                      Your verification request was rejected. Reason: <span className="font-extrabold">{userProfile.studentRejectionNote}</span>. Please update your profile and re-upload your ID card.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Student Verification Pending</p>
                    <p className="mt-1 leading-relaxed" style={{ color: '#e31e24' }}>Please wait some time. Once admin student verification is complete, your curriculum will be unlocked.</p>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Interactive Content (Blurred on mobile when warning popup is active) */}
      <div
        className="assignment-content"
        style={{
          filter: showMobileWarningPopup ? "blur(8px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: showMobileWarningPopup ? "none" : "auto",
        }}
      >
        {/* Graph - viewport height so less scrolling */}
        <div className="relative z-10 mx-auto mt-4 max-w-7xl px-4 pb-8 sm:px-6">
          <div
            className="roadmap-graph-shell relative rounded-3xl border border-[var(--border)] bg-[var(--surface)]/30 backdrop-blur-md overflow-hidden"
            style={{
              height: activePhaseId === "phase-3" && !activeModuleId
                ? (isMobile ? "72vh" : "calc(100vh - 280px)")
                : (isMobile
                  ? `min(72vh, ${graphHeight}px)`
                  : `min(calc(100vh - 280px), ${Math.max(graphHeight, 420)}px)`),
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.12), transparent 70%)",
              }}
            />
            <div style={{ height: graphHeight, width: "100%" }}>
              {isFetchingSubmodules ? (
                userProfile && (userProfile.role?.toLowerCase() === "student" || userProfile.role?.toLowerCase() === "validator") && (!userProfile.isStudentVerified || !!userProfile.studentRejectionNote || !isPaymentVerified) ? (
                  <div className="flex h-full items-center justify-center bg-[var(--surface)]/10 backdrop-blur-sm p-6">
                    <div className="max-w-md w-full shadow-lg rounded-2xl">
                      {!isPaymentVerified ? (
                        (!userProfile.transactionId || !userProfile.transactionId.trim()) && !hasSubmittedPayment ? (
                          <div className="flex items-start gap-3.5 rounded-2xl border p-5 text-xs font-semibold backdrop-blur-md shadow-lg" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                            <div>
                              <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Payment Pending</p>
                              <p className="mt-1.5 leading-relaxed" style={{ color: '#e31e24' }}>Please complete your payment first to access the curriculum. Once paid, ensure your Transaction ID is updated in your profile settings.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3.5 rounded-2xl border p-5 text-xs font-semibold backdrop-blur-md shadow-lg" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
                            <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                            <div>
                              <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Payment Verification Pending</p>
                              <p className="mt-1.5 leading-relaxed" style={{ color: '#e31e24' }}>Please wait some time. Once admin payment verification is complete, your curriculum will be unlocked.</p>
                            </div>
                          </div>
                        )
                      ) : (!userProfile.isStudentVerified || userProfile.studentRejectionNote) ? (
                        <div className="flex items-start gap-3.5 rounded-2xl border p-5 text-xs font-semibold backdrop-blur-md shadow-lg" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
                          {userProfile.studentRejectionNote ? (
                            <>
                              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                              <div>
                                <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Student Verification Rejected</p>
                                <p className="mt-1.5 leading-relaxed" style={{ color: '#e31e24' }}>
                                  Your verification request was rejected. Reason: <span className="font-extrabold">{userProfile.studentRejectionNote}</span>. Please update your profile and re-upload your ID card.
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#e31e24' }} />
                              <div>
                                <p className="font-bold text-sm" style={{ color: '#e31e24' }}>Student Verification Pending</p>
                                <p className="mt-1.5 leading-relaxed" style={{ color: '#e31e24' }}>Please wait some time. Once admin student verification is complete, your curriculum will be unlocked.</p>
                              </div>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--surface)]/10 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
                      <p className="text-sm font-semibold text-[var(--text-muted)] animate-pulse">
                        Loading module content…
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  nodesDraggable={false}
                  panOnDrag={true}
                  panOnScroll={true}
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  zoomOnDoubleClick={false}
                  preventScrolling={false}
                  fitView={false}
                  proOptions={{ hideAttribution: true }}
                  minZoom={isMobile ? 0.5 : 0.25}
                  maxZoom={1.4}
                  defaultViewport={{ x: isMobile ? 8 : 40, y: 20, zoom: isMobile ? 0.85 : 0.95 }}
                >
                  <Background
                    color={isLight ? "#d1d5db" : "#1f2937"}
                    gap={28}
                    variant={BackgroundVariant.Dots}
                  />
                  <Controls
                    className="!bg-white/70 !border-black/10 dark:!bg-[#111] !shadow-lg"
                    showInteractive={false}
                  />


                  <CameraController targetNodeIds={targetFitIds} />
                </ReactFlow>
              )}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {activeModule && activeSubmodule && (
            <>
              <motion.aside
                key="detail"
                initial={{ opacity: 0, x: 30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 30, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="fixed right-4 top-[6.5rem] z-[60] hidden h-[calc(100vh-8.5rem)] w-[390px] rounded-3xl border border-[var(--border)] bg-[var(--surface)]/75 backdrop-blur-md shadow-2xl sm:block"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {activeModule?.index || 1}.{activeSubIndex + 1}
                      </p>
                      <h3 className="mt-1 truncate text-lg font-black text-[var(--text)]">
                        {getCardSubmoduleTitle(activeSubmodule.title)}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={backToModule}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-bold text-[var(--text-muted)] transition hover:border-mst-red/40 hover:text-mst-red"
                    >
                      Back
                    </button>
                  </div>

                  <div className="flex-1 overflow-auto px-5 py-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <ProgressRing value={subProgressPct} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[var(--text)]">
                          {subProgressPct === 100 ? "Completed" : "Progress"}
                        </p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          Completion unlocks the next lesson once assessments are passed.
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/60 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                              Lessons
                            </p>
                            <p className="mt-1 text-sm font-black text-[var(--text)]">
                              {activeSubProgress?.lessonComplete ? "Done" : "Pending"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/60 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                              Assessment
                            </p>
                            <p className="mt-1 text-sm font-black text-[var(--text)]">
                              {activeSubProgress?.assessmentComplete
                                ? "Passed"
                                : (activeSubmodule?.hasAssessment === false ? "Not Required" : "Not yet")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm font-bold text-[var(--text)]">Description</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {activeSubmodule.subtitle?.trim()
                          ? activeSubmodule.subtitle
                          : "Focus lesson for this module. Open to see structured sections and complete the assessment."}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-black text-[var(--text)]">
                            ~30–45 mins
                          </p>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                            Pass Rule
                          </p>
                          <p className="mt-1 text-sm font-black text-[var(--text)]">
                            {PASS_THRESHOLD}%+
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-bold text-[var(--text)]">Resources</p>
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Lesson
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-mst-red" />
                            Open content
                          </p>
                        </div>
                        {activeSubmodule.hasAssessment && (
                          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              Assessment
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[var(--text)] flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-mst-red" />
                              Test & unlock
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] px-5 py-4">
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/module/${activeModule.id}/${activeSubmodule.slug}`}
                        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${subLocked
                          ? "cursor-not-allowed bg-[var(--bg-muted)] text-[var(--text-muted)]"
                          : "bg-gradient-to-r from-mst-red to-red-600 text-white shadow-lg shadow-mst-red/20 hover:brightness-110"
                          }`}
                        aria-disabled={subLocked}
                        onClick={(e) => {
                          if (subLocked) e.preventDefault();
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                        {subLocked ? "Locked" : "Open Lesson"}
                      </Link>
                      {/* {detailCta?.hasAssessment && (
                        <Link
                          href={`/module/${activeModule.id}/${activeSubmodule.slug}/assessment`}
                          className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${subLocked
                            ? "cursor-not-allowed border-[var(--border)] text-[var(--text-muted)]"
                            : "border-mst-red/30 text-mst-red hover:bg-mst-red/10"
                            }`}
                          aria-disabled={subLocked}
                          onClick={(e) => {
                            if (subLocked) e.preventDefault();
                          }}
                        >
                          <Zap className="h-4 w-4" />
                          Start Assessment
                        </Link>
                      )} */}
                    </div>
                  </div>
                </div>
              </motion.aside>
              <motion.aside
                key="detail-mobile"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="fixed inset-x-4 bottom-4 z-[60] sm:hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md shadow-2xl"
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {activeModule?.index || 1}.{activeSubIndex + 1}
                      </p>
                      <h3 className="mt-1 truncate text-base font-black text-[var(--text)]">
                        {getCardSubmoduleTitle(activeSubmodule.title)}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={backToModule}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[11px] font-bold text-[var(--text-muted)] transition hover:border-mst-red/40 hover:text-mst-red"
                    >
                      Back
                    </button>
                  </div>

                  <div className="max-h-[52vh] overflow-auto px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <ProgressRing value={subProgressPct} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text)]">Description</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                          {activeSubmodule.subtitle?.trim()
                            ? activeSubmodule.subtitle
                            : "Focus lesson for this module. Complete it to unlock the next node."}
                        </p>
                        <p className="mt-2 text-xs font-bold text-[var(--text-muted)]">
                          Duration: ~30–45 mins · Pass rule: {PASS_THRESHOLD}%+
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] px-4 py-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Link
                        href={`/module/${activeModule.id}/${activeSubmodule.slug}`}
                        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${subLocked
                          ? "cursor-not-allowed bg-[var(--bg-muted)] text-[var(--text-muted)]"
                          : "bg-gradient-to-r from-mst-red to-red-600 text-white shadow-lg shadow-mst-red/20 hover:brightness-110"
                          }`}
                        aria-disabled={subLocked}
                        onClick={(e) => {
                          if (subLocked) e.preventDefault();
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                        {subLocked ? "Locked" : "Open"}
                      </Link>
                      {activeSubmodule.hasAssessment && (
                        <Link
                          href={`/module/${activeModule.id}/${activeSubmodule.slug}/assessment`}
                          className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${subLocked
                            ? "cursor-not-allowed border-[var(--border)] text-[var(--text-muted)]"
                            : "border-mst-red/30 text-mst-red hover:bg-mst-red/10"
                            }`}
                          aria-disabled={subLocked}
                          onClick={(e) => {
                            if (subLocked) e.preventDefault();
                          }}
                        >
                          <Zap className="h-4 w-4" />
                          Test
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Warning Popup Modal */}
      <AnimatePresence>
        {showMobileWarningPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-2xl backdrop-blur-md text-center"
            >
              <div className="flex flex-col items-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mst-red/10 border border-mst-red/20 mb-6 animate-pulse">
                  <Monitor className="h-8 w-8 text-mst-red" />
                </div>
                <h3 className="text-lg font-black text-[var(--text)]">
                  Desktop Only Feature
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
                  The Interactive Learning Tree features and lesson workspaces are optimized for larger displays. Please open this page on a desktop computer to continue.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMobileWarningPopup(false)}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

