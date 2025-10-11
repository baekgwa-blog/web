'use client';

import dynamic from 'next/dynamic';
import { useEffect, useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { getCategories, CategoryList } from '@/lib/api/category';
import { TagItem } from '@/lib/api/tag';
import { createPostAction } from '@/lib/actions/post';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import TagSelector from './TagSelector';
const TiptapEditor = dynamic(() => import('../editor/TiptapEditor'), {
  ssr: false,
});

export default function WritePostForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryList[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editorContent] = useState('');

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
    getCategories().then(setCategoryOptions);
  }, []);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="font-title h-16 border-none !text-3xl font-bold shadow-none focus:border-none focus:ring-0"
          aria-label="제목 입력"
          autoFocus
          value={title}
        />
        {state?.errors?.title && <p className="text-sm text-red-500">{state.errors.title[0]}</p>}
        <Input
          type="text"
          name="description"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 입력하세요"
          className="font-title h-10 border-none !text-xl font-bold shadow-none focus:border-none focus:ring-0"
          aria-label="설명 입력"
          value={description}
          autoFocus
        />
        {state?.errors?.description && (
          <p className="text-sm text-red-500">{state.errors.description[0]}</p>
        )}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="카테고리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors?.categoryId && (
          <p className="text-sm text-red-500">{state.errors.categoryId[0]}</p>
        )}
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
        <TiptapEditor content={editorContent} />
        <div className="mt-6 flex justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 hidden h-4 w-4 animate-spin" />}
            발행하기
          </Button>
        </div>
      </div>
      {/* 폼 제출을 위한 hidden input들 */}
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
