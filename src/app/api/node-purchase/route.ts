// src/app/api/node-purchase/route.ts
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';

// In-memory store for demo purposes. In a real app, replace with DB integration.
const purchases: Record<string, any>[] = [];

/**
 * GET /api/node-purchase
 * Returns all purchase records. Used by admin dashboard.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(purchases);
}

/**
 * POST /api/node-purchase
 * Accepts a purchase request from the user dashboard.
 * Expected payload fields (all required unless noted):
 *   - userId
 *   - accountHolderName
 *   - category
 *   - amountPaid
 *   - paymentDate
 *   - transactionId
 *   - paymentMethod
 *   - paymentScreenshotUrl (base64 string or URL)
 *   - additionalNotes (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const requiredFields = [
      'userId',
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
      _id: randomUUID(),
      ...data,
      amountPaid: Number(data.amountPaid),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      __v: 0,
      status: 'PENDING',
      rejectionNote: null,
    };
    purchases.push(newPurchase);

    return NextResponse.json({ message: 'Purchase request submitted successfully', purchase: newPurchase }, { status: 201 });
  } catch (err) {
    console.error('POST /api/node-purchase error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
