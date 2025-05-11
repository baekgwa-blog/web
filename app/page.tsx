import ProfileSection from '@/app/_components/ProfileSection';
import ContactSection from '@/app/_components/ContactSection';
import HeaderSection from '@/app/_components/HeaderSection';
import { getTags } from '@/lib/notion';
import PostListSuspense from '@/components/features/blog/PostListSuspense';
import { Suspense } from 'react';
import TagSectionClient from '@/app/_components/TagSection.client';
import TagSectionSkeleton from './_components/TagSectionSkeleton';
import PostListSkeleton from '@/components/features/blog/PostListSkeleton';

interface HomeProps {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag, sort } = await searchParams;
  const selectedTag = tag || '전체';
  const selectedSort = sort || 'latest';

  const tags = getTags();

  return (
    <div className="container py-8">
      <div className="grid grid-cols-[200px_1fr_220px] gap-6">
        {/* 좌측 사이드바 */}
        <aside>
          <Suspense fallback={<TagSectionSkeleton />}>
            <TagSectionClient tags={tags} selectedTag={selectedTag} />
          </Suspense>
        </aside>
        <div className="space-y-8">
          {/* 섹션 제목 */}
          <HeaderSection selectedTag={selectedTag} />

          {/* 블로그 카드 그리드 */}
          {/* 첫번째, 이미지만 priority 처리를 위해, 인덱스 전달 */}
          <Suspense fallback={<PostListSkeleton />}>
            <PostListSuspense selectedTag={selectedTag} selectedSort={selectedSort} />
          </Suspense>
        </div>
        {/* 우측 사이드바 */}
        <aside className="flex flex-col gap-6">
          <ProfileSection />
          <ContactSection />
        </aside>
      </div>
    </div>
  );
}
