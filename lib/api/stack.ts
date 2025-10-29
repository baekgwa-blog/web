import { ApiResponse, fetchApi } from '@/lib/api-client';

export interface GetStackRelativePostRequest {
  postId: number;
}

export interface GetStackRelativePostResponse {
  stackId: number;
  title: string;
  stackPostInfoList: StackPostInfo[];
}

export interface GetAllStackListResponse {
  stackId: number;
  title: string;
  description: string;
  category: string;
  thumbnailImage: string;
  updatedAt: string;
  count: number;
}

export interface StackPostInfo {
  postId: number;
  title: string;
  description: string;
  slug: string;
  sequence: number;
  viewCount: number;
  createdAt: string;
  modifiedAt: string;
  thumbnailImage: string;
}

export interface GetStackDetailRequest {
  stackId: number;
}

export interface GetStackDetailResponse {
  stackId: number;
  title: string;
  description: string;
  category: string;
  thumbnailImage: string;
  stackPostInfoList: StackPostInfo[];
}

export interface PostNewStackPost {
  postId: number;
  sequence: number;
}

export interface PostNewStackRequest {
  title: string;
  description: string;
  thumbnailImage: string;
  stackPostList: PostNewStackPost[];
}

export interface PostNewStackResponse {
  stackId: number;
}

export interface GetStackPostModifyResponse {
  postId: number;
  sequence: number;
  title: string;
}

export interface GetStackModifyResponse {
  title: string;
  description: string;
  thumbnailImage: string;
  category: string;
  stackPostList: GetStackPostModifyResponse[];
}

export interface PutStackModifyRequest {
  title: string;
  description: string;
  thumbnailImage: string;
  stackPostList: PutStackPostModifyRequest[];
}

export interface PutStackPostModifyRequest {
  postId: number;
  sequence: number;
}

export interface PutStackPostModifyResponse {
  stackId: number;
}

export async function putStackModify(
  stackId: number,
  data: PutStackModifyRequest
): Promise<ApiResponse<PutStackPostModifyResponse>> {
  return fetchApi<PutStackPostModifyResponse>(`/stack/${stackId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getStackModify(
  stackId: number
): Promise<ApiResponse<GetStackModifyResponse>> {
  return fetchApi<GetStackModifyResponse>(`/stack/modify/${stackId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postStackRegister(
  data: PostNewStackRequest
): Promise<ApiResponse<PostNewStackResponse>> {
  return fetchApi<PostNewStackResponse>(`/stack`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getStackDetail(
  data: GetStackDetailRequest
): Promise<ApiResponse<GetStackDetailResponse>> {
  const { stackId } = data;
  return fetchApi<GetStackDetailResponse>(`/stack/${stackId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getStackRelativePost(
  data: GetStackRelativePostRequest
): Promise<ApiResponse<GetStackRelativePostResponse>> {
  return fetchApi<GetStackRelativePostResponse>(`/stack/post/${data.postId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getAllStack(): Promise<ApiResponse<GetAllStackListResponse[]>> {
  return fetchApi<GetAllStackListResponse[]>(`/stack`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
