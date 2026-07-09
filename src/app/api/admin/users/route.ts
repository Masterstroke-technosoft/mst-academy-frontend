import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

console.log('[Admin Users Proxy] Route file loaded!');
console.log('[Admin Users Proxy] BACKEND_BASE_URL:', BACKEND_BASE_URL);

export async function GET(req: NextRequest) {
  console.log('[Admin Users Proxy] Incoming GET request!');
  console.log('[Admin Users Proxy] Request URL:', req.url);
  
  try {
    const searchParams = req.nextUrl.searchParams;
    console.log('[Admin Users Proxy] Search params:', searchParams.toString());
    const headers: Record<string, string> = {};
    
    // Copy all headers
    for (const [key, value] of req.headers.entries()) {
      headers[key] = value;
    }
    console.log('[Admin Users Proxy] Request headers (filtered):', { ...headers, cookie: headers.cookie ? '<hidden>' : 'none' });
    
    const backendUrl = `${BACKEND_BASE_URL}/admin/users?${searchParams.toString()}`;
    console.log('[Admin Users Proxy] Forwarding to backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    });

    console.log('[Admin Users Proxy] Backend response status:', response.status, response.statusText);
    const data = await response.json();
    console.log('[Admin Users Proxy] Backend response data:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Admin Users Proxy] Error in admin users proxy:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
