import { StackHeader } from '@/components/features/stack/StackHeader';
import { StackListPage } from '@/components/features/stack/StackListPage';
import { StackListPageLoading } from '@/components/features/stack/StackListPageLoading';
import { getAllStack } from '@/lib/api/stack';
import { Suspense } from 'react';

export async function generateMetadata() {
  return { title: `스택 시리즈` };
}

export default async function StackPage() {
  const allStackPromise = getAllStack();
  return (
    <div>
      <StackHeader />
      <Suspense fallback={<StackListPageLoading />}>
        <StackListPage promiseData={allStackPromise} />
      </Suspense>
    </div>
  );
}
