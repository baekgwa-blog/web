'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LoginForm } from '../features/user/LoginForm';
import { useAuthStore } from '@/lib/store/auth';

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-[var(--header-height)] items-center px-4">
        <div className="grid w-full grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <Link href="/" className="text-xl font-semibold">
              <span className="font-bold">백과 블로그</span>
            </Link>
          </div>
          <nav className="flex items-center justify-center gap-4">
            <Link href="/" className="hover:text-primary font-medium">
              홈
            </Link>
            <Link href="/blog" className="hover:text-primary font-medium">
              블로그
            </Link>
            <Link href="/about" className="hover:text-primary font-medium">
              소개
            </Link>
          </nav>
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            {!isLoggedIn && <LoginForm />}
            {isLoggedIn && (
              <Button asChild size="sm" className="gap-2">
                <Link href="/blog/write">글쓰기</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
