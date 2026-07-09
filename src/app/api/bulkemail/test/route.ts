import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const headers: Record<string, string> = {};
    
    // Copy auth headers only — let fetch compute content-length for FormData
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');
    if (authHeader) headers['authorization'] = authHeader;
    if (cookieHeader) headers['cookie'] = cookieHeader;
    
    const response = await fetch(`${BACKEND_BASE_URL}/api/email/test`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in test email proxy:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
