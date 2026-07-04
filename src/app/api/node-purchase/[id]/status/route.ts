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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, rejectionNote } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const purchases = readPurchases();
    const index = purchases.findIndex(
      (p) => p._id === id || p.id === id
    );

    if (index === -1) {
      return NextResponse.json({ error: 'Purchase request not found' }, { status: 404 });
    }

    const now = new Date();
    purchases[index] = {
      ...purchases[index],
      status,
      rejectionNote: status === 'REJECTED' ? (rejectionNote || null) : null,
      updatedAt: now.toISOString(),
    };

    writePurchases(purchases);

    return NextResponse.json({
      message: 'Status updated successfully',
      purchase: purchases[index],
    });
  } catch (err) {
    console.error('PATCH /api/node-purchase/[id]/status error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
