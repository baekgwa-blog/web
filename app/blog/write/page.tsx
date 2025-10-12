import WritePostForm from '@/components/features/blog/write/WritePostForm';

export default function WritePage() {
  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height))] flex-col px-4 py-4">
      <WritePostForm />
    </div>
  );
}
