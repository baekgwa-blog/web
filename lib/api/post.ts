import { fetchApi } from '../api-client';
import { ApiResponse } from '@/lib/api-client';
import { PostListItem } from '@/types/post';
import { PagingResponse } from '@/types/paging';
import { notFound } from 'next/navigation';

export interface GetPostListParams {
  category?: string;
  sort?: string;
  page?: number;
}

export const getPostList = async ({ category, sort, page }: GetPostListParams = {}): Promise<
  ApiResponse<PagingResponse<PostListItem>>
> => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);
  if (page) params.set('page', page.toString());

  try {
    const response = await fetchApi<ApiResponse<PagingResponse<PostListItem>>>(
      `/post?${params.toString()}`
    );
    return response;
  } catch {
    notFound();
  }
};
