import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CustomCodeBlockLowlight from './codeBlockIndent';

export const getTiptapExtensions = ({ isView = false }: { isView?: boolean } = {}) => {
  const baseExtensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Link.extend({ inclusive: false }).configure({
      openOnClick: false,
    }),
    CustomCodeBlockLowlight,
    Image,
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
  ];

  if (!isView) {
    return [...baseExtensions, Markdown];
  }

  return baseExtensions;
};
