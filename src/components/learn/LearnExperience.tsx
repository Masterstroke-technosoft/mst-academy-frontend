"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Curriculum } from "@/lib/types";
import {
  getModuleStatus,
  getModuleProgressPercent,
  getSubmoduleProgress,
  isSubmoduleLocked,
  type ModuleStatus,
} from "@/lib/progress";
import {
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle2,
  BookOpen,
  ClipboardCheck,
  Zap,
  Trophy,
  PlayCircle,
} from "lucide-react";

const PHASE_META: Record<string, { icon: string; label: string; gradient: string; color: string; borderColor: string }> = {
  "phase-1": { icon: "🌐", label: "Foundation", gradient: "from-blue-500 to-cyan-500", color: "#3b82f6", borderColor: "border-blue-500/30" },
  "phase-2": { icon: "⚡", label: "Tooling", gradient: "from-purple-500 to-violet-500", color: "#a855f7", borderColor: "border-purple-500/30" },
  "phase-3": { icon: "🚀", label: "Build", gradient: "from-emerald-500 to-green-500", color: "#22c55e", borderColor: "border-emerald-500/30" },
  "phase-4": { icon: "🎯", label: "Launch", gradient: "from-red-500 to-orange-500", color: "#e31e24", borderColor: "border-red-500/30" },
};

const MODULE_EMOJIS: Record<number, string> = {
  1: "🌐", 2: "🔗", 3: "🔒", 4: "💰", 5: "⚡", 6: "🛠️", 7: "📜", 8: "🚀",
  9: "🏦", 10: "🎨", 11: "🏛️", 12: "🌉", 13: "📊", 14: "🔐", 15: "🧪", 16: "💎",
  17: "📝", 18: "🎤", 19: "💼", 20: "🎓", 21: "🏆",
};

function StatusIcon({ status }: { status: ModuleStatus }) {
  if (status === "completed") return <CheckCircle2 size={18} className="text-green-500" />;
  if (status === "active") return <Zap size={18} className="text-amber-500" />;
  return <Lock size={16} className="text-[var(--text-muted)]/50" />;
}

function StatusBadge({ status }: { status: ModuleStatus }) {
  if (status === "completed") return <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-600">✅ Complete</span>;
  if (status === "active") return <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">🔥 In Progress</span>;
  return <span className="rounded-full bg-gray-500/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">🔒 Locked</span>;
}

