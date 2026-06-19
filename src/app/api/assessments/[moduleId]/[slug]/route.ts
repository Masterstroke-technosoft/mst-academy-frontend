import { NextRequest, NextResponse } from "next/server";
import { getAssessment } from "@/lib/curriculum.server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; slug: string }> }
) {
  const { moduleId: moduleIdStr, slug } = await params;
  const moduleId = parseInt(moduleIdStr, 10);
  if (Number.isNaN(moduleId)) {
    return NextResponse.json({ error: "Invalid module ID" }, { status: 400 });
  }

  const assessment = getAssessment(moduleId, slug);
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json(assessment);
}
