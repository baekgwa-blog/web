'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { TagFilterItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import { use } from 'react';
import TagSectionSkeleton from './TagSectionSkeleton';

interface TagSectionProps {
  tags: Promise<TagFilterItem[]>;
  selectedTag: string;
}

export default function TagSection({ tags, selectedTag }: TagSectionProps) {
  let allTags: TagFilterItem[] = [];
  let error: Error | null = null;

  try {
    allTags = use(tags);
  } catch (e) {
    error = e as Error;
  }

  const renderContent = () => {
    if (error) {
      return <TagSectionSkeleton />;
    }

    return (
      <div className="flex flex-col gap-3">
        <Link href="/">
          <div
            className={cn(
              'hover:bg-muted-foreground/10 text-muted-foreground flex items-center justify-between rounded-md p-1.5 text-sm transition-colors',
              selectedTag === '전체' && 'bg-muted-foreground/10 text-foreground font-medium'
            )}
          >
            <span>전체</span>
          </div>
        </Link>
        {allTags.map((tag) => (
          <Link href={`?tag=${tag.name}`} key={tag.name}>
            <div
              className={cn(
                'hover:bg-muted-foreground/10 text-muted-foreground flex items-center justify-between rounded-md p-1.5 text-sm transition-colors',
                selectedTag === tag.name && 'bg-muted-foreground/10 text-foreground font-medium'
              )}
            >
              <span>{tag.name}</span>
              <span>{tag.count}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>태그 목록</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
