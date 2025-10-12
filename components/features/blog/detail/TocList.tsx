'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Hash } from 'lucide-react';
import { throttle } from 'lodash-es';

export interface FlatTocItem {
  id: string;
  text: string;
  level: number;
}

interface TocListProps {
  toc: FlatTocItem[];
}

export function TocList({ toc }: TocListProps) {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id || null);
  const headerOffsetRef = useRef(100);
  const handleScroll = useCallback(() => {
    let currentId: string | null = null;
    for (const item of toc) {
      const element = document.getElementById(item.id);
      if (element) {
        if (element.getBoundingClientRect().top <= headerOffsetRef.current) {
          currentId = item.id;
        } else {
          break;
        }
      }
    }
    setActiveId(currentId);
  }, [toc]);

  const throttledScroll = useCallback(throttle(handleScroll, 100), [handleScroll]);

  useEffect(() => {
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerOffsetRef.current = headerElement.offsetHeight + 20;
    }

    window.addEventListener('scroll', throttledScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [throttledScroll, handleScroll]);

  const handleLinkClick = (id: string) => {
    setActiveId(id);
  };

  return (
    <ul className="space-y-2">
      {toc.map(({ id, text, level }) => {
        const isActive = activeId === id;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={() => handleLinkClick(id)}
              className={cn(
                'hover:text-primary flex items-center gap-2 transition-colors',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
              style={{ paddingLeft: `${(level - 1) * 1}rem` }}
            >
              <Hash
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span className="truncate">{text}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
