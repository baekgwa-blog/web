import { Separator } from '@/components/ui/separator';
import { getPostDetail } from '@/lib/api/post';
import { PostDetailHeader } from '@/components/features/blog/detail/PostDetailHeader';
import { PostDetailContent } from '@/components/features/blog/detail/PostDetailContent';
import { MobileToc } from '@/components/features/blog/detail/MobileToc';
import { DesktopToc } from '@/components/features/blog/detail/DesktopToc';
import { type FlatTocItem } from '@/components/features/blog/detail/TocList';
import * as cheerio from 'cheerio';
import { Metadata } from 'next';

function isTagElement(node: cheerio.Element): node is cheerio.TagElement {
  return node.type === 'tag';
}

interface BlogPostProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const response = await getPostDetail({ slug: decodedSlug });
    return {
      title: response.title,
      description: response.description,
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

// 블로그 상세 페이지 컴포넌트
export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const response = await getPostDetail({ slug: decodedSlug });

  // Cheerio를 사용해 목차(TOC) 생성
  const $ = cheerio.load(response.content);
  const headingElements = $('h1, h2, h3').toArray().filter(isTagElement);
  const toc: FlatTocItem[] = headingElements.map((heading) => ({
    id: heading.attribs.id,
    text: $(heading).text(),
    level: parseInt(heading.name.replace('h', ''), 10),
  }));

  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px] md:gap-8">
        <section>
          <PostDetailHeader
            title={response.title}
            tagList={response.tagList}
            author={response.author}
            createdAt={response.createdAt}
          />

          <Separator className="my-6 border-2" />

          {/* 모바일 목차 */}
          {toc.length > 0 && (
            <div className="mb-6 md:hidden">
              <MobileToc toc={toc} />
            </div>
          )}

          <PostDetailContent content={response.content} />

          <Separator className="my-16" />
        </section>

        {/* PC 목차 */}
        {toc.length > 0 && (
          <aside className="relative hidden md:block">
            <DesktopToc toc={toc} />
          </aside>
        )}
      </div>
    </div>
  );
}
