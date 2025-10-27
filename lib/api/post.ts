import { ApiResponse, fetchApi } from '@/lib/api-client';
import { PostListItem, PostDetailItem, CreatePostResponse } from '@/types/post';
import { PagingResponse } from '@/types/paging';

export interface GetPostListParams {
  category?: string;
  sort?: string;
  page?: number;
  keyword?: string;
  size?: string;
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
  size,
}: GetPostListParams = {}): Promise<ApiResponse<PagingResponse<PostListItem>>> => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);
  if (page) params.set('page', page.toString());
  if (keyword) params.set('keyword', keyword);
  if (size) params.set('size', size);

  return fetchApi<PagingResponse<PostListItem>>(`/post?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getPostDetail = async ({
  slug,
}: GetPostDetailParams): Promise<ApiResponse<PostDetailItem>> => {
  const params = new URLSearchParams();
  if (slug) params.set('slug', slug);

  return fetchApi<PostDetailItem>(`/post/detail?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createPost = async ({
  title,
  content,
  description,
  thumbnailImage,
  tagIdList,
  categoryId,
}: CreatePostBodys): Promise<ApiResponse<CreatePostResponse>> => {
  return fetchApi<CreatePostResponse>('/post', {
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
};
