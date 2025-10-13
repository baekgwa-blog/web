'use client';

import dynamic from 'next/dynamic';

const TiptapViewer = dynamic(() => import('@/components/editor/TiptapViewer'), {
  ssr: false,
});

interface PostDetailContentProps {
  content: string;
}

export function PostDetailContent({ content }: PostDetailContentProps) {
  return <TiptapViewer content={content} />;
}
