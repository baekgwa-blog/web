'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { use } from 'react';
import { CategoryList } from '@/lib/api/category';

interface CategorySectionProps {
  categories: Promise<CategoryList[]>;
  selectedCategory?: string;
}

export default function CategorySection({ categories, selectedCategory }: CategorySectionProps) {
  const allCategories = use(categories);
  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {allCategories.map((category) => (
            <Link href={`?category=${category.name}`} key={category.name}>
              <div
                className={cn(
                  'hover:bg-muted-foreground/10 text-muted-foreground flex items-center justify-between rounded-md p-1.5 text-sm transition-colors',
                  selectedCategory === category.name &&
                    'bg-muted-foreground/10 text-foreground font-medium'
                )}
              >
                <span>{category.name}</span>
                <span>{category.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
