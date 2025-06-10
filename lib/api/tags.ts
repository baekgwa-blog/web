import { fetchApi } from '../api-client';
import { TagFilterItem } from '@/types/blog';

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}

export interface CategoryItem {
  name: string;
  id: number;
}

export async function getTags(): Promise<TagFilterItem[]> {
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
