'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CategorySelector from '@/components/features/blog/write/CategorySelector';
import { FileType, uploadImage } from '@/lib/api/upload';
import Image from 'next/image';
import { createNewStackAction, CreateNewStackFormState } from '@/lib/actions/stack';
import { PostNewStackPost } from '@/lib/api/stack';
import StackPostManager, { PostWithData } from './StackPostManager';

const initialState: CreateNewStackFormState = {
  message: '',
  errors: {},
  success: false,
};

export default function CreateStackForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [postListWithData, setPostListWithData] = useState<PostWithData[]>([]);
  const [stackPostList, setStackPostList] = useState<PostNewStackPost[]>([]);

  const [state, formAction, isPending] = useActionState(createNewStackAction, initialState);

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
      router.push('/stack');
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

  useEffect(() => {
    const error = state.errors?.categoryId;
    if (error) toast.error(error, { id: 'cat-err' });
    else toast.dismiss('cat-err');
  }, [state.errors?.categoryId]);

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
    categoryId: Number(selectedCategory) || 0,
    thumbnailImage,
    stackPostList,
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
        <CategorySelector
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          error={state.errors?.categoryId}
        />

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

      {/* 포스트 매니저 (검색 + 드래그앤드롭 테이블) */}
      <StackPostManager
        postList={postListWithData}
        setPostList={setPostListWithData}
        errors={state.errors?.stackPostList}
      />

      {/* 고정 푸터 영역 */}
      <div className="mt-6 flex flex-shrink-0 justify-end gap-2">
        <Button type="submit" disabled={isPending || isUploading}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          스택 발행하기
        </Button>
      </div>

      <input type="hidden" name="stackData" value={stackData} />
    </form>
  );
}
