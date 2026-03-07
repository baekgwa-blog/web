import { getPostDetail } from '@/lib/api/post';
import { BlogPostDetail } from '@/components/features/blog/detail/BlogPostDetail';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.baekgwa.site';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const response = await getPostDetail({ slug: decodedSlug });

    if (!response.data) {
      return {
        title: 'Post Not Found',
      };
    }

    const { title, description, thumbnailImage } = response.data;
    const url = `${baseUrl}/blog/${slug}`;
    const imageUrl =
      thumbnailImage ||
      `https://baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com/post/20251021_ddb009f3`;

    return {
      title,
      description,
      openGraph: {
        type: 'article',
        url,
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let postDetail;
  try {
    const response = await getPostDetail({ slug: decodedSlug });
    postDetail = response.data!;
  } catch {
    notFound();
  }

  return <BlogPostDetail postDetail={postDetail} slug={decodedSlug} />;
}
