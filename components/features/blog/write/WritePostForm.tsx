'use client';

import dynamic from 'next/dynamic';
import { useEffect, useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { TagItem } from '@/lib/api/tag';
import { createPostAction } from '@/lib/actions/post';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import TagSelector from './TagSelector';
import CategorySelector from './CategorySelector';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FileType, uploadImage } from '@/lib/api/upload';

const TiptapEditor = dynamic(() => import('@/components/editor/TiptapEditor'), {
  ssr: false,
});

export default function WritePostForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editorContent, setEditorContent] = useState('');

  const [state, formAction, isPending] = useActionState(createPostAction, {
    message: '',
    errors: {},
    formData: {
      title: '',
      description: '',
      thumbnailImage: '',
      content: '',
      tagIdList: [],
      categoryId: 0,
    },
  });

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/blog/' + state.slug);
    }
  }, [state, router, queryClient]);

  useEffect(() => {
    const titleError = state.errors?.title?.[0];
    if (titleError) {
      toast.error(titleError, { id: 'title-error', duration: 3000 });
    } else {
      toast.dismiss('title-error');
    }
  }, [state.errors?.title]);

  useEffect(() => {
    const descriptionError = state.errors?.description?.[0];
    if (descriptionError) {
      toast.error(descriptionError, { id: 'description-error', duration: 3000 });
    } else {
      toast.dismiss('description-error');
    }
  }, [state.errors?.description]);

  const handleImageUpload = async (file: File): Promise<string> => {
    const toastId = toast.loading('이미지를 업로드하는 중입니다...');
    try {
      const { fileUrl } = await uploadImage({
        file,
        type: FileType.POST_IMAGE,
      });
      toast.success('이미지 업로드가 완료되었습니다.', { id: toastId });
      return fileUrl; // 성공 시 URL을 반환합니다.
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('이미지 업로드에 실패했습니다.', { id: toastId });
      throw new Error('Image upload failed'); // 실패 시 에러를 던집니다.
    }
  };

  return (
    <form action={formAction} className="flex h-full flex-col gap-3">
      {/* 고정 헤더 영역 */}
      <div className="flex-shrink-0 space-y-3">
        <Input
          type="text"
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className={cn(
            'font-title h-16 rounded-md border-none !text-3xl font-bold shadow-none focus:border-none focus:ring-0',
            state.errors?.title && 'ring-destructive ring-2'
          )}
          aria-label="제목 입력"
          autoFocus
          value={title}
        />

        <Input
          type="text"
          name="description"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 입력하세요"
          className={cn(
            'font-title h-10 rounded-md border-none !text-xl font-bold shadow-none focus:border-none focus:ring-0',
            state.errors?.description && 'ring-destructive ring-2'
          )}
          aria-label="설명 입력"
          value={description}
        />

        <div className="grid h-10 grid-cols-[300px_1fr] items-stretch gap-4">
          <div className="h-full">
            <CategorySelector
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              error={state?.errors?.categoryId?.[0]}
            />
          </div>
          <div className="h-full">
            <TagSelector
              selectedTags={selectedTags}
              onTagToggle={(tag) => {
                setSelectedTags((prev) =>
                  prev.some((t) => t.id === tag.id)
                    ? prev.filter((t) => t.id !== tag.id)
                    : [...prev, tag]
                );
              }}
              error={state?.errors?.tagIdList?.[0]}
            />
          </div>
        </div>
      </div>

      {/* 에디터 영역 - 남은 공간을 모두 차지 */}
      <div className="min-h-0 flex-1">
        <TiptapEditor
          content={editorContent}
          onContentChange={setEditorContent}
          onImageUpload={handleImageUpload}
        />
      </div>

      {/* 고정 푸터 영역 */}
      <div className="mt-6 flex flex-shrink-0 justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 hidden h-4 w-4 animate-spin" />}
          발행하기
        </Button>
      </div>
      <input type="hidden" name="content" value={editorContent} />
      <input
        type="hidden"
        name="tagIdList"
        value={JSON.stringify(selectedTags.map((tag) => tag.id))}
      />
      <input type="hidden" name="categoryId" value={selectedCategory} />
    </form>
  );
}
