// BuildFlow Pro AI - Web API Client
// =================================

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('buildflow_token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error ?? errorData.message ?? `HTTP ${response.status}` };
    }

    const data = (await response.json()) as T;
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<{
      accessToken: string;
      user: { id: string; email: string; name: string };
      org: { id: string; name: string; slug: string };
    }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('buildflow_token', token);
  }
}

