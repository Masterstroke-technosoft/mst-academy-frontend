"use client";

import type { Curriculum } from "./types";
import {
  getSubmoduleProgress,
  getModuleProgressPercent,
  isModuleFullyComplete,
  getModuleStatus,
  getGlobalActiveModuleId,
} from "./progress";
import { getLeaderboard } from "./leaderboard";
import { getSubmodule } from "./curriculum";

export type SkillKey =
  | "Blockchain"
  | "Smart Contracts"
  | "Tokenomics"
  | "Frontend"
  | "Backend"
  | "AI"
  | "Security";

const MODULE_SKILLS: Record<number, SkillKey[]> = {
  1: ["Blockchain", "Frontend"],
  2: ["Blockchain", "Security"],
  3: ["Security", "Blockchain"],
  4: ["Tokenomics", "Blockchain"],
  5: ["Blockchain", "Tokenomics"],
  6: ["Smart Contracts", "Backend"],
  7: ["Smart Contracts", "Security"],
  8: ["Smart Contracts", "Frontend"],
  9: ["Tokenomics", "Smart Contracts"],
  10: ["Frontend", "Smart Contracts"],
  11: ["Smart Contracts", "Tokenomics"],
  12: ["Backend", "Blockchain"],
  13: ["Tokenomics", "Smart Contracts"],
  14: ["Security", "Smart Contracts"],
  15: ["Security", "Smart Contracts"],
  16: ["Tokenomics", "Blockchain"],
  17: ["Smart Contracts", "Frontend"],
  18: ["Frontend", "Backend"],
  19: ["Backend", "Tokenomics"],
  20: ["AI", "Smart Contracts"],
  21: ["Blockchain", "Security"],
};

export interface StudentAnalytics {
  overallProgress: number;
  modulesCompleted: number;
  totalModules: number;
  averageScore: number;
  streakDays: number;
  totalStudyHours: number;
  weeklyStudyMinutes: number;
  focusScore: number;
  revisionConsistency: number;
  currentPhaseId: string;
  currentPhaseTitle: string;
  activeModuleId: number;
  activeModuleTitle: string;
  level: number;
  xp: number;
  xpToNext: number;
  percentile: number;
  rank: number;
  growthData: { week: string; score: number; progress: number }[];
  moduleScores: { name: string; score: number; moduleId: number }[];
  skillRadar: { skill: SkillKey; value: number }[];
  completionDonut: { name: string; value: number; color: string }[];
  activityHeatmap: { date: string; count: number }[];
  dailyStudy: { day: string; minutes: number }[];
  insights: string[];
  strengths: string[];
  weaknesses: string[];
  nextActions: { label: string; href: string; icon: string; priority: "high" | "medium" }[];
  achievements: { id: string; title: string; desc: string; unlocked: boolean; emoji: string }[];
  health: {
    burnoutRisk: number;
    focusScore: number;
    retentionScore: number;
    revisionHealth: number;
    learningSpeed: number;
    confidence: number;
  };
  phaseJourney: {
    phaseId: string;
    title: string;
    percent: number;
    status: "completed" | "active" | "locked";
  }[];
}

function xpForLevel(level: number) {
  return level * 120 + 80;
}

function getLoginDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const KEY = "mst-academy-logins";
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      // Seed with dates from June 1st, 2026 to today (June 7th, 2026)
      const seeded: string[] = [];
      const start = new Date(2026, 5, 1); // June 1, 2026
      const today = new Date();
      const current = new Date(start);
      while (current <= today) {
        seeded.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function recordLoginToday() {
  if (typeof window === "undefined") return;
  try {
    const KEY = "mst-academy-logins";
    const dates = getLoginDates();
    const today = new Date().toISOString().slice(0, 10);
    if (!dates.includes(today)) {
      dates.push(today);
      localStorage.setItem(KEY, JSON.stringify(dates));
    }
  } catch (e) {
    console.error(e);
  }
}

export function computeStudentAnalytics(curriculum: Curriculum): StudentAnalytics {
  recordLoginToday();
  const { phases, modules } = curriculum;
  const allModuleIds = modules.map((m) => m.id);
  const getSlugs = (id: number) =>
    modules.find((m) => m.id === id)?.submodules.map((s) => s.slug) ?? [];

  let modulesCompleted = 0;
  let scoreSum = 0;
  let scoredCount = 0;
  let totalSubmodules = 0;
  let completedSubmodules = 0;
  const activityByDate = new Map<string, number>();
  const loginDates = getLoginDates();
  for (const date of loginDates) {
    activityByDate.set(date, 1);
  }
  const skillScores: Record<SkillKey, { sum: number; count: number }> = {
    Blockchain: { sum: 0, count: 0 },
    "Smart Contracts": { sum: 0, count: 0 },
    Tokenomics: { sum: 0, count: 0 },
    Frontend: { sum: 0, count: 0 },
    Backend: { sum: 0, count: 0 },
    AI: { sum: 0, count: 0 },
    Security: { sum: 0, count: 0 },
  };

  for (const mod of modules) {
    const slugs = mod.submodules.map((s) => s.slug);
    if (isModuleFullyComplete(mod.id, slugs)) modulesCompleted++;

    for (const sub of mod.submodules) {
      totalSubmodules++;
      const p = getSubmoduleProgress(mod.id, sub.slug);
      const subInfo = getSubmodule(mod.id, sub.slug);
      const hasAssessment = subInfo?.hasAssessment ?? false;
      if (hasAssessment) {
        if (p.lessonComplete) completedSubmodules += 0.5;
        if (p.assessmentComplete) completedSubmodules += 0.5;
      } else {
        if (p.lessonComplete) completedSubmodules += 1.0;
      }

      if (p.completedAt) {
        const d = p.completedAt.slice(0, 10);
        activityByDate.set(d, (activityByDate.get(d) ?? 0) + 1);
      }

      if (p.score !== undefined && p.maxScore) {
        const pct = Math.round((p.score / p.maxScore) * 100);
        scoreSum += pct;
        scoredCount++;
        for (const skill of MODULE_SKILLS[mod.id] ?? ["Blockchain"]) {
          skillScores[skill].sum += pct;
          skillScores[skill].count += 1;
        }
      }
    }
  }

  const overallProgress =
    totalSubmodules > 0
      ? Math.round((completedSubmodules / totalSubmodules) * 100)
      : 0;

  const activeModuleId = getGlobalActiveModuleId(allModuleIds, getSlugs);
  const activeModule = modules.find((m) => m.id === activeModuleId);
  const currentPhaseId = activeModule?.phaseId ?? "phase-1";
  const currentPhase = phases.find((p) => p.id === currentPhaseId);

  const streakDays = 0;
  const xp = modulesCompleted * 50 + scoredCount * 8;
  let level = 1;
  let remain = xp;
  while (remain >= xpForLevel(level) && level < 50) {
    remain -= xpForLevel(level);
    level++;
  }
  const xpToNext = xpForLevel(level) - remain;

  const leaderboard = getLeaderboard();
  const youIdx = leaderboard.findIndex((e) => e.isYou);
  const rank = youIdx >= 0 ? youIdx + 1 : leaderboard.length + 1;
  const percentile =
    youIdx >= 0
      ? Math.round(((leaderboard.length - youIdx) / leaderboard.length) * 100)
      : 50;

  const growthData = Array.from({ length: 6 }, (_, i) => {
    const weekNum = i + 1;
    const factor = Math.min(1, (overallProgress / 100) * (weekNum / 6));
    return {
      week: `W${weekNum}`,
      score: Math.round((scoreSum / Math.max(scoredCount, 1)) * factor),
      progress: Math.round(overallProgress * factor),
    };
  });

  const moduleScores = modules
    .map((mod) => {
      let sum = 0;
      let n = 0;
      for (const sub of mod.submodules) {
        const p = getSubmoduleProgress(mod.id, sub.slug);
        if (p.score !== undefined && p.maxScore) {
          sum += Math.round((p.score / p.maxScore) * 100);
          n++;
        }
      }
      return {
        name: `M${mod.id}`,
        score: n > 0 ? Math.round(sum / n) : getModuleProgressPercent(mod.id, mod.submodules.map((s) => s.slug)),
        moduleId: mod.id,
      };
    })
    .filter((m) => m.score > 0)
    .slice(0, 12);

  const skillRadar = (Object.keys(skillScores) as SkillKey[]).map((skill) => ({
    skill,
    value:
      skillScores[skill].count > 0
        ? Math.round(skillScores[skill].sum / skillScores[skill].count)
        : Math.max(20, Math.round(overallProgress * 0.6)),
  }));

  const completionDonut = [
    { name: "Completed", value: modulesCompleted, color: "#22c55e" },
    {
      name: "In Progress",
      value: Math.max(0, modules.filter((m) => {
        const slugs = m.submodules.map((s) => s.slug);
        return getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "active";
      }).length),
      color: "#f97316",
    },
    {
      name: "Locked",
      value: Math.max(
        0,
        modules.length -
        modulesCompleted -
        modules.filter((m) => {
          const slugs = m.submodules.map((s) => s.slug);
          return getModuleStatus(m.id, allModuleIds, slugs, getSlugs) === "active";
        }).length
      ),
      color: "#64748b",
    },
  ];

  const activityHeatmap: { date: string; count: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    activityHeatmap.push({ date: key, count: activityByDate.get(key) ?? 0 });
  }

  const baseWeeklyMinutes = [120, 240, 180, 310, 220, 420, 500];
  const dailyStudy = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleString('en-US', { weekday: 'short' });
    const dayDate = d.getDate();

    let minutes = baseWeeklyMinutes[i];
    if (activityByDate.get(key) || 0 > 0) {
      minutes += 120;
    }

    return {
      day: `${dayName} ${dayDate}`,
      minutes,
      logins: activityByDate.get(key) ?? 0,
    };
  });

  const avgScore = scoredCount > 0 ? Math.round(scoreSum / scoredCount) : 0;
  const sortedSkills = [...skillRadar].sort((a, b) => b.value - a.value);
  const strengths = sortedSkills.slice(0, 2).map((s) => s.skill);
  const weaknesses = sortedSkills.slice(-2).filter((s) => s.value < 70).map((s) => s.skill);

  const insights: string[] = [];
  if (avgScore > 0) {
    insights.push(`Your average assessment score is ${avgScore}% - ${avgScore >= 75 ? "strong work" : "room to improve"}.`);
  }
  if (strengths[0]) {
    insights.push(`Your strongest area is ${strengths[0]} (${sortedSkills[0]?.value ?? 0}%).`);
  }
  if (weaknesses[0]) {
    insights.push(`Focus more on ${weaknesses[0]} modules to balance your skill profile.`);
  }
  if (streakDays >= 3) {
    insights.push(`You're on a ${streakDays}-day learning streak - keep the momentum!`);
  }
  insights.push("You study best in evening sessions - block 8-11 PM for deep focus.");

  const nextActions: StudentAnalytics["nextActions"] = [];
  if (activeModule) {
    const firstSub = activeModule.submodules[0];
    nextActions.push({
      label: `Continue Module ${activeModule.id}`,
      href: firstSub ? `/module/${activeModule.id}/${firstSub.slug}` : "/learn",
      icon: "play",
      priority: "high",
    });
  }
  nextActions.push({
    label: "Open Learning Roadmap",
    href: "/learn",
    icon: "map",
    priority: "high",
  });
  if (weaknesses[0]) {
    const weakMod = modules.find((m) => MODULE_SKILLS[m.id]?.includes(weaknesses[0] as SkillKey));
    if (weakMod) {
      const labelName = weaknesses[0] === "AI" ? "Blockchain" : weaknesses[0];
      nextActions.push({
        label: `Revise ${labelName}`,
        href: `/learn`,
        icon: "brain",
        priority: "medium",
      });
    }
  }
  nextActions.push({
    label: "View Leaderboard",
    href: "/leaderboard",
    icon: "trophy",
    priority: "medium",
  });

  const achievements: StudentAnalytics["achievements"] = [
    { id: "first", title: "First Steps", desc: "Complete your first lesson", unlocked: completedSubmodules >= 1, emoji: "🚀" },
    { id: "streak3", title: "On Fire", desc: "3-day learning streak", unlocked: streakDays >= 3, emoji: "🔥" },
    { id: "mod5", title: "Module Master", desc: "Complete 5 modules", unlocked: modulesCompleted >= 5, emoji: "📚" },
    { id: "score80", title: "High Scorer", desc: "Score 80%+ on an assessment", unlocked: avgScore >= 80, emoji: "⭐" },
    { id: "phase1", title: "Foundation Done", desc: "Complete Phase 1", unlocked: false, emoji: "🌐" },
    { id: "graduate", title: "Academy Graduate", desc: "Complete all 21 modules", unlocked: modulesCompleted >= 21, emoji: "🏆" },
  ];

  const phaseJourney = phases.map((ph, idx) => {
    const phaseModules = modules.filter((m) => m.phaseId === ph.id);
    let done = 0;
    for (const m of phaseModules) {
      const slugs = m.submodules.map((s) => s.slug);
      if (isModuleFullyComplete(m.id, slugs)) done++;
    }
    const percent =
      phaseModules.length > 0 ? Math.round((done / phaseModules.length) * 100) : 0;
    let status: "completed" | "active" | "locked" = "locked";
    if (percent >= 100) status = "completed";
    else if (ph.id === currentPhaseId || (idx > 0 && phases[idx - 1] && done > 0)) status = "active";
    else if (idx === 0) status = "active";
    return { phaseId: ph.id, title: ph.title, percent, status };
  });

  const totalStudyHours = Math.round((completedSubmodules * 12) / 60 * 10) / 10;
  const weeklyStudyMinutes = dailyStudy.reduce((a, b) => a + b.minutes, 0);
  const focusScore = Math.min(100, Math.round(50 + streakDays * 8 + overallProgress * 0.3));
  const revisionConsistency = Math.min(100, Math.round(activityByDate.size * 4 + streakDays * 6));

  return {
    overallProgress,
    modulesCompleted,
    totalModules: modules.length,
    averageScore: avgScore,
    streakDays,
    totalStudyHours,
    weeklyStudyMinutes,
    focusScore,
    revisionConsistency,
    currentPhaseId,
    currentPhaseTitle: currentPhase?.title ?? "Foundation",
    activeModuleId,
    activeModuleTitle: activeModule?.title ?? "Getting Started",
    level,
    xp,
    xpToNext,
    percentile,
    rank,
    growthData,
    moduleScores,
    skillRadar,
    completionDonut,
    activityHeatmap,
    dailyStudy,
    insights,
    strengths,
    weaknesses,
    nextActions,
    achievements,
    health: {
      burnoutRisk: Math.max(5, Math.min(95, 40 - streakDays * 3 + (weeklyStudyMinutes > 300 ? 20 : 0))),
      focusScore,
      retentionScore: Math.min(100, avgScore > 0 ? avgScore : overallProgress),
      revisionHealth: revisionConsistency,
      learningSpeed: Math.min(100, Math.round(overallProgress / Math.max(1, modulesCompleted + 1) * 10) * 5),
      confidence: Math.min(100, Math.round((avgScore + overallProgress) / 2)),
    },
    phaseJourney,
  };
}
