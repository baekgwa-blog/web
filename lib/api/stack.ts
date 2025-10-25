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
  createdAt: string;
  count: number;
}

export interface StackPostInfo {
  postId: number;
  title: string;
  slug: string;
  sequence: number;
}

export async function getStackRelativePost(
  data: GetStackRelativePostRequest
): Promise<ApiResponse<GetStackRelativePostResponse>> {
  return fetchApi<ApiResponse<GetStackRelativePostResponse>>(`/stack/post/${data.postId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getAllStack(): Promise<ApiResponse<GetAllStackListResponse[]>> {
  return fetchApi<ApiResponse<GetAllStackListResponse[]>>(`/stack`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
