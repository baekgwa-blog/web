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
    <Suspense fallback={<StackListPageLoading />}>
      <StackListPage promiseData={allStackPromise} />
    </Suspense>
  );
}
