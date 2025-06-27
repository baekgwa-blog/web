import SortSelect from './client/SortSelect';

interface HeaderSectionProps {
  selectedCategory?: string;
}

export default function HeaderSection({ selectedCategory }: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">
        {selectedCategory == null ? '전체 글 보기' : `${selectedCategory} 관련 글`}
      </h2>
      <SortSelect />
    </div>
  );
}
