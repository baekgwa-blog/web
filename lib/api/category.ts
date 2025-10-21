import { ApiResponse, fetchApi } from '@/lib/api-client';

export interface CategoryList {
  id: string;
  name: string;
  count: number | 0;
}

export async function getCategories(): Promise<CategoryList[]> {
  try {
    const response = await fetchApi<ApiResponse<CategoryList[]>>('/category');

    if (!response.isSuccess || !response.data) {
      return [];
    }

    // 임시로 count를 0으로 설정
    // todo : server 측에서 count 추가로 내려줘야함.
    return response.data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      count: 0,
    }));
  } catch {
    return [];
  }
}
