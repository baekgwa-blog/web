import { fetchApi } from '../api-client';
import { CategoryFilterItem } from '@/types/blog';
import { ApiResponse } from '@/lib/api-client';

export interface CategoryItem {
  name: string;
  id: number;
}

export async function getCategories(): Promise<CategoryFilterItem[]> {
  try {
    const response = await fetchApi<ApiResponse<CategoryItem[]>>('/category');

    if (!response.isSuccess || !response.data) {
      return [];
    }

    // 임시로 count를 0으로 설정
    return response.data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      count: 0,
    }));
  } catch {
    return [];
  }
}
