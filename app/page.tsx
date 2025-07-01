import { getCategories } from '@/lib/api/category';
import { Suspense } from 'react';
import CategorySectionClient from '@/components/features/category/CategorySection.client';
import CategorySectionSkeleton from '@/components/features/category/CategorySectionSkeleton';
import { getPostList } from '@/lib/api/post';
import BlogMainHeaderSection from '@/components/features/blog/main/BlogMainHeaderSection';
import PostListSkeleton from '@/components/features/blog/main/PostListSkeleton';
import PostListSuspense from '@/components/features/blog/main/PostListSuspense';

interface HomeProps {
  searchParams: Promise<{ category?: string; sort?: string; keyword?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, sort, keyword } = await searchParams;
  const categories = getCategories();
  const postsPromise = getPostList({ category: category, sort: sort, page: 0, keyword: keyword });

  return (
    <div className="container py-8">
      {/* 메인페이지 헤더 섹션, 추후 검색 추가 */}
      <div className="mb-8">
        <BlogMainHeaderSection />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        {/* 좌측 사이드바 */}
        <aside className="order-1 md:order-none">
          <Suspense fallback={<CategorySectionSkeleton />}>
            <CategorySectionClient categories={categories} selectedCategory={category} />
          </Suspense>
        </aside>
        <div className="order-2 space-y-8 md:order-none">
          {/* 블로그 카드 그리드 */}
          <Suspense fallback={<PostListSkeleton />}>
            <PostListSuspense postsPromise={postsPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
