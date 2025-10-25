import { StackDetailComponent } from '@/components/features/stack/StackDetailComponent';
import { StackDetailComponentLoading } from '@/components/features/stack/StackDetailLoading';
import { getStackDetail } from '@/lib/api/stack';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Params = Promise<{ stackId: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { stackId } = await params;
  const id = Number(stackId);
  try {
    const response = await getStackDetail({ stackId: id });
    return {
      title: response.data!.title,
      description: response.data!.description,
    };
  } catch {
    return {
      title: 'Not Found',
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
