import { fetchApi } from '../api-client';
import { ApiResponse } from '@/lib/api-client';

export interface TagItem {
  name: string;
  id: number;
}

export interface GetTagListParams {
  keyword?: string;
}

export const getTagList = async ({ keyword }: GetTagListParams = {}): Promise<TagItem[]> => {
  const params = new URLSearchParams();
  if (keyword) params.set('keyword', keyword);

  try {
    const response = await fetchApi<ApiResponse<TagItem[]>>(`/tag?${params.toString()}`);
    return response.data || [];
  } catch {
    return [];
  }
};
