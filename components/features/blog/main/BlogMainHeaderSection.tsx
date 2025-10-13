import SortSelect from '@/components/features/blog/main/SortSelect';
import SearchInput from '@/components/features/blog/main/SearchInput';

export default function BlogMainHeaderSection() {
  return (
    <div className="grid grid-cols-[1fr_200px] items-center gap-2">
      <SearchInput />
      <SortSelect />
    </div>
  );
}
