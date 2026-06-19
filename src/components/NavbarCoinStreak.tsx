"use client";

import { useCallback, useEffect, useState } from "react";
import { Coins, Flame } from "lucide-react";
import {
  canClaimDaily,
  claimDailyCoins,
  getCoinState,
  dailyRewardForStreak,
} from "@/lib/coins";

export function NavbarCoinStreak() {
  const [balance, setBalance] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [burst, setBurst] = useState(false);
  const [floatAmount, setFloatAmount] = useState<number | null>(null);

  const refresh = useCallback(() => {
    const s = getCoinState();
    setBalance(s.balance);
    setStreak(s.streak);
    setCanClaim(canClaimDaily());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleClaim() {
    if (!canClaim || claiming) return;
    setClaiming(true);
    const result = claimDailyCoins();
    setClaiming(false);

    if (result.ok) {
      setBurst(true);
      setFloatAmount(result.earned);
      setBalance(result.balance);
      setStreak(result.streak);
      setCanClaim(false);
      setTimeout(() => setBurst(false), 800);
      setTimeout(() => setFloatAmount(null), 1200);
    }
  }

  const nextReward = dailyRewardForStreak(streak + (canClaim ? 1 : 0));

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Streak */}
      <div
        className="hidden items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2 py-1.5 sm:flex"
        title="Day streak"
      >
        <Flame
          className={`h-4 w-4 text-orange-500 ${streak > 0 ? "animate-pulse" : ""}`}
        />
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
          {streak}
        </span>
      </div>

      {/* Coins */}
      {/* <button
        type="button"
        onClick={canClaim ? handleClaim : undefined}
        disabled={!canClaim || claiming}
        title={
          canClaim
            ? `Claim ${nextReward} $MSTC coins today`
            : `${balance} $MSTC coins · ${streak} day streak`
        }
        className={`relative flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-all ${canClaim
          ? "coin-claim-ready border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:scale-105"
          : "border-white/10 bg-white/5"
          } ${burst ? "coin-burst" : ""}`}
      >
        <Coins
          className={`h-4 w-4 text-amber-400 ${canClaim ? "animate-coin-wiggle" : ""}`}
        />
        <span className="text-xs font-bold text-amber-200 tabular-nums">
          {balance}
        </span>
        {canClaim && (
          <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          </span>
        )}
      </button> */}

      {floatAmount !== null && (
        <span className="coin-float-amount pointer-events-none absolute -top-6 right-0 text-xs font-black text-amber-400">
          +{floatAmount}
        </span>
      )}
    </div>
  );
}
