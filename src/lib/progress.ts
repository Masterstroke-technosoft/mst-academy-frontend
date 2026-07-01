"use client";

import { isAdminUser } from "./auth";
import { getSubmodule } from "./curriculum";

export type ModuleStatus = "locked" | "active" | "completed";

function adminBypass(): boolean {
  return true;
}

export interface SubmoduleProgress {
  lessonComplete: boolean;
  assessmentComplete: boolean;
  score?: number;
  maxScore?: number;
  passed?: boolean;
  completedAt?: string;
}

const PREFIX = "mst-academy-";

function key(path: string) {
  return `${PREFIX}${path}`;
}

export function getSubmoduleProgress(
  moduleId: string | number,
  slug: string
): SubmoduleProgress {
  if (typeof window === "undefined") {
    return { lessonComplete: false, assessmentComplete: false };
  }
  try {
    const raw = localStorage.getItem(key(`sub-${moduleId}-${slug}`));
    if (!raw) return { lessonComplete: false, assessmentComplete: false };
    return JSON.parse(raw) as SubmoduleProgress;
  } catch {
    return { lessonComplete: false, assessmentComplete: false };
  }
}

export function saveSubmoduleProgress(
  moduleId: string | number,
  slug: string,
  data: Partial<SubmoduleProgress>
) {
  const current = getSubmoduleProgress(moduleId, slug);
  localStorage.setItem(
    key(`sub-${moduleId}-${slug}`),
    JSON.stringify({ ...current, ...data })
  );
}

export function markLessonComplete(moduleId: string | number, slug: string) {
  saveSubmoduleProgress(moduleId, slug, {
    lessonComplete: true,
    completedAt: new Date().toISOString(),
  });
}

export function markAssessmentComplete(
  moduleId: string | number,
  slug: string,
  score: number,
  maxScore: number,
  passed: boolean
) {
  saveSubmoduleProgress(moduleId, slug, {
    assessmentComplete: true,
    lessonComplete: true,
    score,
    maxScore,
    passed,
    completedAt: new Date().toISOString(),
  });
}

export function getActivePhaseId(): string {
  if (typeof window === "undefined") return "phase-1";
  return localStorage.getItem(key("active-phase")) || "phase-1";
}

export function setActivePhaseId(phaseId: string) {
  localStorage.setItem(key("active-phase"), phaseId);
}

export function isModuleFullyComplete(
  moduleId: string | number,
  submoduleSlugs: string[]
): boolean {
  if (!submoduleSlugs.length) return false;
  return submoduleSlugs.every((slug) => {
    const p = getSubmoduleProgress(moduleId, slug);
    const sub = getSubmodule(moduleId, slug);
    const hasAssessment = sub?.hasAssessment ?? false;
    if (hasAssessment) {
      return p.lessonComplete && p.assessmentComplete;
    }
    return p.lessonComplete;
  });
}

export function getGlobalActiveModuleId(
  allModuleIds: any[],
  getSlugs: (id: any) => string[]
): any {
  const sorted = [...allModuleIds].sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return 0; // Keep original index order for ObjectIDs
  });
  for (const id of sorted) {
    if (!isModuleFullyComplete(id, getSlugs(id))) return id;
  }
  return sorted[sorted.length - 1] ?? 1;
}

export function getModuleStatus(
  moduleId: any,
  allModuleIds: any[],
  submoduleSlugs: string[],
  getSlugs: (id: any) => string[]
): ModuleStatus {
  if (adminBypass()) {
    if (isModuleCompletePlaceholder(moduleId, submoduleSlugs)) return "completed";
    return "active";
  }
  const activeId = getGlobalActiveModuleId(allModuleIds, getSlugs);
  if (isModuleFullyComplete(moduleId, submoduleSlugs)) return "completed";
  if (String(moduleId) === String(activeId)) return "active";

  const idxModule = allModuleIds.findIndex(id => String(id) === String(moduleId));
  const idxActive = allModuleIds.findIndex(id => String(id) === String(activeId));
  if (idxModule !== -1 && idxActive !== -1 && idxModule < idxActive) return "completed";

  if (typeof moduleId === "number" && typeof activeId === "number") {
    if (moduleId < activeId) return "completed";
  }
  return "locked";
}

// helper check for completed
function isModuleCompletePlaceholder(moduleId: any, slugs: string[]) {
  return isModuleFullyComplete(moduleId, slugs);
}

export function isSubmoduleLocked(
  moduleLocked: boolean,
  subIndex: number,
  moduleId: string | number,
  submodules: { slug: string }[]
): boolean {
  if (adminBypass()) return false;
  if (moduleLocked) return true;
  if (subIndex === 0) return false;
  const prevSlug = submodules[subIndex - 1].slug;
  const prevProgress = getSubmoduleProgress(moduleId, prevSlug);
  const prevSub = getSubmodule(moduleId, prevSlug);
  const prevHasAssessment = prevSub?.hasAssessment ?? false;
  if (prevHasAssessment) {
    return !prevProgress.assessmentComplete;
  }
  return !prevProgress.lessonComplete;
}

export function getModuleProgressPercent(
  moduleId: string | number,
  submoduleSlugs: string[]
): number {
  if (!submoduleSlugs.length) return 0;
  let done = 0;
  for (const slug of submoduleSlugs) {
    const p = getSubmoduleProgress(moduleId, slug);
    const sub = getSubmodule(moduleId, slug);
    const hasAssessment = sub?.hasAssessment ?? false;
    if (hasAssessment) {
      if (p.lessonComplete) done += 0.5;
      if (p.assessmentComplete) done += 0.5;
    } else {
      if (p.lessonComplete) done += 1.0;
    }
  }
  return Math.round((done / submoduleSlugs.length) * 100);
}

export const PASS_THRESHOLD = 75;
