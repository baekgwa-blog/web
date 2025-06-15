import { fetchApi } from '../api-client';
import { ApiResponse } from '@/lib/api-client';
import { LoginRequest } from '@/types/auth';

export async function postLogin(data: LoginRequest): Promise<boolean> {
  const response = await fetchApi<ApiResponse<null>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });

  return response.isSuccess;
}

export async function postLogout(): Promise<boolean> {
  try {
    const response = await fetchApi<ApiResponse<null>>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    return response.isSuccess;
  } catch {
    return false;
  }
}
