'use client';

import { use, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import type { GetStackDetailResponse } from '@/lib/api/stack';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { ApiResponse } from '@/lib/api-client';
import { StackPostItem } from './StackPostItem';

const STACK_DEFAULT_IMAGE_URL =
  'https://baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com/stack/20251025_7db17a92';

type Props = {
  promiseData: Promise<ApiResponse<GetStackDetailResponse>>;
};

export function StackDetailComponent({ promiseData }: Props) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const response = use(promiseData);
  const stackDetail = response.data!;

  if (!stackDetail) {
    notFound();
  }

  const sortedPosts = useMemo(() => {
    return [...stackDetail.stackPostInfoList].sort((a, b) => {
      const seqA = a.sequence ?? 0;
      const seqB = b.sequence ?? 0;
      if (sortOrder === 'asc') {
        return seqA - seqB;
      } else {
        return seqB - seqA;
      }
    });
  }, [stackDetail.stackPostInfoList, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const stackThumbnail = stackDetail.thumbnailImage || STACK_DEFAULT_IMAGE_URL;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-12 pb-12">
      {/* 1. 헤더 섹션 */}
      <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-[192px_1fr]">
        <div className="relative h-28 w-full md:w-48">
          <Image
            src={stackThumbnail}
            alt={`${stackDetail.title} 썸네일`}
            fill
            className="rounded-lg border object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
          />
        </div>

        {/* 2. 오른쪽: 스택 정보 (동일) */}
        <div className="flex h-full flex-col">
          <div className="mb-2">
            <p className="text-primary text-sm font-medium">스택 시리즈</p>
          </div>
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-extrabold tracking-tight">{stackDetail.title}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSort}
              className="ml-4 w-[110px] shrink-0"
            >
              {sortOrder === 'asc' ? (
                <ArrowUp className="mr-2 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-2 h-4 w-4" />
              )}
              {sortOrder === 'asc' ? '오름차순' : '내림차순'}
            </Button>
          </div>
          <p className="text-muted-foreground mt-4 text-lg">{stackDetail.description}</p>
        </div>
      </section>

      <Separator className="my-10" />

      {/* 3. 포스트 목록 섹션 */}
      <section>
        <div className="flex flex-col">
          {sortedPosts.map((post, index) => (
            <StackPostItem
              key={post.postId}
              post={post}
              isLast={index === sortedPosts.length - 1}
            />
          ))}
        </div>
      </section>

      {sortedPosts.length === 0 && (
        <div className="text-muted-foreground py-10 text-center">
          아직 이 시리즈에 게시물이 없습니다.
        </div>
      )}
    </main>
  );
}
