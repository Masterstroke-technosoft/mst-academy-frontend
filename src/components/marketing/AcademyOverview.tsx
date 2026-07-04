"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import type { Curriculum, ModuleMeta, Phase, SubmoduleMeta } from "@/lib/types";
import { getCardSubmoduleTitle } from "@/lib/display-titles";
import { Typewriter } from "@/components/marketing/Typewriter";
import { AnimatedCounter } from "@/components/marketing/AnimatedCounter";
import { useInView } from "@/components/marketing/useInView";
import { RevealSection } from "@/components/marketing/RevealSection";
import { MarketingHeroBackground } from "@/components/marketing/MarketingHeroBackground";
import {
  ASSESSMENT_TYPES,
  OUTCOMES,
  PHASE_HOURS,
  PROGRAMME_BADGES,
  PROGRAMME_STATS,
} from "@/lib/academy-overview";
import {
  ArrowRight,
  Award,
  BookOpen,
  Blocks,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Code2,
  Cpu,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  PlayCircle,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";

interface AcademyOverviewProps {
  curriculum: Curriculum;
}

const OUTCOME_ICONS = {
  code: Code2,
  star: Star,
  shield: Shield,
  globe: Globe,
} as const;

const PHASE_ICONS = [Blocks, Cpu, Layers, Rocket];
const PHASE_COLORS = [
  "var(--accent-blue)",
  "var(--mst-red)",
  "var(--accent-purple)",
  "var(--accent-green)",
];

const OUTCOME_GRADIENTS = [
  "from-blue-500/20 to-cyan-500/10",
  "from-mst-red/20 to-orange-500/10",
  "from-purple-500/20 to-pink-500/10",
  "from-emerald-500/20 to-teal-500/10",
];

const NAV_SECTIONS = [
  { id: "outcomes", label: "Outcomes" },
  { id: "curriculum", label: "Curriculum" },
  { id: "modules", label: "Modules" },
  { id: "assessment", label: "Assessment" },
  { id: "credential", label: "Credential" },
];

function Expandable({
  open,
  onToggle,
  header,
  children,
  accent,
  className = "",
}: {
  open: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-lg ${className}`}
      style={
        accent
          ? {
            borderLeftWidth: 4,
            borderLeftColor: accent,
            boxShadow: open ? `0 8px 32px ${accent}18` : undefined,
          }
          : undefined
      }
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[var(--bg-muted)]/80"
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition"
          style={{
            backgroundColor: accent ? `${accent}22` : "var(--bg-muted)",
          }}
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""
              }`}
            style={{ color: accent ?? "var(--text-muted)" }}
          />
        </div>
        <div className="min-w-0 flex-1">{header}</div>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--border)] px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SubmoduleCard({
  mod,
  sub,
  accent,
}: {
  mod: any;
  sub: any;
  accent?: string;
}) {
  const title = getCardSubmoduleTitle(sub.title);
  const desc =
    sub.description?.trim() ||
    sub.subtitle?.trim() ||
    `Deep dive into ${title.toLowerCase()} with hands-on examples.`;

  const subSlug = sub.slug || sub._id || sub.id || sub.index;
  const subIdText = sub.index ?? sub.id ?? sub._id;
  const moduleId = mod._id || mod.id;

  return (
    <Link
      href='#'
      onClick={(e) => {
        // Comment out or prevent click navigation if needed:
        e.preventDefault();
      }}
      className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-mst-red/40 hover:shadow-md cursor-default"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition group-hover:opacity-30"
        style={{ backgroundColor: accent ?? "var(--mst-red)" }}
      />
      <div className="relative flex items-start gap-3">
        <span
          className="shrink-0 rounded-lg px-2 py-1 font-mono text-xs font-bold"
          style={{
            color: accent ?? "var(--mst-red)",
            backgroundColor: `${accent ?? "var(--mst-red)"}18`,
          }}
        >
          {subIdText}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--text)] transition group-hover:text-mst-red">
            {title}
          </p>
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[var(--text-muted)]">
            {desc}
          </p>
          {/* <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-mst-red opacity-0 transition group-hover:opacity-100">
            <PlayCircle className="h-3.5 w-3.5" />
            Open lesson
          </span> */}
        </div>
      </div>
    </Link>
  );
}

