'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';

import './styles.scss';
import TiptapToolbar from './toolbar/TiptapToolbar';
import CustomCodeBlockLowlight from './codeBlockIndent';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Indent } from './indent';

interface TiptapEditorProps {
  content: string;
  onContentChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export default function TiptapEditor({
  content,
  onContentChange,
  onImageUpload,
}: TiptapEditorProps) {
  const insertImage = async (file: File, editor: Editor) => {
    try {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // 이미지 업로드 실패 처리
    }
  };

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
      handleDrop: (view, event) => {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file && editor) {
          insertImage(file, editor);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const file = event.clipboardData?.files[0];
        if (file && editor) {
          event.preventDefault();
          insertImage(file, editor);
          return true;
        }
        return false;
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
      }),
      Markdown,
      CustomCodeBlockLowlight,
      Image,
      Indent,
      Highlight.configure({
        HTMLAttributes: {
          class: 'highlight-yellow',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
        nested: true,
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {editor && <TiptapToolbar editor={editor} onImageUpload={onImageUpload} />}

      <EditorContent
        className="`flex-1 overflow-y-auto rounded-b-lg border-2 border-t-0 p-4"
        editor={editor}
      />
    </main>
  );
}
