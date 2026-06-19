"use client";

import type { Curriculum } from "@/lib/types";
import { StudentCommandCenter } from "./StudentCommandCenter";

/** Student-facing learning command center (not admin). */
export function StudentDashboardClient({ curriculum }: { curriculum: Curriculum }) {
  return <StudentCommandCenter curriculum={curriculum} />;
}