async function fetchWithAuth(url: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(url, {
    credentials: "include",
    headers,
  });
}

function ModuleSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 space-y-2.5">
              <div className="h-3 w-16 rounded bg-[var(--border-strong)]/30" />
              <div className="h-4 w-1/3 rounded bg-[var(--border-strong)]/40" />
              <div className="h-3 w-2/3 rounded bg-[var(--border-strong)]/30" />
            </div>
            <div className="h-6 w-16 rounded-full bg-[var(--border-strong)]/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SubmoduleSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 animate-pulse">
      {[1, 2].map((n) => (
        <div
          key={n}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-6 w-8 rounded bg-[var(--border-strong)]/30 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-[var(--border-strong)]/40" />
              <div className="h-3 w-5/6 rounded bg-[var(--border-strong)]/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ModuleSubmodulesList({
  mod,
  isOpen,
  baseURL,
  color,
}: {
  mod: any;
  isOpen: boolean;
  baseURL: string;
  color: string;
}) {
  const moduleId = mod._id || mod.id;
  const submodules = mod.submodules || [];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {submodules.map((sub: any) => (
          <SubmoduleCard
            key={sub.slug || sub._id || sub.id}
            mod={mod}
            sub={sub}
            accent={color}
          />
        ))}
      </div>
      <div className="mt-4 text-right">
        {/* <Link
          href={`/module/${moduleId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-mst-red transition hover:gap-2"
        >
          View module hub
          <ArrowRight className="h-3.5 w-3.5" />
        </Link> */}
      </div>
    </>
  );
}

