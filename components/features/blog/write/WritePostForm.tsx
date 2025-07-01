'use client';

import { useEffect, useActionState, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { getCategories } from '@/lib/api/category';
import { getTagList } from '@/lib/api/tag';
import { createPostAction } from '@/lib/actions/post';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Editor = dynamic(() => import('@toast-ui/react-editor').then((mod) => mod.Editor), {
  ssr: false,
});

export default function WritePostForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const [state, formAction, isPending] = useActionState(createPostAction, {
    message: '',
    errors: {},
    formData: {
      title: '',
      tag: '',
      content: '',
    },
  });

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/blog/' + state.slug);
    }
  }, [state, router, queryClient]);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-6 space-y-4">
        {state?.message && (
          <Alert className={`mb-6 ${state.errors ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="h-20 border-none font-bold shadow-none focus:border-none focus:ring-0 md:text-4xl"
          aria-label="제목 입력"
          autoFocus
          defaultValue={state?.formData?.title}
        />
        {state?.errors?.title && <p className="text-sm text-red-500">{state.errors.title[0]}</p>}
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 입력하세요"
          className="h-14 border-none font-bold shadow-none focus:border-none focus:ring-0 md:text-2xl"
          aria-label="설명 입력"
          defaultValue={state?.formData?.description}
          autoFocus
        />
        {state?.errors?.description && (
          <p className="text-sm text-red-500">{state.errors.description[0]}</p>
        )}
      </div>
      <div>
        <Editor
          theme="dark"
          initialValue=""
          previewStyle="vertical"
          height="500px"
          initialEditType="markdown"
          useCommandShortcut={true}
          ref={editorRef}
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button disabled={isPending}>
          {isPending && <Loader2 className="mr-2 hidden h-4 w-4 animate-spin" />}
          발행하기
        </Button>
      </div>
    </form>
  );
}
