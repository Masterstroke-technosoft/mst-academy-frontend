import { NextResponse } from "next/server";
import { getAssessment } from "@/lib/curriculum.server";

export async function GET(
  _request: Request,
  { params }: { params: { moduleId: string; slug: string } }
) {
  const moduleId = parseInt(params.moduleId, 10);
  if (Number.isNaN(moduleId)) {
    return NextResponse.json({ error: "Invalid module ID" }, { status: 400 });
  }

  const assessment = getAssessment(moduleId, params.slug);
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json(assessment);
}
