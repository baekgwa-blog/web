import TagSection from '@/app/_components/TagSection';
import ProfileSection from '@/app/_components/ProfileSection';
import ContactSection from '@/app/_components/ContactSection';
import HeaderSection from './_components/HeaderSection';
import PostList from '@/components/features/blog/PostList';
import { getPublishedPosts, getTags } from '@/lib/notion';

interface HomeProps {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag, sort } = await searchParams;
  const selectedTag = tag || '전체';
  const selectedSort = sort || 'latest';

  const [posts, tags] = await Promise.all([
    getPublishedPosts(selectedTag, selectedSort),
    getTags(),
  ]);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-[200px_1fr_220px] gap-6">
        {/* 좌측 사이드바 */}
        <aside>
          <TagSection tags={tags} selectedTag={selectedTag} />
        </aside>
        <div className="space-y-8">
          {/* 섹션 제목 */}
          <HeaderSection selectedTag={selectedTag} />

          {/* 블로그 카드 그리드 */}
          {/* 첫번째, 이미지만 priority 처리를 위해, 인덱스 전달 */}
          <PostList posts={posts} />
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