function PhaseSection({
  phase: initialPhase,
  modules: initialModules,
  index,
  baseURL,
}: {
  phase: any;
  modules: any[];
  index: number;
  baseURL: string;
}) {
  const phaseId = initialPhase._id || initialPhase.id;
  const [open, setOpen] = useState(index === 0);
  const [phase, setPhase] = useState(initialPhase);
  const [modules, setModules] = useState<any[]>(initialModules);
  const [loading, setLoading] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string | number>>(
    () => new Set()
  );

  useEffect(() => {
    setPhase(initialPhase);
  }, [initialPhase]);

  useEffect(() => {
    if (!open) return;

    async function fetchModules() {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${baseURL}/api/phases/full/${phaseId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            if (json.phase) {
              setPhase(json.phase);
            }
            if (Array.isArray(json.modules)) {
              const sorted = [...json.modules].sort((a, b) => (a.index || 0) - (b.index || 0));
              setModules(sorted);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching phase full hierarchy:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, [open, phaseId, baseURL]);

  const meta = PHASE_HOURS[phaseId] || PHASE_HOURS[phase.id];
  const subCount = modules.reduce((n, m) => n + (m.submoduleCount || m.submodules?.length || 0), 0);
  const color = PHASE_COLORS[index] ?? "var(--mst-red)";
  const PhaseIcon = PHASE_ICONS[index] ?? Blocks;

  const toggleModule = (id: string | number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <RevealSection delay={index * 80}>
      <Expandable
        open={open}
        onToggle={() => setOpen((v) => !v)}
        accent={color}
        header={
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 w-full">
            <div className="flex flex-1 min-w-0 items-start gap-4">
              <div
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:flex"
                style={{ backgroundColor: `${color}22` }}
              >
                <PhaseIcon className="h-6 w-6" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color }}
                >
                  Phase {index + 1}
                </p>
                <h3 className="text-lg font-bold text-[var(--text)] sm:text-xl break-words">
                  {phase.title} {phase.description ? `: ${phase.description}` : ""}
                </h3>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1 text-[var(--text-muted)]">
                {modules.length || Number(phase.realmodulecount) || phase.moduleCount || 0} modules
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1 text-[var(--text-muted)]">
                {subCount} submodules
              </span>
              {(phase.estimatedTime || meta) && (
                <span
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  ~{phase.estimatedTime || meta?.hours}
                </span>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-3">
          {loading && modules.length === 0 ? (
            <ModuleSkeleton />
          ) : (
            modules.map((mod) => {
              console.log("Rendering module", mod.index);
              const modId = mod._id || mod.id;
              const subCount = mod.submoduleCount || mod.submodules?.length || 0;
              const moduleLabel = mod.index != null ? String(mod.index).padStart(2, "") : "";
              return (
                <Expandable
                  key={modId}
                  open={openModules.has(modId)}
                  onToggle={() => toggleModule(modId)}
                  header={
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-mst-red">
                          Module {moduleLabel ? ` ${moduleLabel}` : ""}
                        </p>
                        <p className="font-semibold text-[var(--text)]">{mod.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
                          {mod.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                        {subCount} lessons
                      </span>
                    </div>
                  }
                >
                  <ModuleSubmodulesList
                    mod={mod}
                    isOpen={openModules.has(modId)}
                    baseURL={baseURL}
                    color={color}
                  />
                </Expandable>
              );
            })
          )}
        </div>
      </Expandable>
    </RevealSection>
  );
}

export function AcademyOverview({ curriculum }: AcademyOverviewProps) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  const courseId = "6a2934912b48a13769669f8e";

  const [phases, setPhases] = useState<any[]>(curriculum?.phases || []);
  const [loading, setLoading] = useState(false);

  //Get phases by course
  useEffect(() => {
    async function loadPhases() {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${baseURL}/api/phases/course/${courseId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const sorted = [...json.data].sort((a, b) => (a.index || 0) - (b.index || 0));
            setPhases(sorted);
          }
        }
      } catch (err) {
        console.error("Error fetching course phases:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPhases();
  }, [baseURL, courseId]);

  const moduleMap = useMemo(() => {
    const map = new Map<string, ModuleMeta>();
    if (curriculum?.modules) {
      for (const m of curriculum.modules) map.set(String(m.id), m);
    }
    return map;
  }, [curriculum?.modules]);

  const totalSubmodules = useMemo(() => {
    if (!curriculum?.modules) return 0;
    return curriculum.modules.reduce((n, m) => n + m.submodules.length, 0);
  }, [curriculum?.modules]);

  const statsRef = useInView(0.05);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isVisible = mounted;
  return (
    <div className="overflow-hidden bg-[var(--bg)]">
      {/* Hero */}
      <section className="bg-grid relative overflow-hidden border-b border-[var(--border)] pb-6">
        <MarketingHeroBackground tall />

        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:pt-12">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            {/* <p className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-gradient-to-r from-mst-red/15 via-[var(--surface)]/50 to-[var(--accent-purple)]/15 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-mst-red shadow-lg backdrop-blur-md">
              <Sparkles className="h-4 w-4 animate-pulse-subtle" />
              Programme Overview
            </p> */}

            <h1 className="text-display mt-4 font-black text-[var(--text)] sm:whitespace-nowrap">
              Full{" "}
              <Typewriter
                strings={[
                  "Curriculum Map",
                  "Learning Path",
                  "Module Directory",
                  "130+ Hour Syllabus",
                ]}
                speedMs={38}
                pauseMs={900}
                className="text-gradient-red animate-gradient inline-block whitespace-nowrap"
              />
            </h1>

            <p className="animate-slide-up stagger-2 mx-auto mt-2 max-w-2xl text-xl leading-relaxed text-[var(--text-muted)] sm:text-2xl">
              Every phase, module, and submodule from internet foundations to
              capstone deployment, security audits, and Demo Day.
            </p>

            <div className="animate-slide-up stagger-3 mt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/learn"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-mst-red to-red-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-mst-red/30 transition hover:shadow-2xl"
              >
                <span className="btn-shimmer absolute inset-0" />
                <span className="relative flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Open Learning Tree
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface)]/80 px-10 py-4 text-lg font-bold text-[var(--text)] backdrop-blur-md transition hover:border-mst-red"
              >
                Enroll Now
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            ref={statsRef.ref}
            className="relative mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-5 sm:grid-cols-4"
          >
            {[
              { end: PROGRAMME_STATS.phases, suffix: "", label: "Phases" },
              { end: PROGRAMME_STATS.modules, suffix: "", label: "Modules" },
              { end: PROGRAMME_STATS.submodules, suffix: "", label: "Submodules" },
              { end: PROGRAMME_STATS.hours, suffix: "+", label: "Hours" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-mst-red/40 hover:shadow-2xl ${isVisible ? "animate-scale-in" : ""
                  }`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <p className="text-4xl font-black text-gradient-red sm:text-5xl">
                  {isVisible ? (
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  ) : (
                    <span>{stat.end}{stat.suffix}</span>
                  )}
                </p>
                <p className="mt-2 text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Badge marquee */}
        <div className="relative mt-8 overflow-hidden py-4">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--bg)]/10 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--bg)]/10 to-transparent" />
          <div className="marquee-track gap-3 px-3">
            {[...PROGRAMME_BADGES, ...PROGRAMME_BADGES].map((badge, i) => (
              <span
                key={`${badge}-${i}`}
                className="shrink-0 rounded-full border border-mst-red/20 bg-gradient-to-r from-mst-red/5 to-transparent px-4 py-1.5 text-xs font-semibold text-[var(--text-muted)]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      {/* <nav className="sticky top-16 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--nav-text)]/70 transition hover:bg-white/10 hover:text-[var(--nav-text)] sm:text-sm"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav> */}

      {/* Outcomes */}
      <section id="outcomes" className="border-b border-[var(--border)] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealSection className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
              Graduate Outcomes
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--text)] sm:text-4xl">
              What you will{" "}
              <span className="text-gradient-red">achieve</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
              Production skills, a portfolio project, and a path to grants and
              on-chain credentials.
            </p>
          </RevealSection>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {OUTCOMES.map((o, i) => {
              const Icon = OUTCOME_ICONS[o.icon as keyof typeof OUTCOME_ICONS];
              return (
                <RevealSection key={o.title} delay={i * 60} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mst-red/30 hover:shadow-xl">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${OUTCOME_GRADIENTS[i]} opacity-0 transition group-hover:opacity-100`}
                    />
                    <div className="relative">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-mst-red/10 ring-1 ring-mst-red/20">
                        <Icon className="h-5 w-5 text-mst-red" />
                      </div>
                      <h3 className="font-bold text-[var(--text)]">{o.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {o.description}
                      </p>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section
        id="curriculum"
        className="relative border-b border-[var(--border)] bg-[var(--bg-elevated)] py-24 sm:py-32"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-mst-red/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <RevealSection className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
                Syllabus
              </p>
              <h2 className="mt-2 text-3xl font-black text-[var(--text)] sm:text-4xl">
                Curriculum by phase
              </h2>
              <p className="mt-3 max-w-xl text-[var(--text-muted)]">
                Expand phases and modules to explore every lesson with its
                focus description - click any card to start learning.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold shadow-sm">
              <Clock className="h-4 w-4 text-mst-red" />
              <span className="text-[var(--text-muted)]">
                {PROGRAMME_STATS.hours}+ total hours
              </span>
            </div>
          </RevealSection>

          <div className="space-y-4">
            {phases.map((phase, i) => {
              const initialMods = curriculum?.modules?.filter(
                (m) => String(m.phaseId) === String(phase._id || phase.id)
              ) || [];
              return (
                <PhaseSection
                  key={phase._id || phase.id}
                  phase={phase}
                  modules={initialMods}
                  index={i}
                  baseURL={baseURL}
                />
              );
            })}
          </div>
        </div>
      </section>



      {/* Assessment */}
      <section
        id="assessment"
        className="relative border-b border-[var(--border)] bg-[var(--bg-elevated)] py-24 sm:py-32"
      >
        <div className="pointer-events-none absolute left-0 bottom-0 h-96 w-96 rounded-full bg-[var(--accent-purple)]/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <RevealSection>
              <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
                Evaluation
              </p>
              <h2 className="mt-2 text-3xl font-black text-[var(--text)] sm:text-4xl">
                Assessment framework
              </h2>
              <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
                Every submodule includes rigorous assessments. Score at least{" "}
                <strong className="text-gradient-red">
                  {PROGRAMME_STATS.passThreshold}%
                </strong>{" "}
                to unlock the next lesson. Full-screen lockdown mode ensures
                integrity.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Submodule quizzes after each lesson",
                  "Module-end comprehensive tests",
                  "Coding challenges with testnet deployment",
                  "Capstone project + Demo Day pitch",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]"
                  >
                    <Circle className="mt-1.5 h-2 w-2 shrink-0 fill-mst-red text-mst-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealSection>

            <div className="space-y-4">
              {ASSESSMENT_TYPES.map((a, i) => (
                <RevealSection key={a.type} delay={i * 70}>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-mst-red/20 hover:shadow-md">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[var(--text)]">
                        {a.type}
                      </span>
                      <span className="rounded-full bg-gradient-to-r from-mst-red/20 to-red-600/10 px-3 py-0.5 text-sm font-bold text-mst-red">
                        {a.pct}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{a.desc}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--bg-muted)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-mst-red to-red-500 transition-all duration-1000"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credential */}
      <section id="credential" className="border-b border-[var(--border)] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealSection className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-mst-red">
              After Graduation
            </p>
            <h2 className="mt-2 text-3xl font-black text-[var(--text)] sm:text-4xl">
              Credential & funding path
            </h2>
          </RevealSection>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: Award,
                title: "On-Chain Credential",
                desc: "Complete all phases, pass every assessment, and submit your capstone to receive a verifiable certificate recorded on MST Blockchain - proof of job-ready Web3 skills.",
                gradient: "from-amber-500/10 to-mst-red/10",
              },
              {
                icon: Zap,
                title: "Grant Funding Path",
                desc: "Top capstone projects may qualify for MST ecosystem grants. Pitch at Demo Day and compete for funding to launch your startup MVP.",
                gradient: "from-purple-500/10 to-cyan-500/10",
              },
            ].map((card, i) => (
              <RevealSection key={card.title} delay={i * 100} className="h-full">
                <div
                  className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br ${card.gradient} p-8 transition hover:-translate-y-1 hover:shadow-xl h-full flex flex-col`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mst-red/10 text-mst-red ring-1 ring-mst-red/20">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] flex-1">
                    {card.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>

          <RevealSection className="mt-12">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Layers,
                  title: "4 Phases",
                  desc: "Foundations → Tooling → MVP Build → Capstone",
                },
                {
                  icon: Target,
                  title: `${PROGRAMME_STATS.passThreshold}% Pass Rule`,
                  desc: "Must pass each submodule assessment to progress",
                },
                {
                  icon: FileText,
                  title: "College Integrated",
                  desc: "Structured syllabus aligned with academic standards",
                },
              ].map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-mst-red/30"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mst-red/10 text-mst-red">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]">{f.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <MarketingHeroBackground />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <RevealSection>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mst-red to-red-700 shadow-lg shadow-mst-red/30">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-[var(--text)] sm:text-4xl">
              Ready to start{" "}
              <span className="text-gradient-red">learning</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
              Enroll today and access the full learning tree, assessments, and
              live code execution.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red to-red-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-mst-red/25 transition hover:shadow-xl"
              >
                Create Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-8 py-3.5 font-semibold text-[var(--text)] transition hover:border-mst-red"
              >
                Back to Home
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
