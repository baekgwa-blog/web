import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { compile } from '@mdx-js/mdx';
import withSlugs from 'rehype-slug';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import { getPostDetail } from '@/lib/api/post';
import { Clock } from 'lucide-react';

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

function TableOfContentsLink({ item }: { item: TocEntry }) {
  return (
    <div className="space-y-2">
      <Link
        key={item.id}
        href={`#${item.id}`}
        className={`hover:text-foreground text-muted-foreground block font-medium transition-colors`}
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2 pl-4">
          {item.children.map((subItem) => (
            <TableOfContentsLink key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const response = await getPostDetail({ slug: decodedSlug });

  const { data } = await compile(response.data.content, {
    rehypePlugins: [withSlugs, rehypeSanitize, withToc, withTocExport],
  });

  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px] md:gap-8">
        <section>
          {/* 블로그 헤더 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                {response.data.tagList.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">{response.data.title}</h1>
            </div>

            {/* 메타 정보 */}
            <div className="text-muted-foreground flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{response.data.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(response.data.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>5분 읽기</span>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* 모바일 전용 목차 */}
          <div className="mb-6 md:hidden">
            <details className="bg-muted/60 rounded-lg p-4 backdrop-blur-sm">
              <summary className="cursor-pointer text-lg font-semibold">목차</summary>
              <nav className="mt-3 space-y-3 text-sm">
                {data?.toc?.map((item) => <TableOfContentsLink key={item.id} item={item} />)}
              </nav>
            </details>
          </div>

          {/* 블로그 본문 */}
          <div className="prose prose-neutral prose-sm dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
            <MDXRemote
              source={response.data.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
                },
              }}
            />
          </div>
          <Separator className="my-16" />
        </section>
        <aside className="relative hidden md:block">
          <div className="sticky top-[var(--sticky-top)]">
            <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">목차</h3>
              <nav className="space-y-3 text-sm">
                {data?.toc?.map((item) => <TableOfContentsLink key={item.id} item={item} />)}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
