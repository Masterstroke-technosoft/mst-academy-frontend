"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { Typewriter } from "@/components/marketing/Typewriter";
import { AnimatedCounter } from "@/components/marketing/AnimatedCounter";
import { useInView } from "@/components/marketing/useInView";
import { RevealSection } from "@/components/marketing/RevealSection";
import { MarketingHeroBackground } from "@/components/marketing/MarketingHeroBackground";
import type { Phase } from "@/lib/types";
import { PHASE_HOURS } from "@/lib/academy-overview";
import { type LeaderboardEntry } from "@/lib/leaderboard";

import { getSession } from "@/lib/auth";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import { convertINRtoUSD } from "@/lib/currency";

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
import {
  TreePine,
  Monitor,
  Code2,
  BarChart3,
  Link2,
  Award,
  ChevronRight,
  Blocks,
  Layers,
  Rocket,
  Zap,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Shield,
  Cpu,
  ChevronDown,
  Flame,
} from "lucide-react";

const features = [
  {
    icon: TreePine,
    title: "Interactive Learning Tree",
    description:
      "Navigate a visual learning tree that maps your entire journey from fundamentals to advanced topics.",
    gradient: "from-mst-red/20 to-red-500/10",
  },
  {
    icon: Monitor,
    title: "Full-screen Assessments",
    description:
      "Test your knowledge with immersive, lockdown-mode assessments designed to validate real understanding.",
    gradient: "from-mst-red/20 to-red-500/10",
  },
  {
    icon: Code2,
    title: "Live Code Execution",
    description:
      "Write and execute Solidity, JavaScript, and more directly in the browser with instant feedback.",
    gradient: "from-mst-red/20 to-red-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track completion across all 4 phases and 21 modules with detailed analytics on your progress.",
    gradient: "from-mst-red/20 to-red-500/10",
  },
  {
    icon: Link2,
    title: "Blockchain Focus",
    description:
      "Purpose-built for Web3. Every module is tailored to blockchain development, DeFi, NFTs, and DAOs.",
    gradient: "from-mst-red/20 to-red-500/10",
  },
  {
    icon: Award,
    title: "Certificate on Completion",
    description:
      "Earn a verifiable certificate upon completing the full curriculum, proving your blockchain expertise.",
    gradient: "from-mst-red/20 to-red-500/10",
  },
];

const PHASE_ICONS = [Blocks, Cpu, Layers, Rocket];
const PHASE_COLORS = [
  "var(--accent-blue)",
  "var(--mst-red)",
  "var(--accent-purple)",
  "var(--accent-green)",
];

const topics = [
  "Solidity",
  "DeFi",
  "NFTs",
  "DAOs",
  "Smart Contracts",
  "Cryptography",
  "Consensus",
  "EVM",
  "Hardhat",
  "ZK Proofs",
  "RWA",
  "MST Chain",
  "Token Standards",
  "Layer 2",
  "Web3.js",
  "Security Audits",
];

interface LandingPageProps {
  phases: Phase[];
  moduleCount: number;
  submoduleCount: number;
}

