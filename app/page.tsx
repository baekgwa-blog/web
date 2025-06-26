import { getPublishedPosts } from '@/lib/notion';
import { getCategories } from '@/lib/api/category';
import HeaderSection from '@/app/_components/HeaderSection';
import PostListSuspense from '@/components/features/blog/PostListSuspense';
import { Suspense } from 'react';
import CategorySectionClient from '@/components/features/category/CategorySection.client';
import CategorySectionSkeleton from '@/components/features/category/CategorySectionSkeleton';
import PostListSkeleton from '@/components/features/blog/PostListSkeleton';

interface HomeProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, sort } = await searchParams;
  const selectedCategory = category || '전체';
  const selectedSort = sort || 'latest';

  const categories = getCategories();
  const postsPromise = getPublishedPosts({ tag: selectedCategory, sort: selectedSort });

  return (
    <div className="container py-8">
      {/* 메인페이지 헤더 섹션, 추후 검색 추가 */}
      <div className="mb-8">
        <HeaderSection selectedCategory={selectedCategory} />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        {/* 좌측 사이드바 */}
        <aside className="order-1 md:order-none">
          <Suspense fallback={<CategorySectionSkeleton />}>
            <CategorySectionClient categories={categories} selectedCategory={selectedCategory} />
          </Suspense>
        </aside>
        <div className="order-2 space-y-8 md:order-none">
          {/* 블로그 카드 그리드 */}
          <Suspense fallback={<PostListSkeleton />}>
            <PostListSuspense postsPromise={postsPromise} />
          </Suspense>
        </div>
        {/* 우측 사이드바 */}
        {/* <aside className="flex flex-col gap-6">
          <ProfileSection />
          <ContactSection />
        </aside> */}
      </div>
    </div>
  );
}
