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

function writeBankDetails(data: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing bank details file:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountHolderName, accountNumber, ifscCode, branchName, upiId } = body;

    const userId = req.headers.get("x-user-id") || "6a23f5b2dd1a0b2bf3c3cfc3";
    const userName = req.headers.get("x-user-name") || "Demo Admin";
    const userEmail = req.headers.get("x-user-email") || "abc111@gmail.com";

    const records = readBankDetails();
    
    // Check if user already has bank details
    const existingIndex = records.findIndex((r) => r.userId === userId);
    
    const now = new Date().toISOString();
    const newRecord = {
      _id: existingIndex >= 0 ? records[existingIndex]._id : "6a2bebdd" + Math.random().toString(16).slice(2, 18),
      userId,
      userName,
      userEmail,
      accountHolderName,
      accountNumber,
      ifscCode,
      branchName,
      upiId: upiId || "",
      createdAt: existingIndex >= 0 ? records[existingIndex].createdAt : now,
      updatedAt: now,
      __v: 0,
    };

    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }

    writeBankDetails(records);

    // POST returns only the requested fields
    return NextResponse.json({
      accountHolderName,
      accountNumber,
      ifscCode,
      branchName,
      upiId: upiId || "",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const records = readBankDetails();
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
