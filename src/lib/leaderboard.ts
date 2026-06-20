"use client";

import curriculumData from "@/data/curriculum.json";
import type { Curriculum } from "./types";
import { getSession } from "./auth";
import { getModuleProgressPercent } from "./progress";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  modulesDone: number;
  totalModules: number;
  streak: number;
  coins: number;
  isYou?: boolean;
  rank?: number;
}

const curriculum = curriculumData as Curriculum;

const SEED: Omit<LeaderboardEntry, "isYou">[] = [
  { id: "s1", name: "Aarav K.", score: 92, modulesDone: 18, totalModules: 21, streak: 14, coins: 420 },
  { id: "s2", name: "Diya S.", score: 88, modulesDone: 16, totalModules: 21, streak: 11, coins: 380 },
  { id: "s3", name: "Rohan P.", score: 85, modulesDone: 15, totalModules: 21, streak: 9, coins: 310 },
  { id: "s4", name: "Sara M.", score: 83, modulesDone: 14, totalModules: 21, streak: 8, coins: 290 },
  { id: "s5", name: "Kabir T.", score: 80, modulesDone: 13, totalModules: 21, streak: 7, coins: 260 },
  { id: "s6", name: "Neha R.", score: 78, modulesDone: 12, totalModules: 21, streak: 6, coins: 240 },
  { id: "s7", name: "Vikram D.", score: 75, modulesDone: 11, totalModules: 21, streak: 5, coins: 220 },
  { id: "s8", name: "Ananya G.", score: 72, modulesDone: 10, totalModules: 21, streak: 4, coins: 200 },
];

function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] ?? "Learner";
  return `${parts[0]} ${parts[1][0]}.`;
}

export function getCurrentUserEntry(): LeaderboardEntry | null {
  const user = getSession();
  if (!user) return null;

  const modules = curriculum.modules;
  let totalPct = 0;
  let done = 0;

  for (const mod of modules) {
    const slugs = mod.submodules.map((s) => s.slug);
    const pct = getModuleProgressPercent(mod.id, slugs);
    totalPct += pct;
    if (pct >= 100) done += 1;
  }

  const score = modules.length > 0 ? Math.round(totalPct / modules.length) : 0;

  const coins = 0;
  const streak = 0;

  return {
    id: user.id,
    name: shortName(user.fullName),
    score,
    modulesDone: done,
    totalModules: modules.length,
    streak,
    coins,
    isYou: true,
  };
}

export function getLeaderboard(limit = 50): LeaderboardEntry[] {
  const you = getCurrentUserEntry();
  const list: LeaderboardEntry[] = SEED.map((e) => ({ ...e }));

  if (you) {
    const withoutDup = list.filter((e) => e.name !== you.name);
    withoutDup.push(you);
    list.length = 0;
    list.push(...withoutDup);
  }

  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.modulesDone - a.modulesDone;
  });

  return list.slice(0, limit);
}

