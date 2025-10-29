'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileType, uploadImage } from '@/lib/api/upload';
import Image from 'next/image';
import { updateStackAction, UpdateStackFormState } from '@/lib/actions/stack';
import { PostNewStackPost } from '@/lib/api/stack';
import StackPostManager, { PostWithData } from '@/components/features/stack/StackPostManager';

type InitialDataProps = {
  title: string;
  description: string;
  thumbnailImage: string;
  categoryName: string;
  postList: PostWithData[];
};

type Props = {
  stackId: number;
  initialData: InitialDataProps;
};

const initialState: UpdateStackFormState = {
  message: '',
  errors: {},
  success: false,
};

export function EditStackFormClient({ stackId, initialData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [thumbnailImage, setThumbnailImage] = useState(initialData.thumbnailImage);
  const [isUploading, setIsUploading] = useState(false);
  const [postListWithData, setPostListWithData] = useState<PostWithData[]>(initialData.postList);
  const [stackPostList, setStackPostList] = useState<PostNewStackPost[]>([]);

  const [state, formAction, isPending] = useActionState(
    updateStackAction.bind(null, stackId),
    initialState
  );

  useEffect(() => {
    const minimalList = postListWithData.map((p) => ({
      postId: p.postId,
      sequence: p.sequence,
    }));
    setStackPostList(minimalList);
  }, [postListWithData]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      queryClient.invalidateQueries({ queryKey: ['stacks'] });
      queryClient.invalidateQueries({
        queryKey: ['stackDetail', state.stackId],
      });
      if (state.stackId) {
        router.push(`/stack/${state.stackId}`);
      } else {
        router.push('/stack');
      }
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state, router, queryClient]);

  useEffect(() => {
    const error = state.errors?.title;
    if (error) toast.error(error, { id: 'title-err' });
    else toast.dismiss('title-err');
  }, [state.errors?.title]);

  useEffect(() => {
    const error = state.errors?.description;
    if (error) toast.error(error, { id: 'desc-err' });
    else toast.dismiss('desc-err');
  }, [state.errors?.description]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('썸네일을 업로드 중입니다...');
    try {
      const response = await uploadImage({
        file,
        type: FileType.STACK_SERIES_IMAGE,
      });
      setThumbnailImage(response.data!.fileUrl);
      toast.success('업로드 완료', { id: toastId });
    } catch {
      toast.error('업로드 실패', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const stackData = JSON.stringify({
    title,
    description,
    thumbnailImage,
    stackPostList,
  });

  return (
    <form action={formAction.bind(stackId)} className="flex flex-col gap-4">
      <Input
        type="text"
        name="title_display"
        placeholder="스택 시리즈 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={cn('h-12 !text-2xl font-bold', state.errors?.title && 'ring-destructive ring-2')}
      />

      <Input
        type="text"
        name="description_display"
        placeholder="스택에 대한 한 줄 설명을 입력하세요."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={cn(state.errors?.description && 'ring-destructive ring-2')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border-input bg-background text-muted-foreground flex h-10 items-center rounded-md border px-3 py-2 text-sm">
          카테고리: {initialData.categoryName}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={isUploading}
            className="flex-1"
          />
          {thumbnailImage && (
            <Image
              src={thumbnailImage}
              alt="썸네일 미리보기"
              width={40}
              height={40}
              className="h-10 w-10 rounded object-cover"
            />
          )}
        </div>
      </div>

      <StackPostManager
        postList={postListWithData}
        setPostList={setPostListWithData}
        errors={state.errors?.stackPostList}
      />

      <div className="mt-6 flex flex-shrink-0 justify-end gap-2">
        <Button type="submit" disabled={isPending || isUploading}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          스택 수정하기
        </Button>
      </div>

      <input type="hidden" name="stackData" value={stackData} />
    </form>
  );
}
