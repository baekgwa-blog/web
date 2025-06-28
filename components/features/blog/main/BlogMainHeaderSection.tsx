import SortSelect from '@/components/features/blog/main/SortSelect';
import SearchInput from '@/components/features/blog/main/SearchInput';

export default function BlogMainHeaderSection() {
  return (
    <div className="grid grid-cols-[1fr_200] items-center gap-4">
      <SearchInput />
      <SortSelect />
    </div>
  );
}
