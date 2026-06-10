import fs from "fs";
import path from "path";
import type { Assessment } from "./types";

export function getAssessment(
  moduleId: number,
  subSlug: string
): Assessment | null {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "assessments",
    String(moduleId),
    `${subSlug}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Assessment;
}
