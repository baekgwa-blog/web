'use client';

import { useEffect, useActionState, useRef, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { getCategories, CategoryList } from '@/lib/api/category';
import { getTagList, TagItem } from '@/lib/api/tag';
import { createPostAction } from '@/lib/actions/post';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Editor as EditorType } from '@toast-ui/react-editor';

const Editor = dynamic(() => import('@toast-ui/react-editor').then((mod) => mod.Editor), {
  ssr: false,
});

export default function WritePostForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = useRef<EditorType>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagOptions, setTagOptions] = useState<TagItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryList[]>([]);
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
    getCategories().then(setCategoryOptions);
  }, []);

  const handleEditorChange = () => {
    setEditorContent(editorRef.current?.getInstance().getMarkdown() || '');
  };

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2">
        {state?.message && (
          <Alert className={`mb-6 ${state.errors ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <Input
          type="text"
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="h-20 border-none font-bold shadow-none focus:border-none focus:ring-0 md:text-4xl"
          aria-label="제목 입력"
          autoFocus
          value={title}
          required
        />
        {state?.errors?.title && <p className="text-sm text-red-500">{state.errors.title[0]}</p>}
        <Input
          type="text"
          name="description"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 입력하세요"
          className="h-14 border-none font-bold shadow-none focus:border-none focus:ring-0 md:text-2xl"
          aria-label="설명 입력"
          value={description}
          autoFocus
          required
        />
        {state?.errors?.description && (
          <p className="text-sm text-red-500">{state.errors.description[0]}</p>
        )}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
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
        <Editor
          theme="dark"
          initialValue=""
          previewStyle="vertical"
          height="500px"
          initialEditType="markdown"
          useCommandShortcut={true}
          ref={editorRef}
          onChange={handleEditorChange}
        />
        <div className="mt-6 flex justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 hidden h-4 w-4 animate-spin" />}
            발행하기
          </Button>
        </div>
      </div>
      {/* hidden input으로 FormData에 값 포함시키기 */}
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
