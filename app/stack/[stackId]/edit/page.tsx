import { getStackModify } from '@/lib/api/stack';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { EditStackForm } from './_components/EditStackForm';
import { EditStackFormLoading } from './_components/EditStackFormLoading';

export async function generateMetadata() {
  return { title: `스택 수정` };
}

type Params = Promise<{ stackId: string }>;

export default async function EditStackPage({ params }: { params: Params }) {
  const { stackId } = await params;
  const id = Number(stackId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const stackInitialDataPromise = getStackModify(id);
  return (
    <div className="py-4">
      <Suspense fallback={<EditStackFormLoading />}>
        <EditStackForm stackId={id} promiseData={stackInitialDataPromise} />
      </Suspense>
    </div>
  );
}
