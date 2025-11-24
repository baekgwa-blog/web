import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Eye, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/date';
import type { StackPostInfo } from '@/lib/api/stack';

const POST_DEFAULT_IMAGE_URL =
  'https://baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com/post/20251021_ddb009f3';

type Props = {
  post: StackPostInfo;
  isLast: boolean;
};

export function StackPostItem({ post, isLast }: Props) {
  const effectiveThumbnail = post.thumbnailImage || POST_DEFAULT_IMAGE_URL;

  return (
    <div>
      <Link href={`/blog/${post.slug}`} prefetch={false} className="group block">
        {/* 1. 포스트 제목 */}
        <h3 className="group-hover:text-primary truncate text-2xl font-bold transition-colors">
          <span className="text-primary/80 mr-2">{post.sequence}.</span>
          {post.title}
        </h3>

        {/* 2. 포스트 그리드 (이미지 + 내용) */}
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-[160px_1fr]">
          <div className="relative h-28 w-full shrink-0 sm:w-40">
            <Image
              src={effectiveThumbnail}
              alt={`${post.title} 썸네일`}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              style={{ objectFit: 'cover' }}
              className="rounded-md border"
            />
          </div>

          {/* 내용 (description + meta) */}
          <div className="flex flex-col justify-between">
            <p className="text-muted-foreground line-clamp-3 text-base">{post.description}</p>
            <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.modifiedAt}>{formatDate(post.modifiedAt)}</time>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* 마지막 아이템이 아닐 경우에만 Separator 추가 */}
      {!isLast && <Separator className="my-8" />}
    </div>
  );
}
