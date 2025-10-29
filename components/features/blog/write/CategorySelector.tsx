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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export default function CategorySelector({ value, onValueChange, error }: CategorySelectorProps) {
  const [categoryOptions, setCategoryOptions] = useState<CategoryList[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategories();
        setCategoryOptions(response.data!);
      } catch (err) {
        const errMessage =
          err instanceof ApiError ? err.message : '카테고리 조회 실패. 서버 상태가 이상합니다.';
        toast.error(errMessage);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, { id: 'category-error', duration: 3000 });
    } else {
      toast.dismiss('category-error');
    }
  }, [error]);

  return (
    <div className="h-full">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-invalid={!!error}
          className={cn(
            'flex !h-full !min-h-0 w-full items-center py-0',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/50'
          )}
        >
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
    </div>
  );
}
