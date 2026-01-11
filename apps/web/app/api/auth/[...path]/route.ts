// BuildFlow Pro AI - Auth API Routes (Next.js proxy)

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, 'POST', path);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, 'GET', path);
}

async function proxyRequest(request: NextRequest, method: string, pathParts: string[]) {
  try {
    const apiPath = `/v1/auth/${pathParts.join('/')}`;
    const url = `${API_URL}${apiPath}${request.nextUrl.search}`;

    const headers: Record<string, string> = {};
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      headers['Content-Type'] = 'application/json';
    }

    const body =
      method === 'POST' && contentType.includes('application/json')
        ? JSON.stringify(await request.json())
        : undefined;

    const response = await fetch(url, { method, headers, body });

    // Forward status + JSON
    const data = await response.json().catch(() => ({}));

    const nextRes = NextResponse.json(data, { status: response.status });

    // If this is login and we got an accessToken, set cookie for server-side proxies
    if (method === 'POST' && pathParts.join('/') === 'login' && response.ok) {
      const accessToken = (data as any)?.accessToken as string | undefined;
      if (accessToken) {
        nextRes.cookies.set('auth-token', accessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          path: '/',
        });
      }
    }

    return nextRes;
  } catch (error) {
    // This is the common Netlify case: API URL not configured or API unreachable
    const message =
      error instanceof Error ? error.message : 'Network error';
    return NextResponse.json(
      {
        error:
          `Unable to reach the API backend. ` +
          `Set NEXT_PUBLIC_API_URL in Netlify to your deployed API base URL. ` +
          `(${message})`,
      },
      { status: 502 }
    );
  }
}

