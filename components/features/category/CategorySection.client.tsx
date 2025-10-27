'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CategoryList } from '@/lib/api/category';
import { Hash, LayoutGrid } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ApiResponse } from '@/lib/api-client';

interface CategorySectionProps {
  categories: Promise<ApiResponse<CategoryList[]>>;
  selectedCategory?: string;
}

export default function CategorySection({ categories, selectedCategory }: CategorySectionProps) {
  const allCategories = use(categories).data!;
  const totalCount = allCategories.reduce((sum, category) => sum + category.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Link href="/" className="group">
            <div
              className={cn(
                'group-hover:bg-accent flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors',
                !selectedCategory ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>전체보기</span>
              </div>
              <Badge
                variant={!selectedCategory ? 'default' : 'secondary'}
                className="transition-colors"
              >
                {totalCount}
              </Badge>
            </div>
          </Link>
          <Separator className="my-2" />
          {allCategories.map((category) => (
            <Link href={`?category=${category.name}`} key={category.name} className="group">
              <div
                className={cn(
                  'group-hover:bg-accent flex items-center justify-between rounded-md p-2 text-sm transition-colors',
                  selectedCategory === category.name
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
                <Badge
                  variant={selectedCategory === category.name ? 'default' : 'secondary'}
                  className="transition-colors"
                >
                  {category.count}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