export function LearnExperience({ curriculum }: { curriculum: Curriculum }) {
  const [mounted, setMounted] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const allModuleIds = curriculum.modules.map((m) => m.id);
  const moduleSlugMap = Object.fromEntries(
    curriculum.modules.map((m) => [m.id, m.submodules.map((s) => s.slug)])
  ) as Record<number, string[]>;
  const getSlugs = (id: number) => moduleSlugMap[id] ?? [];

  useEffect(() => {
    setMounted(true);
    const firstActive = curriculum.phases.find((p) => {
      const mods = curriculum.modules.filter((m) => m.phaseId === p.id);
      return mods.some((mod) => {
        const slugs = mod.submodules.map((s) => s.slug);
        return getModuleStatus(mod.id, allModuleIds, slugs, getSlugs) === "active";
      });
    });
    if (firstActive) {
      setExpandedPhases(new Set([firstActive.id]));
      const activeMod = curriculum.modules.find((m) => {
        if (m.phaseId !== firstActive.id) return false;
        const slugs = m.submodules.map((s) => s.slug);
        return getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "active";
      });
      if (activeMod) setExpandedModules(new Set([activeMod.id]));
    } else {
      setExpandedPhases(new Set(["phase-1"]));
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
          <p className="text-sm font-medium text-[var(--text-muted)]">Loading learning path...</p>
        </div>
      </div>
    );
  }

  function togglePhase(phaseId: string) {
    // Avax-style UX: keep only ONE phase expanded at a time.
    setExpandedPhases(new Set([phaseId]));

    // Auto-expand the active module inside that phase (if any).
    const activeMod = curriculum.modules.find((m) => {
      if (m.phaseId !== phaseId) return false;
      const slugs = m.submodules.map((s) => s.slug);
      return (
        getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "active"
      );
    });
    setExpandedModules(activeMod ? new Set([activeMod.id]) : new Set());
  }

  function toggleModule(moduleId: number) {
    // Avax-style UX: keep only ONE module expanded at a time.
    setExpandedModules((prev) => {
      if (prev.has(moduleId)) return new Set();
      return new Set([moduleId]);
    });
  }

  const totalModules = curriculum.modules.length;
  const completedModules = curriculum.modules.filter((m) => {
    const slugs = m.submodules.map((s) => s.slug);
    return getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "completed";
  }).length;
  const overallPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg)]">
      {/* Hero header */}
      <div className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--bg)] to-[var(--bg-muted)]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-black text-[var(--text)] sm:text-3xl">
            🎓 Learning Path
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)] max-w-xl">
            Master blockchain development from fundamentals to funded founder. Click any phase to explore its modules, then expand modules to see individual lessons.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>{completedModules}/{totalModules} modules</span>
                <span className="font-bold text-mst-red">{overallPct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border)]">
                <div className="h-full rounded-full bg-gradient-to-r from-mst-red via-orange-500 to-yellow-500 transition-all duration-700" style={{ width: `${overallPct}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1"><BookOpen size={12} /> {curriculum.phases.length} Phases</span>
              <span className="flex items-center gap-1"><Trophy size={12} /> {completedModules} Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase tree */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-4">
        {curriculum.phases.map((phase, phaseIdx) => {
          const meta = PHASE_META[phase.id] || PHASE_META["phase-1"];
          const phaseMods = curriculum.modules.filter((m) => m.phaseId === phase.id);
          const isExpanded = expandedPhases.has(phase.id);
          const phaseCompleted = phaseMods.filter((m) => {
            const slugs = m.submodules.map((s) => s.slug);
            return getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "completed";
          }).length;
          const phaseTotal = phaseMods.length;
          const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;
          const hasActive = phaseMods.some((m) => {
            const slugs = m.submodules.map((s) => s.slug);
            return getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "active";
          });

          return (
            <div key={phase.id} className="group">
              {/* Phase header */}
              <button
                type="button"
                onClick={() => togglePhase(phase.id)}
                className={`relative w-full overflow-hidden rounded-2xl border-2 p-[1px] transition-all duration-300 ${isExpanded ? meta.borderColor + " shadow-lg" : "border-[var(--border)] hover:border-[var(--text-muted)]/30 hover:shadow-md"
                  }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.gradient} transition-opacity duration-300 ${isExpanded ? "opacity-10" : "opacity-5 group-hover:opacity-8"}`} />
                <div className="relative flex items-center gap-4 rounded-[14px] bg-[var(--surface)] px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl sm:h-14 sm:w-14 sm:text-3xl" style={{ background: meta.color + "15" }}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                        Phase {phaseIdx + 1}
                      </span>
                      {phasePct === 100 && <span className="text-[10px] text-green-500 font-bold">✅ Complete</span>}
                      {hasActive && phasePct < 100 && <span className="text-[10px] text-amber-500 font-bold">🔥 Active</span>}
                    </div>
                    <h2 className="mt-0.5 text-sm font-extrabold text-[var(--text)] sm:text-base truncate">
                      {phase.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-[var(--text-muted)]">{phaseCompleted}/{phaseTotal} modules</span>
                      <div className="flex-1 max-w-[120px] h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                        <div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-500`} style={{ width: `${phasePct}%` }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: meta.color }}>{phasePct}%</span>
                    </div>
                  </div>
                  <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                    <ChevronDown size={20} className="text-[var(--text-muted)]" />
                  </div>
                </div>
              </button>

              {/* Modules list */}
              {isExpanded && (
                <div className="mt-2 space-y-2 pl-4 sm:pl-8 border-l-2 ml-6 sm:ml-7" style={{ borderColor: meta.color + "30" }}>
                  {phaseMods.map((mod, modIdx) => {
                    const slugs = mod.submodules.map((s) => s.slug);
                    const status = getModuleStatus(mod.id, allModuleIds, slugs, getSlugs);
                    const progress = getModuleProgressPercent(mod.id, slugs);
                    const emoji = MODULE_EMOJIS[mod.id] || "📚";
                    const isModExpanded = expandedModules.has(mod.id);
                    const locked = status === "locked";

                    return (
                      <div key={mod.id} className="relative">
                        {/* Connector dot */}
                        <div className="absolute -left-[calc(1rem+5px)] sm:-left-[calc(2rem+5px)] top-5 h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: meta.color, background: status === "completed" ? meta.color : "var(--surface)" }} />

                        {/* Module card */}
                        <div className={`rounded-xl border transition-all duration-200 ${status === "active"
                          ? "border-mst-red/30 bg-[var(--surface)] shadow-md"
                          : status === "completed"
                            ? "border-green-500/20 bg-[var(--surface)]"
                            : "border-[var(--border)] bg-[var(--bg-muted)] opacity-75"
                          }`}>
                          <button
                            type="button"
                            onClick={() => toggleModule(mod.id)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left sm:px-5 sm:py-4"
                          >
                            <span className="text-xl sm:text-2xl">{emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-mst-red">
                                  Module {mod.id}
                                </span>
                                <StatusBadge status={status} />
                              </div>
                              <h3 className="mt-0.5 text-sm font-bold text-[var(--text)] truncate">
                                {mod.title}
                              </h3>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="text-[11px] text-[var(--text-muted)]">{mod.submodules.length} lessons</span>
                                <div className="flex-1 max-w-[80px] h-1 overflow-hidden rounded-full bg-[var(--border)]">
                                  <div className={`h-full rounded-full transition-all duration-500 ${status === "completed" ? "bg-green-500" : "bg-mst-red"}`} style={{ width: `${progress}%` }} />
                                </div>
                                <span className="text-[11px] font-semibold text-[var(--text-muted)]">{progress}%</span>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <StatusIcon status={status} />
                              <div className={`transition-transform duration-200 ${isModExpanded ? "rotate-90" : ""}`}>
                                <ChevronRight size={16} className="text-[var(--text-muted)]" />
                              </div>
                            </div>
                          </button>

                          {/* Submodules */}
                          {isModExpanded && (
                            <div className="border-t border-[var(--border)] px-4 py-3 sm:px-5 space-y-1.5">
                              {mod.submodules.map((sub, subIdx) => {
                                const subLocked = isSubmoduleLocked(locked, subIdx, mod.id, mod.submodules);
                                const sp = getSubmoduleProgress(mod.id, sub.slug);
                                const lessonDone = sp.lessonComplete;
                                const assessDone = sp.assessmentComplete;
                                const allDone = lessonDone && assessDone;

                                return (
                                  <div key={sub.slug} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${subLocked
                                    ? "opacity-50"
                                    : allDone
                                      ? "bg-green-500/5 hover:bg-green-500/10"
                                      : "hover:bg-[var(--bg-muted)]"
                                    }`}>
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${allDone ? "bg-green-500 text-white" : subLocked ? "bg-[var(--border)] text-[var(--text-muted)]" : "bg-mst-red/10 text-mst-red"
                                      }`}>
                                      {allDone ? <CheckCircle2 size={14} /> : subLocked ? <Lock size={12} /> : sub.id.split(".")[1]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs font-semibold truncate ${subLocked ? "text-[var(--text-muted)]" : "text-[var(--text)]"}`}>
                                        {sub.title.replace(/^Sub[-\s]?Module\s+\d+\.\d+\s*[–—-]?\s*/i, "").replace(/^\d+\.\d+\s*[–—-]?\s*/, "")}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {lessonDone && <span className="text-[9px] text-green-600 font-bold">📖 Read</span>}
                                        {assessDone && <span className="text-[9px] text-blue-600 font-bold">✅ Passed</span>}
                                        {!lessonDone && !subLocked && <span className="text-[9px] text-[var(--text-muted)]">Not started</span>}
                                        {subLocked && <span className="text-[9px] text-[var(--text-muted)]">Complete previous first</span>}
                                      </div>
                                    </div>
                                    {!subLocked && (
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <Link
                                          href={`/module/${mod.id}/${sub.slug}`}
                                          className="flex items-center gap-1 rounded-lg bg-mst-red/10 px-2.5 py-1.5 text-[10px] font-bold text-mst-red transition hover:bg-mst-red/20"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <PlayCircle size={11} />
                                          {lessonDone ? "Review" : "Start"}
                                        </Link>
                                        {sub.hasAssessment && (
                                          <Link
                                            href={`/module/${mod.id}/${sub.slug}/assessment`}
                                            className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-bold text-blue-600 transition hover:bg-blue-500/20"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <ClipboardCheck size={11} />
                                            Test
                                          </Link>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
