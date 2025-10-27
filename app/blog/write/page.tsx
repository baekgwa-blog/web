import WritePostForm from '@/components/features/blog/write/WritePostForm';

export async function generateMetadata() {
  return { title: `글 작성` };
}

export default function WritePage() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))] flex-col px-4 py-4">
      <WritePostForm />
    </div>
  );
}
