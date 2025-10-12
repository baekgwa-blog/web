'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import './styles.scss';
import { getTiptapExtensions } from './extensions';

interface TiptapViewerProps {
  content: string;
  className?: string;
}

export default function TiptapViewer({ content, className = '' }: TiptapViewerProps) {
  const editor = useEditor({
    editable: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    extensions: getTiptapExtensions({ isView: true }),
    content: content,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return <div className="bg-muted h-32 animate-pulse rounded" />;
  }

  return (
    <div className={`${className}`}>
      <EditorContent
        className="prose prose-neutral prose-sm dark:prose-invert max-w-none"
        editor={editor}
      />
    </div>
  );
}
