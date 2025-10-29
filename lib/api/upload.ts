import { ApiResponse, fetchApi } from '@/lib/api-client';

export enum FileType {
  POST_IMAGE = 'POST_IMAGE',
  STACK_SERIES_IMAGE = 'STACK_SERIES_IMAGE',
}

export interface UploadImagePostBodys {
  file: File;
  type: FileType;
}

export interface UploadImageResponse {
  fileName: string;
  fileUrl: string;
  bucket: string;
}

export const uploadImage = async ({
  file,
  type,
}: UploadImagePostBodys): Promise<ApiResponse<UploadImageResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  return fetchApi<UploadImageResponse>('/file/image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
};
