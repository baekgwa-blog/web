import { fetchApi } from '../api-client';
import { ApiResponse } from '@/lib/api-client';
import { PostListItem, PostDetailItem } from '@/types/post';
import { PagingResponse } from '@/types/paging';
import { notFound } from 'next/navigation';

export interface GetPostListParams {
  category?: string;
  sort?: string;
  page?: number;
  keyword?: string;
}

export interface GetPostDetailParams {
  slug: string;
}

export const getPostList = async ({
  category,
  sort,
  page,
  keyword,
}: GetPostListParams = {}): Promise<ApiResponse<PagingResponse<PostListItem>>> => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);
  if (page) params.set('page', page.toString());
  if (keyword) params.set('keyword', keyword);

  try {
    const response = await fetchApi<ApiResponse<PagingResponse<PostListItem>>>(
      `/post?${params.toString()}`
    );
    return response;
  } catch {
    notFound();
  }
};

export const getPostDetail = async ({
  slug,
}: GetPostDetailParams): Promise<ApiResponse<PostDetailItem>> => {
  const params = new URLSearchParams();
  if (slug) params.set('slug', slug);

  try {
    const response = await fetchApi<ApiResponse<PostDetailItem>>(
      `/post/detail?${params.toString()}`
    );
    return response;
  } catch {
    notFound();
  }
};
