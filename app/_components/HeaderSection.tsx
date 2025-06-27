import SortSelect from './client/SortSelect';
import SearchInput from './client/SearchInput';

export default function HeaderSection() {
  return (
    <div className="grid grid-cols-[1fr_200] items-center gap-4">
      <SearchInput />
      <SortSelect />
    </div>
  );
}
