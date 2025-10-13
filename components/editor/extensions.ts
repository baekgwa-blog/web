import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Heading from '@tiptap/extension-heading';
import CustomCodeBlockLowlight from './codeBlockIndent';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\uac00-\ud7a3-]/g, '')
    .replace(/--+/g, '-');
};

export const getTiptapExtensions = ({ isView = false }: { isView?: boolean } = {}) => {
  const baseExtensions = [
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      link: false,
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Heading.configure({
      levels: [1, 2, 3],
    }).extend({
      renderHTML({ node, HTMLAttributes }) {
        const level = node.attrs.level;
        const id = slugify(node.textContent);
        return [`h${level}`, { ...HTMLAttributes, id }, 0];
      },
    }),
    Link.extend({ inclusive: false }).configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
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
