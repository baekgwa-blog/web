'use client';

import Link from 'next/link';

export interface FlatTocItem {
  id: string;
  text: string;
  level: number;
}

interface PostTocProps {
  toc: FlatTocItem[];
  className?: string;
}

export function PostDetailToc({ toc, className = '' }: PostTocProps) {
  return (
    <nav className={`space-y-2 ${className}`}>
      {toc.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
          style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
        >
          {item.text}
        </Link>
      ))}
    </nav>
  );
}
