'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('keyword') || '');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('keyword', value.trim());
    } else {
      params.delete('keyword');
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        type="text"
        placeholder="키워드로 검색..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pr-10"
        aria-label="검색어 입력"
      />
      <Button type="button" size="icon" variant="outline" onClick={handleSearch} aria-label="검색">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
}
