import curriculumData from "@/data/curriculum.json";
import type { Assessment, Curriculum, ModuleMeta, SubmoduleMeta } from "./types";

const curriculum = curriculumData as Curriculum;

// Client-side cache for dynamically fetched submodule metadata
const submoduleCache = new Map<string, SubmoduleMeta>();

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
  return curriculum.modules.find((m) => String(m.id) === String(moduleId));
}

export function getSubmodule(
  moduleId: number | string,
  subSlug: string
): SubmoduleMeta | undefined {
  const cached = submoduleCache.get(`${String(moduleId)}-${subSlug}`);
  if (cached) return cached;

  const mod = getModule(moduleId);
  return mod?.submodules.find((s) => s.slug === subSlug);
}

export function getAllModules(): ModuleMeta[] {
  return curriculum.modules;
}
