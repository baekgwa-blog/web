import { StackDetailComponent } from '@/components/features/stack/StackDetailComponent';
import { StackDetailComponentLoading } from '@/components/features/stack/StackDetailLoading';
import { getStackDetail } from '@/lib/api/stack';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

type Params = Promise<{ stackId: string }>;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.baekgwa.site';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { stackId } = await params;
  const id = Number(stackId);

  try {
    const response = await getStackDetail({ stackId: id });

    if (!response.data) {
      return {
        title: 'Not Found',
      };
    }

    const { title, description, thumbnailImage } = response.data;
    const url = `${baseUrl}/stack/${stackId}`;
    const imageUrl =
      thumbnailImage ||
      `https://baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com/post/20251021_ddb009f3`;

    return {
      title,
      description,
      openGraph: {
        type: 'website',
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
      title: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function StackDetail({ params }: { params: Params }) {
  const { stackId } = await params;
  const id = Number(stackId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const stackDetailPromise = getStackDetail({ stackId: id });

  return (
    <Suspense fallback={<StackDetailComponentLoading />}>
      <StackDetailComponent promiseData={stackDetailPromise} />
    </Suspense>
  );
}
