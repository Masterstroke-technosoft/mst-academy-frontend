"use client";

const COINS_KEY = "mst-academy-coins";

export interface CoinState {
  balance: number;
  streak: number;
  lastClaimDate: string | null;
  lastActiveDate: string | null;
}

const DEFAULT: CoinState = {
  balance: 0,
  streak: 0,
  lastClaimDate: null,
  lastActiveDate: null,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getCoinState(): CoinState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(COINS_KEY);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as CoinState) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function save(state: CoinState) {
  localStorage.setItem(COINS_KEY, JSON.stringify(state));
}

export function addCoins(amount: number) {
  const s = getCoinState();
  s.balance += amount;
  save(s);
  return s;
}

/** Base daily reward + streak bonus */
export function dailyRewardForStreak(streak: number): number {
  // Increased base reward and streak multiplier as an enhancement
  return 20 + Math.min(streak, 30) * 3;
}

export function canClaimDaily(): boolean {
  const s = getCoinState();
  return s.lastClaimDate !== todayKey();
}

export function claimDailyCoins():
  | { ok: true; earned: number; streak: number; balance: number }
  | { ok: false; error: string } {
  const s = getCoinState();
  const today = todayKey();

  if (s.lastClaimDate === today) {
    return { ok: false, error: "You already claimed today's coins." };
  }

  let streak = 1;
  if (s.lastClaimDate === yesterdayKey()) {
    streak = s.streak + 1;
  } else if (s.lastClaimDate) {
    streak = 1;
  } else if (s.streak > 0) {
    streak = 1;
  }

  const earned = dailyRewardForStreak(streak);
  const next: CoinState = {
    balance: s.balance + earned,
    streak,
    lastClaimDate: today,
    lastActiveDate: today,
  };
  save(next);

  return { ok: true, earned, streak, balance: next.balance };
}

export function touchStreakOnActivity() {
  const s = getCoinState();
  const today = todayKey();
  if (s.lastActiveDate === today) return s;

  let streak = s.streak;
  if (!s.lastActiveDate) {
    streak = Math.max(streak, 1);
  } else if (s.lastActiveDate === yesterdayKey()) {
    streak = Math.max(streak, 1);
  } else if (s.lastActiveDate !== today) {
    // gap without claim — streak display resets on next claim only
  }

  const next = { ...s, lastActiveDate: today };
  save(next);
  return next;
}
