import { ApiResponse, fetchApi } from '../api-client';

export interface TagItem {
  name: string;
  id: number;
}

export interface GetTagListParams {
  keyword?: string;
}

export const getTagList = async ({ keyword }: GetTagListParams = {}): Promise<
  ApiResponse<TagItem[]>
> => {
  const params = new URLSearchParams();
  if (keyword) params.set('keyword', keyword);

  return fetchApi<TagItem[]>(`/tag?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
