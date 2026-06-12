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

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") || "6a23f5b2dd1a0b2bf3c3cfc3";
    const userName = req.headers.get("x-user-name") || "Demo Admin";
    const userEmail = req.headers.get("x-user-email") || "abc111@gmail.com";

    const records = readBankDetails();
    const found = records.find((r) => r.userId === userId);

    if (!found) {
      return NextResponse.json({
        _id: "6a2bebdd" + Math.random().toString(16).slice(2, 18),
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        upiId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      });
    }

    return NextResponse.json({
      _id: found._id,
      userId: found.userId,
      userName: found.userName || userName,
      userEmail: found.userEmail || userEmail,
      accountHolderName: found.accountHolderName,
      accountNumber: found.accountNumber,
      ifscCode: found.ifscCode,
      branchName: found.branchName,
      upiId: found.upiId,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      __v: found.__v || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountHolderName, accountNumber, ifscCode, branchName, upiId } = body;

    const userId = req.headers.get("x-user-id") || "6a23f5b2dd1a0b2bf3c3cfc3";
    const userName = req.headers.get("x-user-name") || "Demo Admin";
    const userEmail = req.headers.get("x-user-email") || "abc111@gmail.com";

    const records = readBankDetails();
    const existingIndex = records.findIndex((r) => r.userId === userId);

    const now = new Date().toISOString();
    let record;

    if (existingIndex >= 0) {
      record = records[existingIndex];
      record.accountHolderName = accountHolderName ?? record.accountHolderName;
      record.accountNumber = accountNumber ?? record.accountNumber;
      record.ifscCode = ifscCode ?? record.ifscCode;
      record.branchName = branchName ?? record.branchName;
      record.upiId = upiId ?? record.upiId;
      record.updatedAt = now;
      records[existingIndex] = record;
    } else {
      record = {
        _id: "6a2bebdd" + Math.random().toString(16).slice(2, 18),
        userId,
        userName,
        userEmail,
        accountHolderName: accountHolderName || "",
        accountNumber: accountNumber || "",
        ifscCode: ifscCode || "",
        branchName: branchName || "",
        upiId: upiId || "",
        createdAt: now,
        updatedAt: now,
        __v: 0,
      };
      records.push(record);
    }

    writeBankDetails(records);

    return NextResponse.json({
      message: "Bank details updated successfully",
      bankDetails: {
        _id: record._id,
        userId: record.userId,
        userName: record.userName || userName,
        userEmail: record.userEmail || userEmail,
        accountHolderName: record.accountHolderName,
        accountNumber: record.accountNumber,
        ifscCode: record.ifscCode,
        branchName: record.branchName,
        upiId: record.upiId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        __v: record.__v || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  // Allow POST /api/bank-details/me as fallback
  return PATCH(req);
}
