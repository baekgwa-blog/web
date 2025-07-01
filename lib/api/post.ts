import { fetchApi } from '../api-client';
import { ApiResponse } from '@/lib/api-client';
import { PostListItem, PostDetailItem, CreatePostResponse } from '@/types/post';
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

export interface CreatePostBodys {
  title: string;
  content: string;
  description: string;
  thumbnailImage: string | null;
  tagIdList: number[];
  categoryId: number;
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

export const getPostDetail = async ({ slug }: GetPostDetailParams): Promise<PostDetailItem> => {
  const params = new URLSearchParams();
  if (slug) params.set('slug', slug);

  try {
    const response = await fetchApi<ApiResponse<PostDetailItem>>(
      `/post/detail?${params.toString()}`
    );
    return response.data!;
  } catch {
    notFound();
  }
};

export const createPost = async ({
  title,
  content,
  description,
  thumbnailImage,
  tagIdList,
  categoryId,
}: CreatePostBodys): Promise<ApiResponse<CreatePostResponse>> => {
  const response = await fetchApi<ApiResponse<CreatePostResponse>>('/post', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      title,
      content,
      description,
      thumbnailImage,
      tagIdList,
      categoryId,
    }),
  });
  return response;
};
