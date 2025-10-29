import CreateStackForm from '@/components/features/stack/CreateStackForm';

export async function generateMetadata() {
  return { title: `새 스택 만들기` };
}

export default function CreateStackPage() {
  return (
    <div className="py-4">
      <CreateStackForm />
    </div>
  );
}
