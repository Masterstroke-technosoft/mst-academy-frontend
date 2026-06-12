import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "withdrawal-requests.json");

function readWithdrawalRequests(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading withdrawal requests file:", error);
  }
  return [];
}

function writeWithdrawalRequests(data: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing withdrawal requests file:", error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userEmail = req.headers.get("x-user-email");
    const isAdmin = req.headers.get("x-user-role") === "admin" || req.headers.get("x-user-role") === "ADMIN";

    let requests = readWithdrawalRequests();

    // If there are no requests yet, seed with the default mock one for validator2
    if (requests.length === 0) {
      requests = [
        {
          id: "req-mock-1",
          userName: "validator2",
          email: "validator2@masterstroke.academy",
          amount: 1500,
          status: "Pending",
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          bankDetails: {
            holderName: "validator2",
            accountNumber: "918273645012",
            ifsc: "HDFC0001234",
            branch: "Koramangala, Bangalore",
            upi: "validator2@paytm"
          },
          referrals: [
            { name: "Riya S.", status: "Purchased course", eligible: true },
            { name: "Aman K.", status: "Purchased course", eligible: true },
            { name: "Neha P.", status: "Registered", eligible: false },
            { name: "Vikram T.", status: "Purchased course", eligible: true },
            { name: "Priya M.", status: "Registered", eligible: false }
          ]
        }
      ];
      writeWithdrawalRequests(requests);
    }

    // If it's a student, filter to only show their requests
    if (userId && !isAdmin) {
      requests = requests.filter((r) => r.email === userEmail);
    }

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const newRequest = await req.json();
    const requests = readWithdrawalRequests();
    
    // Remove existing requests for the same user if any, to overwrite with the new one
    const filteredRequests = requests.filter((r: any) => r.email !== newRequest.email);
    filteredRequests.push(newRequest);
    
    writeWithdrawalRequests(filteredRequests);
    return NextResponse.json({ message: "Withdrawal request saved successfully", request: newRequest });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const requests = readWithdrawalRequests();
    
    const index = requests.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      requests[index].status = status;
      writeWithdrawalRequests(requests);
      return NextResponse.json({ message: "Request updated successfully", request: requests[index] });
    }
    
    return NextResponse.json({ message: "Request not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
