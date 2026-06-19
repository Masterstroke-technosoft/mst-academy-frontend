import curriculumData from "@/data/curriculum.json";
import type { Assessment, Curriculum, ModuleMeta, SubmoduleMeta } from "./types";

const curriculum = curriculumData as Curriculum;

export function getCurriculum(): Curriculum {
  return curriculum;
}

export function getPhases() {
  return curriculum.phases;
}

export function getModule(moduleId: number): ModuleMeta | undefined {
  return curriculum.modules.find((m) => m.id === moduleId);
}

export function getSubmodule(
  moduleId: number,
  subSlug: string
): SubmoduleMeta | undefined {
  const mod = getModule(moduleId);
  return mod?.submodules.find((s) => s.slug === subSlug);
}

export function getAllModules(): ModuleMeta[] {
  return curriculum.modules;
}
