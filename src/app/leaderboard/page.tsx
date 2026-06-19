import type { Metadata } from "next";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See top performers in the Masterstroke Academy — progress, streaks, and $MSTC coin rewards.",
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
