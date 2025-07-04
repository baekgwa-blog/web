import { Separator } from '@/components/ui/separator';
import rehypeSanitize from 'rehype-sanitize';
import { compile } from '@mdx-js/mdx';
import withSlugs from 'rehype-slug';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import { getPostDetail } from '@/lib/api/post';
import { PostDetailHeader } from '@/components/features/blog/detail/PostDetailHeader';
import { PostDetailContent } from '@/components/features/blog/detail/PostDetailContent';
import { PostDetailToc } from '@/components/features/blog/detail/PostDetailToc';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const response = await getPostDetail({ slug: decodedSlug });

  const { data } = await compile(response.content, {
    rehypePlugins: [withSlugs, rehypeSanitize, withToc, withTocExport],
  });

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

          {/* 모바일 전용 목차 */}
          <div className="mb-6 md:hidden">
            <details className="bg-muted/60 rounded-lg p-4 backdrop-blur-sm">
              <summary className="cursor-pointer text-lg font-semibold">목차</summary>
              <div className="mt-3">
                <PostDetailToc toc={data?.toc || []} />
              </div>
            </details>
          </div>

          {/* 블로그 본문 */}
          <PostDetailContent content={response.content} />

          <Separator className="my-16" />
        </section>
        {/* PC화면 목차 */}
        <aside className="relative hidden md:block">
          <div className="sticky top-[var(--sticky-top)]">
            <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">목차</h3>
              <PostDetailToc toc={data?.toc || []} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
