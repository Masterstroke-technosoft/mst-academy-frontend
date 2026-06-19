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
    const userId = req.headers.get("x-user-id");
    const userEmail = req.headers.get("x-user-email");
    const userName = req.headers.get("x-user-name");

    if (!userId || !userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { accountHolderName, accountNumber, ifscCode, branchName, upiId } = body;

    if (!accountHolderName || !accountNumber || !ifscCode || !branchName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const bankDetailsList = readBankDetails();
    
    // Remove existing details for the same user to ensure unique entry
    const filteredList = bankDetailsList.filter((item: any) => item.userId !== userId && item.userEmail !== userEmail);

    const newDetails = {
      _id: "6a2bebdd" + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
      userId,
      userName: userName || "Demo Admin",
      userEmail,
      accountHolderName,
      accountNumber,
      ifscCode,
      branchName,
      upiId: upiId || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };

    filteredList.push(newDetails);
    writeBankDetails(filteredList);

    return NextResponse.json(newDetails);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
