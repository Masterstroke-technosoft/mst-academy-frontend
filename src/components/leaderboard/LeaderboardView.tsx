"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type LeaderboardEntry } from "@/lib/leaderboard";

import { getSession } from "@/lib/auth";

interface BackendLeaderboardEntry {
  _id: string | null;
  name: string | null;
  score?: number;
  modulesDone?: number;
  totalModules?: number;
  streak?: number;
  coins?: number;
  rank?: number;
  currentStreak?: number;
  progressPercentage?: number;
  email?: string;
}

function mapBackendEntry(e: BackendLeaderboardEntry): LeaderboardEntry {
  const user = getSession();
  const isCurrentUser = user && (e._id === user.id || e._id === (user as any)._id || (e.email && e.email === user.email));
  const scoreVal = e.progressPercentage ?? e.score ?? 0;
  const totalMods = e.totalModules ?? 21;
  const modulesDoneVal = e.modulesDone ?? Math.round((scoreVal / 100) * totalMods);
  return {
    id: e._id ?? "",
    name: e.name ?? "Unknown",
    score: scoreVal,
    modulesDone: modulesDoneVal,
    totalModules: totalMods,
    streak: e.currentStreak ?? e.streak ?? 0,
    coins: e.coins ?? 0,
    rank: e.rank,
    isYou: !!isCurrentUser,
  };
}
import { MarketingHeroBackground } from "@/components/marketing/MarketingHeroBackground";
import { RevealSection } from "@/components/marketing/RevealSection";
import {
  ArrowRight,
  Flame,
  Medal,
  Trophy,
  BookOpen,
} from "lucide-react";

// Styles correspond to left, center, right positions (2nd, 1st, 3rd)
const PODIUM_STYLES = [
  {
    // left - 2nd place (silver)
    order: "order-1 sm:order-1",
    height: "h-24 sm:h-28",
    medal: "text-slate-400",
    bg: "from-slate-500/15 via-slate-500/5 to-transparent",
    border: "border border-slate-500/20 border-b-0",
    label: "2nd",
    rankBg: "bg-gradient-to-br from-slate-300 to-slate-500 shadow-slate-400/30",
    rankText: "2",
  },
  {
    // center - 1st place (gold)
    order: "order-2 sm:order-2",
    height: "h-32 sm:h-36",
    medal: "text-amber-500",
    bg: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border border-amber-500/30 border-b-0",
    label: "1st",
    rankBg: "bg-gradient-to-br from-amber-300 to-amber-500 shadow-amber-400/40",
    rankText: "1",
  },
  {
    // right - 3rd place (bronze)
    order: "order-3 sm:order-3",
    height: "h-20 sm:h-24",
    medal: "text-orange-500",
    bg: "from-orange-500/15 via-orange-500/5 to-transparent",
    border: "border border-orange-500/20 border-b-0",
    label: "3rd",
    rankBg: "bg-gradient-to-br from-orange-400 to-orange-700 shadow-orange-500/30",
    rankText: "3",
  },
];

function podiumOrder(entries: LeaderboardEntry[]) {
  const top = entries.slice(0, 3);
  if (top.length < 3) return top;
  return [top[1], top[0], top[2]];
}

