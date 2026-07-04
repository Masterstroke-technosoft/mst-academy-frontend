import { NextRequest, NextResponse } from "next/server";
import curriculumData from "@/data/curriculum.json";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    
    // Find the module in the curriculum
    const mod = curriculumData.modules.find(
      (m) => String(m.id) === String(moduleId) || m.slug === moduleId
    );

    if (!mod) {
      return NextResponse.json(
        { success: false, message: "Module not found" },
        { status: 404 }
      );
    }

    // Map submodules to match the required API format
    const data = mod.submodules.map((sub, idx) => {
      // Clean display title prefix if present
      const cleanTitle = sub.title.replace(/^Sub-Module\s+\d+\.\d+\s*/i, "");
      
      return {
        _id: sub.slug || `${mod.id}-${idx + 1}`,
        moduleId: String(mod.id),
        index: idx + 1,
        title: cleanTitle,
        description: sub.subtitle || "",
        estimatedTime: "30 minutes",
        contentFile: `uploads/learning-content-files/${sub.filename || ""}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        status: "unlocked"
      };
    });

    // Determine moduleStatus (default to pending, but can be updated by progress)
    const url = new URL(request.url);
    const moduleStatus = url.searchParams.get("moduleStatus") || "pending";

    return NextResponse.json({
      success: true,
      message: "Submodules fetched successfully",
      moduleStatus,
      page: 1,
      limit: 10,
      total: data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
