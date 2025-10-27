'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth'; // auth.ts 경로
import { Plus } from 'lucide-react';

export function StackHeader() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-between border-b px-4 py-4 md:px-6 lg:px-8">
      <h1 className="font-title text-3xl tracking-tight">스택 시리즈</h1>
      <div className="h-9">
        {isMounted && isLoggedIn && (
          <Button asChild size="sm">
            <Link href="/stack/create">
              <Plus className="mr-2 h-4 w-4" />새 스택 만들기
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