export function LandingPage({
  phases,
  moduleCount,
  submoduleCount,
}: LandingPageProps) {
  const statsRef = useInView(0.25);
  const [localPhases, setLocalPhases] = useState<any[]>(phases);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedPhaseDetails, setExpandedPhaseDetails] = useState<any>(null);
  const [isLoadingPhase, setIsLoadingPhase] = useState(false);
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const { rate: usdRate } = useCurrencyRate();

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
        setLeaderboardEntries(list);
      })
      .catch((err) => {
        console.error("Failed to load leaderboard:", err);
        setFetchError(true);
      })
      .finally(() => setIsLeaderboardLoading(false));
  }, []);

  useEffect(() => {
    const fetchCoursePhases = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const courseId = "6a2934912b48a13769669f8e";
        //const token = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTFkMzJmZWYwOWIxMzYzYTI3NGM1NzYiLCJlbWFpbCI6ImFkbWluNEBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3ODA1NTgxNzcsImV4cCI6MTc4MTE2Mjk3N30.k5ZoO1kSV-qGJ8NvpuloYQ9UaZMiMfoaZUFepb-0Neo";
        const response = await fetch(`${baseURL}/api/phases/course/${courseId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
            "Pragma": "no-cache",
            "Content-Type": "application/json",
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setLocalPhases(data.data.sort((a: any, b: any) => a.index - b.index));
          }
        }
      } catch (error) {
        console.error("Error fetching course phases:", error);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const courseId = "6a2934912b48a13769669f8e";
        const response = await fetch(`${baseURL}/api/courses/${courseId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
            "Pragma": "no-cache",
            "Content-Type": "application/json",
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCourseDetails(data.data);
          } else if (data) {
            setCourseDetails(data);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCoursePhases();
    fetchCourseDetails();
  }, []);

  const handlePhaseClick = async (index: number, phaseId: string) => {
    if (expandedPhase === index) {
      setExpandedPhase(null);
      setExpandedPhaseDetails(null);
      return;
    }
    setExpandedPhase(index);
    setExpandedPhaseDetails(null);
    setIsLoadingPhase(false);
  };

  return (
    <div className="overflow-hidden bg-[var(--bg)]">
      {/* Hero */}
      <section className="bg-grid relative flex flex-col overflow-hidden justify-center min-h-[calc(100vh-5rem)] py-8 sm:py-12">
        <MarketingHeroBackground tall />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 z-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
            {/* <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-gradient-to-r from-mst-red/15 via-[var(--surface)]/50 to-[var(--accent-purple)]/15 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-mst-red shadow-lg shadow-mst-red/10 backdrop-blur-md">
              <Sparkles className="h-4 w-4 animate-pulse-subtle" />
              Masterstroke Academy
            </p> */}

            <div className="mt-4 sm:mt-6 min-h-[110px] sm:min-h-[130px] flex flex-col justify-center">
              <h1 className="animate-slide-up font-black text-[var(--text)] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
                Master Blockchain
                <span className="block mt-1 sm:mt-2">
                  <Typewriter
                    strings={[
                      "From Zero to Production",
                      "Learn • Build • Deploy",
                      "Fundamentals to Capstone",
                      "130+ Hours of Web3",
                    ]}
                    speedMs={38}
                    pauseMs={950}
                    className="text-gradient-red animate-gradient"
                  />
                </span>
              </h1>
            </div>

            <p className="animate-slide-up stagger-2 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-xl sm:leading-relaxed">
              A structured, college-integrated programme - interactive lessons,
              live code, rigorous assessments, and a path from cryptography to
              funded founder.
            </p>

            <div className="animate-slide-up stagger-3 mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#fellowship"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-mst-red via-red-600 to-mst-red bg-[length:200%_100%] px-8 py-3.5 text-base sm:text-lg font-bold text-white shadow-xl shadow-mst-red/30 transition hover:shadow-2xl hover:shadow-mst-red/40 animate-gradient"
              >
                <span className="btn-shimmer absolute inset-0" />
                <span className="relative flex items-center gap-2">
                  Explore Plans
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            {/* Inline hero stats */}
            <div className="animate-slide-up stagger-4 mt-8 sm:mt-12 flex flex-wrap justify-center gap-3">
              {[
                { v: "4", l: "Phases" },
                { v: String(moduleCount), l: "Modules" },
                { v: "123", l: "SubModules" },
                { v: "130+", l: "Hours" },
              ].map((pill) => (
                <span
                  key={pill.l}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold backdrop-blur-sm shadow-sm"
                >
                  <span className="text-gradient-red font-black">{pill.v}</span>{" "}
                  <span className="text-[var(--text-muted)]">{pill.l}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase path section */}
      <section className="relative overflow-hidden bg-[var(--bg)] pb-12 sm:pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-4xl h-[600px] bg-mst-red/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6">
          <div className="animate-slide-up stagger-5 mx-auto w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/50 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="absolute inset-x-12 top-[4.5rem] hidden h-1 rounded-full bg-gradient-to-r from-[var(--accent-blue)] via-mst-red to-[var(--accent-green)] sm:block" />
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {localPhases.map((phase: any, i) => {
                  const Icon = PHASE_ICONS[i] ?? Blocks;
                  const color = PHASE_COLORS[i];
                  const phaseId = phase._id || phase.id;
                  const hours = phase.estimatedTime ?? PHASE_HOURS[phaseId]?.hours;
                  const moduleCount = phase.realmodulecount ?? phase.modules?.length ?? 0;
                  return (
                    <div
                      key={phaseId}
                      className="group relative flex flex-col items-center text-center cursor-pointer"
                      onClick={() => handlePhaseClick(i, phaseId)}
                    >
                      <div
                        className="icon-pulse-glow relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-[var(--bg)] shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
                        style={{ borderColor: color }}
                      >
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" style={{ color }} />
                      </div>
                      <p
                        className="mt-4 text-sm font-bold uppercase tracking-wider"
                        style={{ color }}
                      >
                        Phase {i + 1}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[var(--text-muted)] sm:text-sm">
                        {moduleCount} modules
                        {hours ? ` · ~${hours}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Expandable Curriculum Cards */}
              <div
                className={`grid transition-all duration-700 ease-in-out ${expandedPhase !== null ? "grid-rows-[1fr] opacity-100 mt-12" : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="mx-auto max-w-2xl pt-4">
                    {expandedPhase !== null && (() => {
                      const phase: any = localPhases[expandedPhase];
                      const details = expandedPhaseDetails || phase;
                      const Icon = PHASE_ICONS[expandedPhase] ?? Blocks;
                      const color = PHASE_COLORS[expandedPhase];
                      const phaseId = phase._id || phase.id;
                      const hours = details.estimatedTime ?? PHASE_HOURS[phaseId]?.hours;
                      const moduleCount = details.realmodulecount ?? details.modules?.length ?? 0;
                      return (
                        <div className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-mst-red/40 hover:shadow-2xl sm:p-10">
                          {isLoadingPhase && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface)]/50 backdrop-blur-sm">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
                            </div>
                          )}
                          <div
                            className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 blur-3xl transition duration-500 group-hover:opacity-50"
                            style={{ backgroundColor: color }}
                          />
                          <div
                            className="absolute right-6 top-6 text-[6rem] font-black leading-none opacity-[0.06]"
                            style={{ color }}
                          >
                            {expandedPhase + 1}
                          </div>
                          <div className="relative z-10">
                            <div
                              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                              style={{ backgroundColor: `color-mix(in srgb, ${color} 22%, transparent)` }}
                            >
                              <Icon className="h-7 w-7" style={{ color }} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color }}
                              >
                                Phase {expandedPhase + 1}
                              </span>
                              <span className="text-sm text-[var(--text-muted)]">
                                · {moduleCount} modules
                                {hours ? ` · ~${hours}` : ""}
                              </span>
                            </div>
                            <h3 className="mt-3 text-2xl font-bold leading-snug text-[var(--text)]">
                              {details.title}
                            </h3>
                            {details.description && (
                              <p className="mt-4 text-base text-[var(--text-muted)]">
                                {details.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="mt-10 text-center">
                    <Link
                      href="/academy-overview"
                      className="group inline-flex items-center gap-2 rounded-full border-2 border-mst-red/40 bg-gradient-to-r from-mst-red/10 to-[var(--accent-purple)]/10 px-8 py-4 text-base font-bold text-mst-red transition hover:bg-mst-red hover:text-white"
                    >
                      View full curriculum with every submodule
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fellowship funnel + pricing */}
      <section
        id="fellowship"
        className="relative border-b border-[var(--border)] bg-[var(--bg)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
              Fellowship Enrollment
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Lifetime access + <span className="text-gradient-red">internship + rewards</span>
            </h2>
            <p className="mt-5 text-lg text-[var(--text-muted)]">
              Choose your track below. Build your <strong>streak</strong> and
              compete on the leaderboard for <strong>PPO opportunities</strong>.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(() => {
              const courseData = courseDetails?.course || courseDetails?.data || courseDetails;
              const apiPlans = courseData?.pricingPlans || [];

              const cardsToRender = apiPlans.map((plan: any) => {
                const role = plan.role || "";

                // Format role name dynamically (e.g. VALIDATOR -> Validator Fellowship)
                const formatRoleToTitle = (r: string) => {
                  if (!r) return "";
                  const words = r.split("_");
                  const titleCased = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  if (titleCased.toLowerCase().includes("only")) {
                    return titleCased;
                  }
                  return `${titleCased}`;
                };

                // Generate detail links dynamically based on role
                const getDetailHref = (r: string) => {
                  const slug = r.toLowerCase().replace(/_/g, "-");
                  return `/plans/${slug}`;
                };

                // Generate sub-labels dynamically based on role
                const getDefaultTag = (r: string) => {
                  const normalized = r.toUpperCase();
                  if (normalized === "VALIDATOR") return "Validator portal + stakeholder access";
                  if (normalized === "STUDENT") return "Student ID scholarship";
                  if (normalized === "WORKING_PROFESSIONAL" || normalized === "PROFESSIONAL") return "Career transition focused";
                  return "Foundation track offer";
                };

                // Format price number or string to display standard currency symbol
                const formatPrice = (p: any) => {
                  if (p === undefined || p === null) return "";
                  const numVal = typeof p === "number" ? p : parseInt(String(p).replace(/[^0-9]/g, ""), 10);
                  const inrStr = typeof p === "number" ? `Rs ${p.toLocaleString()}` : (p.toString().startsWith("Rs") ? p : `Rs ${p}`);
                  if (!usdRate || isNaN(numVal)) return inrStr;
                  const usd = convertINRtoUSD(numVal, usdRate);
                  return `${inrStr} / $${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                };

                const title = plan.title || plan.name || formatRoleToTitle(role);
                const detailHref = plan.detailHref || plan.link || getDetailHref(role);
                const tag = plan.tag || plan.description || getDefaultTag(role);
                const price = formatPrice(plan.price);
                const originalPriceVal = plan.originalPrice || plan.discountedFrom || plan.original;
                const original = (originalPriceVal && originalPriceVal !== plan.price) ? formatPrice(originalPriceVal) : "";

                return {
                  id: role.toLowerCase(),
                  detailHref,
                  title,
                  price,
                  original,
                  gradient: "bg-gradient-to-br from-mst-red/20 via-mst-red/5 to-transparent",
                  tag,
                  bullets: plan.perks || [],
                };
              });

              return cardsToRender.map((card: any, i: number) => {
                const apiPrice = card.price;
                const apiOriginal = card.original;

                return (
                  <RevealSection key={card.id} delay={i * 70} className="h-full">
                    <div
                      className={`relative flex flex-col h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-mst-red/30 hover:shadow-2xl`}
                    >
                      <div className={`absolute inset-0 opacity-90 ${card.gradient}`} />
                      <div className="relative flex flex-col flex-1">
                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] min-h-[32px]">
                              {card.tag}
                            </p>
                            <h3 className="mt-3 text-xl font-black text-[var(--text)]">
                              {card.title}
                            </h3>
                          </div>
                          <div className="mt-2 border-b border-[var(--border)] pb-4">
                            <div className="flex items-end justify-between">
                              {apiOriginal && (
                                <p className="text-xs font-semibold text-[var(--text-muted)] line-through">
                                  {apiOriginal}
                                </p>
                              )}
                              <div className="text-right ml-auto">
                                <p className="text-2xl font-black text-gradient-red leading-none">
                                  {apiPrice}
                                </p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                  One-time enrollment
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 space-y-2 flex-1">
                          {card.bullets.map((b: string) => (
                            <div
                              key={b}
                              className="flex items-start gap-2 text-sm text-[var(--text-muted)]"
                            >
                              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-mst-red" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-4">
                          <Link
                            href={card.detailHref}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--text)] transition hover:border-mst-red hover:bg-[var(--bg-muted)]"
                          >
                            Explore this plan
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                          <div className="mt-2 text-right">
                            <span className="text-[10px] text-[var(--text-muted)] font-medium">
                              * Exclusive of GST
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RevealSection>
                );
              });
            })()}
          </div>

          {/* Leaderboard */}
          <div className="mt-14 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
                  Leaderboard
                </p>
                <h3 className="mt-3 text-2xl font-black text-[var(--text)]">
                  Top performers get fellowship bonuses
                </h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Rank updates automatically from progress in the Learning Tree.
                </p>
              </div>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--text)] transition hover:border-mst-red hover:bg-[var(--bg-muted)]"
              >
                View full leaderboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-3 pr-3">Rank</th>
                    <th className="py-3 pr-3">Learner</th>
                    <th className="py-3 pr-3">Completed</th>
                    <th className="py-3 pr-3">Progress</th>
                    <th className="py-3 pr-3">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {isLeaderboardLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-mst-red" />
                      </td>
                    </tr>
                  ) : fetchError || leaderboardEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-[var(--text-muted)]">
                        Failed to load leaderboard data.
                      </td>
                    </tr>
                  ) : (
                    leaderboardEntries.slice(0, 5).map((row, index) => {
                      const rank = index + 1;
                      return (
                        <tr
                          key={row.id || index}
                          className="border-b border-[var(--border)]/60 last:border-b-0"
                        >
                          <td className="py-3 pr-3 font-bold text-mst-red">
                            #{rank}
                          </td>
                          <td className="py-3 pr-3 font-semibold text-[var(--text)]">
                            {row.name}
                          </td>
                          <td className="py-3 pr-3 text-[var(--text-muted)]">
                            {row.modulesDone} modules
                          </td>
                          <td className="py-3 pr-3 text-[var(--text-muted)]">
                            {row.score}%
                          </td>
                          <td className="py-3 pr-3">
                            <div className="inline-flex flex-col items-center justify-center bg-orange-500/10 dark:bg-orange-500/20 rounded-xl px-2.5 py-1.5 min-w-[3rem] w-fit">
                              <Flame className="h-4 w-4 text-orange-500 mb-0.5" />
                              <span className="text-[10px] sm:text-xs font-black text-[var(--text)]">{row.streak}d</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        id="stats"
        ref={statsRef.ref}
        className="relative border-y border-[var(--border)] bg-gradient-to-r from-[var(--bg-elevated)] via-[var(--surface)] to-[var(--bg-elevated)] py-4"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-subtle opacity-80" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {[
            { end: 4, suffix: "", label: "Phases" },
            { end: moduleCount, suffix: "", label: "Modules" },
            { end: 123, submoduleCount, suffix: "", label: "Submodules" },
            { end: 130, suffix: "+", label: "Hours" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`border-[var(--border)] px-6 py-16 text-center sm:py-20 ${i > 0 ? "border-l" : ""
                } ${statsRef.visible ? "animate-scale-in" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <p className="text-4xl font-black text-gradient-red sm:text-6xl">
                {statsRef.visible ? (
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                ) : (
                  "0"
                )}
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mst-red">
              Platform Features
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Everything you need to become a{" "}
              <span className="text-gradient-red">blockchain developer</span>
            </h2>
          </RevealSection>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <RevealSection key={feature.title} delay={i * 60}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-mst-red/40 hover:shadow-2xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-mst-red/10 ring-2 ring-mst-red/20">
                      <feature.icon className="h-7 w-7 text-mst-red" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* Marquee */}
      <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mst-red/5 to-transparent blur-xl pointer-events-none" />
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[var(--surface)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[var(--surface)] to-transparent" />
          <div className="marquee-track gap-4 px-4">
            {[...topics, ...topics].map((topic, i) => (
              <span
                key={`${topic}-${i}`}
                className="shrink-0 rounded-full border border-[var(--border)] bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--surface)] px-6 py-2.5 text-base font-semibold text-[var(--text)] shadow-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-10 sm:p-14">
              <div className="bg-pattern-dots absolute inset-0 opacity-40" />
              <div className="hero-mesh absolute inset-0 opacity-30" />
              <div className="relative grid gap-10 sm:grid-cols-3">
                {[
                  {
                    icon: Shield,
                    title: "70% pass rule",
                    desc: "Unlock the next lesson only when you truly understand the material.",
                  },
                  {
                    icon: Zap,
                    title: "Live on MST Chain",
                    desc: "Deploy and test on an EVM-compatible hybrid Layer-1 built for India.",
                  },
                  {
                    icon: GraduationCap,
                    title: "College integrated",
                    desc: "Structured syllabus aligned with academic and industry standards.",
                  },
                ].map((item) => (
                  <div key={item.title} className="text-center sm:text-left">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mst-red/10 ring-1 ring-mst-red/20 sm:mx-0">
                      <item.icon className="h-7 w-7 text-mst-red" />
                    </div>
                    <p className="text-lg font-bold text-[var(--text)]">{item.title}</p>
                    <p className="mt-2 text-base text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[var(--border)]">
        <MarketingHeroBackground />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <RevealSection>
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-mst-red to-red-700 shadow-2xl shadow-mst-red/40 icon-pulse-glow">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              Ready to start your{" "}
              <span className="text-gradient-red">Web3 journey</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-muted)]">
              Join Masterstroke Academy - from zero blockchain knowledge to
              building, auditing, and pitching production-grade dApps.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#fellowship"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-mst-red to-red-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-mst-red/30 transition hover:shadow-2xl"
              >
                <span className="btn-shimmer absolute inset-0" />
                <span className="relative flex items-center gap-2">
                  Explore Plans
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
