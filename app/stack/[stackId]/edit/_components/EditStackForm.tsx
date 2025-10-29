import { PostWithData } from '@/components/features/stack/StackPostManager';
import { ApiResponse } from '@/lib/api-client';
import { GetStackModifyResponse } from '@/lib/api/stack';
import { use } from 'react';
import { EditStackFormClient } from './EditStackFormClient';

type Props = {
  stackId: number;
  promiseData: Promise<ApiResponse<GetStackModifyResponse>>;
};

export function EditStackForm({ stackId, promiseData }: Props) {
  const response = use(promiseData);
  const stackInitialData = response.data!;

  const initialPostList: PostWithData[] = stackInitialData.stackPostList
    .map((post) => ({
      postId: post.postId,
      title: post.title,
      sequence: post.sequence,
    }))
    .sort((a, b) => a.sequence - b.sequence);

  const initialDataForClient = {
    title: stackInitialData.title,
    description: stackInitialData.description,
    thumbnailImage: stackInitialData.thumbnailImage,
    categoryName: stackInitialData.category,
    postList: initialPostList,
  };

  return <EditStackFormClient stackId={stackId} initialData={initialDataForClient} />;
}
