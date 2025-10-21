'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || 'LATEST';

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={sort} onValueChange={handleSort}>
      <SelectTrigger className="!h-11 w-full text-base">
        <SelectValue placeholder="정렬 방식 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="LATEST">최신순</SelectItem>
        <SelectItem value="OLDEST">오래된순</SelectItem>
        <SelectItem value="VIEW">조회순</SelectItem>
      </SelectContent>
    </Select>
  );
}
