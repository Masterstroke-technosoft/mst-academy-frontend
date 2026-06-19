import type { ModuleMeta } from "./types";

const CARD_WIDTH = 280;

/** Tree positions per phase with generous spacing to prevent card overlap */
export function getPhaseTreeLayout(
  modules: ModuleMeta[],
  phaseIndex: number
): { id: string; x: number; y: number }[] {
  const n = modules.length;
  if (n === 0) return [];

  // Phase 1 (6 modules): 2 columns, 3 rows
  if (phaseIndex === 0 && n === 6) {
    const cols = [0, 400];
    const rows = [0, 280, 560];
    return modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: cols[i % 2],
      y: rows[Math.floor(i / 2)],
    }));
  }

  // Phase 2 (4 modules): 2 columns, 2 rows (inset for visual variety)
  if (phaseIndex === 1 && n === 4) {
    const cols = [100, 500];
    const rows = [0, 280];
    return modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: cols[i % 2],
      y: rows[Math.floor(i / 2)],
    }));
  }

  // Phase 3 (9 modules): 3 columns, 3 rows
  if (phaseIndex === 2 && n === 9) {
    const cols = [0, 380, 760];
    const rows = [0, 280, 560];
    return modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: cols[i % 3],
      y: rows[Math.floor(i / 3)],
    }));
  }

  // Phase 4 (2 modules): single centered column
  if (phaseIndex === 3 && n === 2) {
    return modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: 200,
      y: i * 280,
    }));
  }

  // Default fallback: 2 columns with proper spacing
  return modules.map((m, i) => ({
    id: `mod-${m.id}`,
    x: (i % 2) * 400,
    y: Math.floor(i / 2) * 280,
  }));
}

/** Compute the center x of a set of card positions (accounts for card width) */
export function getLayoutCenterX(
  positions: { x: number }[]
): number {
  if (positions.length === 0) return 0;
  const minX = Math.min(...positions.map((p) => p.x));
  const maxX = Math.max(...positions.map((p) => p.x));
  return minX + (maxX + CARD_WIDTH - minX) / 2;
}

export function getPhaseEdges(
  modules: ModuleMeta[],
  phaseIndex: number
): { source: string; target: string }[] {
  const edges: { source: string; target: string }[] = [];
  const n = modules.length;
  if (n < 2) return edges;

  const id = (i: number) => `mod-${modules[i].id}`;

  // Phase 1 (6 modules, 2x3 grid): horizontal row links + vertical column links
  if (phaseIndex === 0 && n === 6) {
    edges.push(
      { source: id(0), target: id(1) },
      { source: id(2), target: id(3) },
      { source: id(4), target: id(5) },
      { source: id(0), target: id(2) },
      { source: id(2), target: id(4) },
      { source: id(1), target: id(3) },
      { source: id(3), target: id(5) },
    );
    return edges;
  }

  // Phase 2 (4 modules, 2x2 grid): fan-out from top then converge
  if (phaseIndex === 1 && n === 4) {
    edges.push(
      { source: id(0), target: id(1) },
      { source: id(0), target: id(2) },
      { source: id(1), target: id(3) },
      { source: id(2), target: id(3) },
    );
    return edges;
  }

  // Phase 3 (9 modules, 3x3 grid): row links + column links
  if (phaseIndex === 2 && n === 9) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        edges.push({ source: id(row * 3 + col), target: id(row * 3 + col + 1) });
      }
    }
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 2; row++) {
        edges.push({ source: id(row * 3 + col), target: id((row + 1) * 3 + col) });
      }
    }
    return edges;
  }

  // Default: sequential chain
  for (let i = 0; i < n - 1; i++) {
    edges.push({ source: id(i), target: id(i + 1) });
  }
  return edges;
}
