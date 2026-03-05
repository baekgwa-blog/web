const API_URL = process.env.NEXT_PUBLIC_API_SERVER_URL || 'https://blog.api.baekgwa.site';

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function fetchApi<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (typeof window === 'undefined') {
    const { cookies, headers: nextHeaders } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join('; ');

    if (cookieHeader) {
      headers.set('Cookie', cookieHeader);
    }

    const headerStore = await nextHeaders();
    const forwardedFor = headerStore.get('x-forwarded-for');
    const realIp = headerStore.get('x-real-ip');
    const userAgent = headerStore.get('user-agent');

    if (forwardedFor) {
      headers.set('X-Forwarded-For', forwardedFor);
    }
    if (realIp) {
      headers.set('X-Real-IP', realIp);
    }
    if (userAgent) {
      headers.set('User-Agent', userAgent);
    }
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: headers,
    credentials: 'include',
  };

  const response = await fetch(`${API_URL}${endpoint}`, finalOptions);

  if (response.ok) {
    return response.json() as Promise<ApiResponse<T>>;
  }

  const errBody = await response.json().catch(() => null);
  const message = errBody?.message ?? response.statusText;
  const code = errBody?.code ?? response.status.toString();
  throw new ApiError(response.status, message, code);
}
