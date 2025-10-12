'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';

import styles from './TiptapEditor.module.scss';
import TiptapToolbar from './toolbar/TiptapToolbar';

export default function TiptapEditor() {
  const [text, setText] = useState('Hello World!');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
      }),
      Markdown,
    ],
    content: text,
    onUpdate({ editor }) {
      setText(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <main className={`${styles.main} flex flex-1 flex-col overflow-hidden`}>
      {editor && <TiptapToolbar editor={editor} />}
      <EditorContent
        className="flex-1 overflow-y-auto rounded-b-lg border-2 border-t-0 p-4"
        editor={editor}
      />
    </main>
  );
}
