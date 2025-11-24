'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, use } from 'react';
import { useInView } from 'react-intersection-observer';
import { ApiResponse } from '@/lib/api-client';
import { PostListItem } from '@/types/post';
import { PagingResponse } from '@/types/paging';
import { PostCard } from '@/components/features/blog/main/PostCard';

interface PostListProps {
  postsPromise: Promise<ApiResponse<PagingResponse<PostListItem>>>;
}

export default function PostList({ postsPromise }: PostListProps) {
  const initialData = use(postsPromise);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');
  const keyword = searchParams.get('keyword');

  const fetchPosts = async ({ pageParam = 0 }: { pageParam?: number }) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (keyword) params.set('keyword', keyword);
    params.set('page', pageParam.toString());

    const response = await fetch(`/api/post?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts', category, sort, keyword],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.last ? undefined : lastPage.data.pageNo + 1;
    },
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
  });

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts: PostListItem[] =
    data?.pages.flatMap(
      (page: ApiResponse<PagingResponse<PostListItem>>) => page.data?.content ?? []
    ) ?? [];

  const defaultImage =
    'https://baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com/post/20251021_ddb009f3';
  const mappedPosts = allPosts.map((item) => ({
    id: String(item.id),
    title: item.title,
    description: item.description,
    coverImage: item.thumbnailImage || defaultImage,
    tags: item.tagList,
    category: item.category,
    viewCount: item.viewCount,
    author: '백과',
    date: item.createdAt,
    modifiedDate: item.modifiedAt,
    slug: item.slug,
  }));

  return (
    <div className="space-y-4">
      {mappedPosts.map((post, index) => (
        <Link href={`/blog/${post.slug}`} prefetch={false} key={post.id} className="block">
          <PostCard post={post} isFirst={index === 0} />
        </Link>
      ))}

      {hasNextPage && !isFetchingNextPage && <div ref={ref} className="h-10" />}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          <span className="text-muted-foreground text-sm">로딩 중...</span>
        </div>
      )}
    </div>
  );
}