export function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${baseUrl}/api/leaderboard`, {
      method: "GET",
      credentials: "include",
      headers
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Leaderboard request failed: ${r.status}`);
        return r.json();
      })
      .then((raw: BackendLeaderboardEntry[]) => {
        const valid = raw.filter((e) => e._id != null && e.name != null);
        const list: LeaderboardEntry[] = valid.map(mapBackendEntry);
        list.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.modulesDone !== a.modulesDone) return b.modulesDone - a.modulesDone;
          return (a.rank ?? 999) - (b.rank ?? 999);
        });
        setEntries(list);
      })
      .catch((err) => {
        console.error("Failed to load leaderboard:", err);
        setFetchError(true);
      })
      .finally(() => setMounted(true));
  }, []);

  const podium = podiumOrder(entries);

  return (
    <div className="bg-[var(--bg)] lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full">
        {!mounted ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[#e31e24]" />
          </div>
        ) : fetchError ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-base font-bold text-[var(--text)]">Could not load leaderboard</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Please check your connection and try again.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 h-full">

            {/* Left Side: Fixed Header & Podium */}
            <div className="lg:w-[400px] shrink-0 pt-8 sm:pt-12 lg:h-full lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="text-left">
                <span className="inline-block rounded-full bg-[#e31e24]/10 px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-[#e31e24]">
                  ACADEMY RANKINGS
                </span>
                <h1 className="mt-4 text-6xl font-black text-[#e31e24] tracking-tight">
                  Leaderboard
                </h1>
                <p className="mt-4 text-base font-medium text-[var(--text-muted)] max-w-sm leading-relaxed">
                  Top learners ranked by course progress, daily coin streaks, and module completion.
                </p>

                <div className="mt-8">
                  <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e31e24] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-[1.02] shadow-sm"
                  >
                    <BookOpen className="h-4 w-4" />
                    Climb the leaderboard - start learning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Podium */}
              <div className="mt-12 pb-12 lg:pb-0">
                <div className="mx-auto grid grid-cols-3 items-end gap-3 px-2 sm:px-0">
                  {podium.map((entry, i) => {
                    const style = PODIUM_STYLES[i];
                    if (!entry || !style) return null;
                    return (
                      <div key={entry.id} className={`flex flex-col items-center ${style.order}`}>
                        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] text-2xl font-black text-white shadow-lg border border-white/20 ${style.rankBg}`}>
                          {style.rankText}
                        </div>
                        <p className="text-xs font-bold text-[var(--text)] truncate max-w-full px-1 text-center">
                          {entry.name}
                        </p>
                        <p className="mt-1 text-lg font-black text-[#e31e24]">
                          {entry.score}%
                        </p>
                        <div className={`mt-3 flex w-full flex-col items-center justify-end rounded-t-3xl bg-gradient-to-b pb-5 ${style.bg} ${style.height} ${style.border || ""}`}>
                          <Medal className={`h-10 w-10 ${style.medal}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Clean List */}
            <div className="flex-1 min-w-0 pt-8 sm:pt-12 pb-24 lg:h-full lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
                  <Trophy className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">
                  Full rankings
                </h2>
              </div>

              <div className="space-y-4">
                {entries.map((row, idx) => (
                  <div
                    key={row.id}
                    className="group flex items-center justify-between gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--border-strong)]"
                  >
                    {/* Left: Rank Box & Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--bg)] text-base sm:text-lg font-black text-[var(--text-muted)] group-hover:border-[#e31e24]/30 group-hover:bg-[#e31e24]/5 group-hover:text-[#e31e24] transition-colors ${row.isYou ? "border-[#e31e24]/30 bg-[#e31e24]/5 text-[#e31e24]" : ""}`}>
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-[var(--text)] truncate">{row.name}</h3>
                          {row.isYou && (
                            <span className="rounded-full bg-[#e31e24]/10 px-2 py-0.5 text-[9px] font-bold text-[#e31e24] shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                          {row.modulesDone} / {row.totalModules} modules
                        </p>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="hidden sm:block sm:w-28 text-right">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">Progress</span>
                          <span className="text-xs font-black text-[var(--text)]">{row.score}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#e31e24] to-purple-500"
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Mobile progress text */}
                      <div className="sm:hidden text-right">
                        <span className="text-xs font-black text-[var(--text)]">{row.score}%</span>
                        <p className="text-[8px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">Progress</p>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-orange-500/10 dark:bg-orange-500/20 rounded-xl px-2.5 py-1.5 min-w-[3rem]">
                        <Flame className="h-4 w-4 text-orange-500 mb-0.5" />
                        <span className="text-[10px] sm:text-xs font-black text-[var(--text)]">{row.streak}d</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
