import * as cheerio from 'cheerio';
import { Separator } from '@/components/ui/separator';
import { PostDetailHeader } from './PostDetailHeader';
import { PostDetailContent } from './PostDetailContent';
import { MobileToc } from './MobileToc';
import { DesktopToc } from './DesktopToc';
import { PostStackContent } from './PostStackContent';
import { PostViewTracker } from './PostViewTracker';
import { type FlatTocItem } from './TocList';
import { PostDetailItem } from '@/types/post';
import { getStackRelativePost } from '@/lib/api/stack';

function isTagElement(node: cheerio.Element): node is cheerio.TagElement {
  return node.type === 'tag';
}

interface BlogPostDetailProps {
  postDetail: PostDetailItem;
  slug: string;
}

export async function BlogPostDetail({ postDetail, slug }: BlogPostDetailProps) {
  const stackResponse = await getStackRelativePost({ postId: postDetail.id });

  const $ = cheerio.load(postDetail.content);
  const headingElements = $('h1, h2, h3').toArray().filter(isTagElement);
  const toc: FlatTocItem[] = headingElements.map((heading) => ({
    id: heading.attribs.id,
    text: $(heading).text(),
    level: parseInt(heading.name.replace('h', ''), 10),
  }));

  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <PostViewTracker slug={slug} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px] md:gap-8">
        <section>
          <PostDetailHeader
            title={postDetail.title}
            tagList={postDetail.tagList}
            author={postDetail.author}
            createdAt={postDetail.createdAt}
          />
          <Separator className="my-6 border-2" />
          {toc.length > 0 && (
            <div className="mb-6 md:hidden">
              <MobileToc toc={toc} />
            </div>
          )}
          <PostStackContent stackResponse={stackResponse} currentPostId={postDetail.id} />
          <PostDetailContent content={postDetail.content} />
          <Separator className="my-16" />
        </section>

        {toc.length > 0 && (
          <aside className="relative hidden md:block">
            <DesktopToc toc={toc} />
          </aside>
        )}
      </div>
    </div>
  );
}
