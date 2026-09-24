import type { Metadata } from "next";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export const metadata: Metadata = {
  title: "Leaderboard | Masterstroke Academy",
  description:
    "See top performers in the Masterstroke Academy - progress, streaks, and $MSTC coin rewards.",
  alternates: { canonical: "/leaderboard" },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Leaderboard | Masterstroke Academy",
    description:
      "See top performers in the Masterstroke Academy - progress, streaks, and $MSTC coin rewards.",
    url: "https://masterstroke.academy/leaderboard",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
