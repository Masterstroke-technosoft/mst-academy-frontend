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
    const userId = req.headers.get("x-user-id");
    const userEmail = req.headers.get("x-user-email");

    if (!userId || !userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bankDetailsList = readBankDetails();
    const details = bankDetailsList.find((item: any) => item.userId === userId || item.userEmail === userEmail);

    if (!details) {
      return NextResponse.json(null);
    }

    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userEmail = req.headers.get("x-user-email");

    if (!userId || !userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { accountHolderName, accountNumber, ifscCode, branchName, upiId } = body;

    const bankDetailsList = readBankDetails();
    const index = bankDetailsList.findIndex((item: any) => item.userId === userId || item.userEmail === userEmail);

    if (index === -1) {
      return NextResponse.json({ message: "Bank details not found" }, { status: 404 });
    }

    // Update matching fields
    const updatedDetails = {
      ...bankDetailsList[index],
      accountHolderName: accountHolderName ?? bankDetailsList[index].accountHolderName,
      accountNumber: accountNumber ?? bankDetailsList[index].accountNumber,
      ifscCode: ifscCode ?? bankDetailsList[index].ifscCode,
      branchName: branchName ?? bankDetailsList[index].branchName,
      upiId: upiId ?? bankDetailsList[index].upiId,
      updatedAt: new Date().toISOString()
    };

    bankDetailsList[index] = updatedDetails;
    writeBankDetails(bankDetailsList);

    return NextResponse.json({
      message: "Bank details updated successfully",
      bankDetails: updatedDetails
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
