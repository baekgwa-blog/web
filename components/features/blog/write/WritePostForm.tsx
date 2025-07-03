'use client';

import { useEffect, useActionState, useRef, useState } from 'react';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Editor as EditorType } from '@toast-ui/react-editor';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { uploadImage, FileType } from '@/lib/api/upload';

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
  const [tagSearch, setTagSearch] = useState('');
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

  useEffect(() => {
    getTagList({ keyword: tagSearch }).then(setTagOptions);
  }, [tagSearch]);

  const handleEditorChange = () => {
    let raw = editorRef.current?.getInstance().getMarkdown() || '';
    raw = raw.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    setEditorContent(raw);
  };

  const handleTagToggle = (tag: TagItem) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]
    );
  };

  const handleImageUpload = async (
    blob: Blob,
    callback: (url: string, altText?: string) => void
  ) => {
    try {
      const file = new File([blob], 'clipboard-image.png', { type: blob.type });
      const result = await uploadImage({ file, type: FileType.POST_IMAGE });
      callback(result.fileUrl, result.fileName);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2">
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
        <Command>
          <CommandInput placeholder="태그 검색" value={tagSearch} onValueChange={setTagSearch} />
          <CommandList className="max-h-17 overflow-y-auto">
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            {tagOptions.map((tag) => (
              <CommandItem key={tag.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedTags.some((t) => t.id === tag.id)}
                  onCheckedChange={() => {
                    // 이벤트 버블링 방지
                    event?.stopPropagation?.();
                    handleTagToggle(tag);
                  }}
                />
                <span>{tag.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
        {state?.errors?.tagIdList && (
          <p className="text-sm text-red-500">{state.errors.tagIdList[0]}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
        <Editor
          theme="dark"
          initialValue=""
          previewStyle="vertical"
          height="700px"
          initialEditType="markdown"
          useCommandShortcut={true}
          ref={editorRef}
          onChange={handleEditorChange}
          hooks={{
            addImageBlobHook: handleImageUpload,
          }}
        />
        {state?.errors?.content && (
          <p className="text-sm text-red-500">{state.errors.content[0]}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 hidden h-4 w-4 animate-spin" />}
            발행하기
          </Button>
        </div>
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
