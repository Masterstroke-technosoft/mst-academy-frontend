import curriculumData from "@/data/curriculum.json";
import type { Assessment, Curriculum, ModuleMeta, SubmoduleMeta } from "./types";

const curriculum = curriculumData as Curriculum;

// Client-side cache for dynamically fetched submodule metadata
const submoduleCache = new Map<string, SubmoduleMeta>();
const moduleIdMap = new Map<string, number>();

export function registerModuleIdMapping(dbId: string, index: number) {
  moduleIdMap.set(String(dbId), index);
}

export function registerSubmoduleMetadata(moduleId: number | string, submodule: SubmoduleMeta) {
  submoduleCache.set(`${String(moduleId)}-${submodule.slug}`, submodule);
}

export function getCurriculum(): Curriculum {
  return curriculum;
}

export function getPhases() {
  return curriculum.phases;
}

export function getModule(moduleId: number | string): ModuleMeta | undefined {
  const mappedIndex = moduleIdMap.get(String(moduleId));
  const lookupId = mappedIndex !== undefined ? mappedIndex : moduleId;
  return curriculum.modules.find((m) => String(m.id) === String(lookupId));
}

export function getSubmodule(
  moduleId: number | string,
  subSlug: string
): SubmoduleMeta | undefined {
  const cached = submoduleCache.get(`${String(moduleId)}-${subSlug}`);
  if (cached) return cached;

  const mod = getModule(moduleId);
  if (mod) {
    const sub = mod.submodules.find((s) => s.slug === subSlug);
    if (sub) return sub;
  }

  // Fallback: search all modules for this submodule slug
  for (const m of curriculum.modules) {
    const sub = m.submodules.find((s) => s.slug === subSlug);
    if (sub) return sub;
  }

  return undefined;
}

export function getAllModules(): ModuleMeta[] {
  return curriculum.modules;
}
