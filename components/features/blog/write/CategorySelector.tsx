'use client';

import { useState, useEffect } from 'react';
import { getCategories, CategoryList } from '@/lib/api/category';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export default function CategorySelector({ value, onValueChange, error }: CategorySelectorProps) {
  const [categoryOptions, setCategoryOptions] = useState<CategoryList[]>([]);

  useEffect(() => {
    getCategories().then(setCategoryOptions);
  }, []);

  return (
    <div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="카테고리를 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
