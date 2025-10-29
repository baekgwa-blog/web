import { ApiResponse, fetchApi } from '@/lib/api-client';

export interface CategoryList {
  id: string;
  name: string;
  count: number;
}

export async function getCategories(): Promise<ApiResponse<CategoryList[]>> {
  return fetchApi<CategoryList[]>('/category', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
