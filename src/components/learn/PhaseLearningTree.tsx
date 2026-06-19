"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { useEffect, useMemo, memo } from "react";
import { Lock, CheckCircle2, Circle, BookOpen, Zap, Star } from "lucide-react";
import type { Curriculum, ModuleMeta } from "@/lib/types";
import { getPhaseTreeLayout, getPhaseEdges, getLayoutCenterX } from "@/lib/phase-layout";
import {
  getModuleStatus,
  getModuleProgressPercent,
  type ModuleStatus,
} from "@/lib/progress";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

const MODULE_EMOJIS: Record<number, string> = {
  1: "🌐", 2: "🔗", 3: "🔒", 4: "💰",
  5: "⚡", 6: "🛠️", 7: "📜", 8: "🚀",
  9: "🏦", 10: "🎨", 11: "🏛️", 12: "🌉",
  13: "📊", 14: "🔐", 15: "🧪", 16: "💎",
  17: "📝", 18: "🎤", 19: "💼", 20: "🎓",
  21: "🏆",
};

const ModuleCard = memo(function ModuleCard({
  data,
}: {
  data: {
    module: ModuleMeta;
    status: ModuleStatus;
    progress: number;
    href: string;
    phaseColor: string;
    isLight: boolean;
  };
}) {
  const { module, status, progress, href, isLight } = data;
  const locked = status === "locked";
  const emoji = MODULE_EMOJIS[module.id] || "📚";

  const gradientBg = status === "active"
    ? isLight
      ? "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"
      : "bg-gradient-to-br from-red-950/60 via-orange-950/40 to-yellow-950/30"
    : status === "completed"
      ? isLight
        ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
        : "bg-gradient-to-br from-emerald-950/60 via-green-950/40 to-teal-950/30"
      : isLight
        ? "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100"
        : "bg-gradient-to-br from-gray-900/80 via-slate-900/60 to-gray-800/40";

  const handleStyle = { opacity: 0, width: 1, height: 1 } as const;

  const card = (
    <div
      className={`relative min-w-[260px] max-w-[300px] rounded-2xl border-2 p-6 transition-all duration-300 ${gradientBg} ${
        status === "active"
          ? "border-mst-red shadow-[0_6px_40px_rgba(227,30,36,0.25)]"
          : status === "completed"
            ? "border-green-500/50 shadow-[0_6px_32px_rgba(34,197,94,0.15)]"
            : isLight
              ? "border-gray-200/80 opacity-65"
              : "border-white/10 opacity-55"
      } ${locked ? "cursor-pointer" : "hover:shadow-2xl hover:-translate-y-1.5 hover:scale-[1.03]"}`}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl" role="img">{emoji}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-mst-red">
            Module {module.id}
          </span>
        </div>
        {status === "completed" && (
          <div className="flex items-center gap-1">
            <CheckCircle2 size={20} className="text-green-500" />
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
          </div>
        )}
        {status === "active" && (
          <div className="relative">
            <Circle size={20} className="fill-mst-red text-mst-red" />
            <span className="absolute inset-0 animate-ping rounded-full bg-mst-red/30" />
          </div>
        )}
        {status === "locked" && (
          <Lock size={18} className="text-[var(--text-muted)]" />
        )}
      </div>

      <h3
        className={`mt-3.5 text-[15px] font-extrabold leading-snug ${isLight ? "text-gray-900" : "text-white"}`}
      >
        {module.title}
      </h3>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
          <BookOpen size={12} />
          {module.submodules.length} lessons
        </span>
        {status === "active" && (
          <span className="rounded-full bg-mst-red/10 px-2 py-0.5 text-[10px] font-bold text-mst-red">
            In Progress
          </span>
        )}
      </div>

      <div className="mt-4">
        <div
          className={`h-2 overflow-hidden rounded-full ${isLight ? "bg-gray-200/60" : "bg-white/10"}`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "completed"
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-mst-red to-orange-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">
            {progress}% complete
          </span>
          {status === "active" && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-mst-red">
              <Zap size={11} /> Continue →
            </span>
          )}
          {status === "completed" && (
            <span className="text-[11px] font-bold text-green-500">
              ✅ Done
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (locked) return card;
  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
});

const PhaseHeaderNode = memo(function PhaseHeaderNode({ data }: { data: { label: string } }) {
  return (
    <div className="pointer-events-none">
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
      {data.label}
    </div>
  );
});

const nodeTypes = { moduleCard: ModuleCard, phaseHeader: PhaseHeaderNode };

function FlowCenter({ phaseId }: { phaseId: string }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.5, duration: 500 });
    }, 120);
    return () => clearTimeout(t);
  }, [phaseId, fitView]);
  return null;
}

