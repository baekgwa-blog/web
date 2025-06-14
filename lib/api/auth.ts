import { fetchApi } from '../api-client';
import { ApiResponse } from '@/lib/api-client';
import { LoginRequest } from '@/types/auth';

export async function login(data: LoginRequest): Promise<boolean> {
  try {
    const response = await fetchApi<ApiResponse<null>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.isSuccess;
  } catch {
    return false;
  }
}
