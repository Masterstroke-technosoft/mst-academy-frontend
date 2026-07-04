import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'node-purchases.json');

function readPurchases(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading purchases file:', error);
  }
  return [];
}

function writePurchases(data: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing purchases file:', error);
  }
}

// Generate a 24-character hexadecimal ObjectId-like string
function generateObjectId(): string {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * GET /api/node-purchase
 * Returns all purchase records. Used by admin dashboard.
 */
export async function GET(request: NextRequest) {
  try {
    const purchases = readPurchases();
    return NextResponse.json(purchases);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

/**
 * POST /api/node-purchase
 * Accepts a purchase request from the user dashboard.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract userId with fallbacks so it never fails validation due to client omission
    const userId = data.userId || request.headers.get('x-user-id') || '6a46530ca5731a44adfe5444';

    const requiredFields = [
      'accountHolderName',
      'category',
      'amountPaid',
      'paymentDate',
      'transactionId',
      'paymentMethod',
      'paymentScreenshotUrl',
    ];
    const missing = requiredFields.filter((f) => !data[f]);
    if (missing.length) {
      return NextResponse.json({ error: 'Missing fields', missing }, { status: 400 });
    }

    const now = new Date();
    const newPurchase = {
      _id: generateObjectId(),
      userId,
      accountHolderName: data.accountHolderName,
      category: data.category,
      amountPaid: Number(data.amountPaid),
      paymentDate: data.paymentDate,
      transactionId: data.transactionId,
      paymentMethod: data.paymentMethod,
      paymentScreenshotUrl: data.paymentScreenshotUrl,
      additionalNotes: data.additionalNotes || null,
      status: 'PENDING',
      rejectionNote: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      __v: 0,
    };

    const purchases = readPurchases();
    purchases.push(newPurchase);
    writePurchases(purchases);

    return NextResponse.json({
      message: 'Purchase request submitted successfully',
      purchase: newPurchase
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/node-purchase error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