interface PhaseLearningTreeProps {
  curriculum: Curriculum;
  phaseId: string;
  phaseIndex: number;
  allModuleIds: number[];
  moduleSlugMap: Record<number, string[]>;
}

export { MODULE_EMOJIS };

export function MobileModuleList({
  curriculum,
  phaseId,
  allModuleIds,
  moduleSlugMap,
}: Omit<PhaseLearningTreeProps, "phaseIndex">) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const getSlugs = (id: number) => moduleSlugMap[id] ?? [];
  const modules = curriculum.modules.filter((m) => m.phaseId === phaseId);

  const phaseColors: Record<string, string> = {
    "phase-1": "#3b82f6",
    "phase-2": "#a855f7",
    "phase-3": "#22c55e",
    "phase-4": "#e31e24",
  };
  const color = phaseColors[phaseId] || "#e31e24";

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {modules.map((mod, i) => {
        const slugsForMod = mod.submodules.map((s) => s.slug);
        const status = getModuleStatus(mod.id, allModuleIds, slugsForMod, getSlugs);
        const progress = getModuleProgressPercent(mod.id, slugsForMod);
        const emoji = MODULE_EMOJIS[mod.id] || "📚";
        const locked = status === "locked";

        const gradientBg = status === "active"
          ? isLight
            ? "bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50"
            : "bg-gradient-to-r from-red-950/60 via-orange-950/40 to-yellow-950/30"
          : status === "completed"
            ? isLight
              ? "bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50"
              : "bg-gradient-to-r from-emerald-950/60 via-green-950/40 to-teal-950/30"
            : isLight
              ? "bg-gradient-to-r from-gray-50 to-slate-50"
              : "bg-gradient-to-r from-gray-900/80 to-slate-900/60";

        const card = (
          <div
            className={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${gradientBg} ${
              status === "active"
                ? "border-mst-red shadow-lg"
                : status === "completed"
                  ? "border-green-500/50 shadow-md"
                  : isLight
                    ? "border-gray-200/80 opacity-65"
                    : "border-white/10 opacity-55"
            } ${locked ? "pointer-events-none cursor-not-allowed" : "active:scale-[0.98]"}`}
          >
            {i > 0 && (
              <div
                className="absolute -top-5 left-1/2 h-5 w-0.5 -translate-x-1/2"
                style={{ backgroundColor: color + "60" }}
              />
            )}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-mst-red">
                    Module {mod.id}
                  </span>
                  {status === "completed" && <CheckCircle2 size={16} className="text-green-500" />}
                  {status === "active" && (
                    <span className="rounded-full bg-mst-red/10 px-2 py-0.5 text-[10px] font-bold text-mst-red">
                      Active
                    </span>
                  )}
                  {status === "locked" && <Lock size={14} className="text-[var(--text-muted)]" />}
                </div>
                <h3 className={`mt-1 text-sm font-extrabold leading-snug ${isLight ? "text-gray-900" : "text-white"}`}>
                  {mod.title}
                </h3>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1"><BookOpen size={11} /> {mod.submodules.length} lessons</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status === "completed"
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-mst-red to-orange-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );

        if (locked) return <div key={mod.id}>{card}</div>;
        return (
          <Link key={mod.id} href={`/module/${mod.id}`} className="block">
            {card}
          </Link>
        );
      })}
    </div>
  );
}

export function PhaseLearningTree({
  curriculum,
  phaseId,
  phaseIndex,
  allModuleIds,
  moduleSlugMap,
}: PhaseLearningTreeProps) {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const isLight = theme === "light";
  const getSlugs = (id: number) => moduleSlugMap[id] ?? [];
  const phase = curriculum.phases.find((p) => p.id === phaseId);
  const modules = useMemo(
    () => curriculum.modules.filter((m) => m.phaseId === phaseId),
    [curriculum.modules, phaseId]
  );

  const phaseColors: Record<string, string> = {
    "phase-1": "#3b82f6",
    "phase-2": "#a855f7",
    "phase-3": "#22c55e",
    "phase-4": "#e31e24",
  };
  const color = phaseColors[phaseId] || "#e31e24";

  const PHASE_EMOJIS: Record<string, string> = {
    "phase-1": "🌐",
    "phase-2": "⚡",
    "phase-3": "🚀",
    "phase-4": "🎯",
  };

  const { nodes, edges } = useMemo(() => {
    const positions = getPhaseTreeLayout(modules, phaseIndex);
    const edgeDefs = getPhaseEdges(modules, phaseIndex);
    const phaseEmoji = PHASE_EMOJIS[phaseId] || "📘";
    const headerWidth = 440;
    const headerX = getLayoutCenterX(positions) - headerWidth / 2;

    const flowNodes: Node[] = [
      {
        id: "phase-header",
        type: "phaseHeader",
        position: { x: headerX, y: -120 },
        data: { label: `${phaseEmoji} Phase ${phaseIndex + 1}: ${phase?.title || "Phase"}` },
        style: {
          background: isLight
            ? `linear-gradient(135deg, ${color}18, ${color}08)`
            : `linear-gradient(135deg, ${color}30, ${color}10)`,
          border: `3px solid ${color}70`,
          borderRadius: 24,
          padding: "22px 36px",
          fontSize: 16,
          fontWeight: 900,
          color: isLight ? "#111827" : "#fff",
          width: 440,
          textAlign: "center" as const,
          pointerEvents: "none" as const,
          boxShadow: `0 12px 48px ${color}25`,
          letterSpacing: "0.02em",
        },
        draggable: false,
        selectable: false,
      },
      ...positions.map((pos) => {
        const mod = modules.find((m) => `mod-${m.id}` === pos.id)!;
        const slugsForMod = mod.submodules.map((s) => s.slug);
        const status = getModuleStatus(
          mod.id,
          allModuleIds,
          slugsForMod,
          getSlugs
        );
        const progress = getModuleProgressPercent(mod.id, slugsForMod);
        return {
          id: pos.id,
          type: "moduleCard",
          position: { x: pos.x, y: pos.y },
          data: {
            module: mod,
            status,
            progress,
            href: `/module/${mod.id}`,
            phaseColor: color,
            isLight,
          },
          draggable: false,
        };
      }),
    ];

    const edgeStroke = isLight ? "#6b7280" : "#555";

    const flowEdges: Edge[] = edgeDefs.map((e, i) => ({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      style: { stroke: edgeStroke, strokeWidth: 3, strokeDasharray: "8 4" },
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeStroke, width: 16, height: 16 },
    }));

    if (modules[0]) {
      flowEdges.unshift({
        id: "e-header-first",
        source: "phase-header",
        target: `mod-${modules[0].id}`,
        type: "smoothstep",
        style: { stroke: color, strokeWidth: 3.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 18, height: 18 },
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [
    modules,
    phase,
    phaseIndex,
    phaseId,
    color,
    allModuleIds,
    moduleSlugMap,
    isLight,
    isAdmin,
  ]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        minZoom={0.25}
        maxZoom={1.5}
        panOnScroll
        zoomOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={isLight ? "#d1d5db" : "#1a1a1a"}
          gap={24}
        />
        <Controls
          className={
            isLight
              ? "!border-gray-200 !bg-white !rounded-xl !shadow-lg [&>button]:!bg-gray-50 [&>button]:!text-gray-800 [&>button]:!border-gray-200 [&>button]:!rounded-lg"
              : "!bg-[#111] !border-white/10 !rounded-xl !shadow-lg [&>button]:!bg-[#222] [&>button]:!text-white [&>button]:!rounded-lg"
          }
        />
        <MiniMap
          nodeColor={() => color}
          maskColor={isLight ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)"}
          className={
            isLight
              ? "!border-gray-200 !bg-white !rounded-xl"
              : "!bg-[#0a0a0a] !border-white/10 !rounded-xl"
          }
        />
        <FlowCenter phaseId={phaseId} />
      </ReactFlow>
    </div>
  );
}
