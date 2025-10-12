'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';

import './styles.scss';
import TiptapToolbar from './toolbar/TiptapToolbar';
import { getTiptapExtensions } from './extensions';

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
      handleKeyDown: (view, event) => {
        // Tab 키로 들여쓰기 (StarterKit 기본 기능 사용)
        if (event.key === 'Tab') {
          event.preventDefault();
          if (event.shiftKey) {
            // Shift+Tab: 리스트에서 나가기 또는 들여쓰기 감소
            if (editor?.isActive('bulletList') || editor?.isActive('orderedList')) {
              editor?.chain().focus().liftListItem('listItem').run();
            } else {
              editor?.chain().focus().liftListItem('listItem').run();
            }
          } else {
            // Tab: 리스트 들여쓰기 또는 새 리스트 항목 생성
            if (editor?.isActive('bulletList') || editor?.isActive('orderedList')) {
              editor?.chain().focus().sinkListItem('listItem').run();
            } else {
              editor?.chain().focus().sinkListItem('listItem').run();
            }
          }
          return true;
        }
        return false;
      },
    },
    extensions: getTiptapExtensions(),
    content: content,
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="flex h-full flex-col">
      {editor && <TiptapToolbar editor={editor} onImageUpload={onImageUpload} />}

      <EditorContent
        className="flex-1 overflow-y-auto rounded-b-lg border-2 border-t-0 p-4"
        editor={editor}
      />
    </div>
  );
}
