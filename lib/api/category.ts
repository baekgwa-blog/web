import { ApiResponse, fetchApi } from '@/lib/api-client';

export interface CategoryList {
  id: string;
  name: string;
  count: number;
}

export async function getCategories(): Promise<CategoryList[]> {
  try {
    const response = await fetchApi<ApiResponse<CategoryList[]>>('/category');

    if (!response.isSuccess || !response.data) {
      return [];
    }

    return response.data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      count: item.count,
    }));
  } catch {
    return [];
  }
}
