import { ApiResponse, fetchFormApi } from '@/lib/api-client';

export enum FileType {
  POST_IMAGE = 'POST_IMAGE',
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
}: UploadImagePostBodys): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetchFormApi<ApiResponse<UploadImageResponse>>('/file/image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  return response.data!;
};
