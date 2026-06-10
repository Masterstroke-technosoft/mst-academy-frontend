"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoadmapPhaseId = string | null;

export type RoadmapUIState = {
  activePhaseId: RoadmapPhaseId;
  activeModuleId: string | number | null;
  activeSubmoduleSlug: string | null;

  setPhase: (phaseId: string) => void;
  setModule: (moduleId: string | number) => void;
  setSubmodule: (slug: string) => void;

  backToPhase: () => void;
  backToModule: () => void;
  resetAll: () => void;
};

export const useRoadmapStore = create<RoadmapUIState>()(
  persist(
    (set) => ({
      activePhaseId: null,
      activeModuleId: null,
      activeSubmoduleSlug: null,

      setPhase: (phaseId) =>
        set({
          activePhaseId: phaseId,
          activeModuleId: null,
          activeSubmoduleSlug: null,
        }),

      setModule: (moduleId) =>
        set({
          activeModuleId: moduleId,
          activeSubmoduleSlug: null,
        }),

      setSubmodule: (slug) => set({ activeSubmoduleSlug: slug }),

      backToPhase: () =>
        set((s) => ({
          activePhaseId: s.activePhaseId,
          activeModuleId: null,
          activeSubmoduleSlug: null,
        })),

      backToModule: () => set({ activeSubmoduleSlug: null }),

      resetAll: () =>
        set({
          activePhaseId: null,
          activeModuleId: null,
          activeSubmoduleSlug: null,
        }),
    }),
    {
      name: "mst-academy-roadmap-ui",
      partialize: (s) => ({
        activePhaseId: s.activePhaseId,
        activeModuleId: s.activeModuleId,
        activeSubmoduleSlug: s.activeSubmoduleSlug,
      }),
    }
  )
);

