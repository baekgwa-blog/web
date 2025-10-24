import { ApiResponse, fetchApi } from '@/lib/api-client';

export interface GetStackRelativePostRequest {
  postId: number;
}

export interface GetStackRelativePostResponse {
  stackId: number;
  title: string;
  stackPostInfoList: StackPostInfo[];
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
