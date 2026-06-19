import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "bank-details.json");

function readBankDetails(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading bank details file:", error);
  }
  return [];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const list = readBankDetails();
    const detail = list.find((item: any) => item.userId === userId);
    
    if (!detail) {
      return NextResponse.json({ message: "Bank details not found" }, { status: 404 });
    }
    
    return NextResponse.json(detail);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
