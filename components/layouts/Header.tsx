'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LoginForm } from '../features/user/LoginForm';
import { useAuthStore } from '@/lib/store/auth';
import { LogoutButton } from '../features/user/LogoutButton';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion'; // framer-motion import
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: '홈' },
  { href: '/blog', label: '블로그' },
  { href: '/about', label: '소개' },
];

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full rounded-2xl border-b transition-all',
        scrolled
          ? 'border-border bg-background/60 shadow-md backdrop-blur-sm'
          : 'border-transparent'
      )}
    >
      <div className="container flex h-[var(--header-height)] items-center px-4">
        <div className="grid w-full grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <Link href="/" className="text-2xl font-semibold">
              <span className="font-bold">백과 블로그</span>
            </Link>
          </div>
          <nav className="flex items-center justify-center gap-10">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/blog' ? pathname.startsWith(link.href) : pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'hover:text-primary text-xl font-semibold transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Button asChild size="sm" className="gap-2">
                  <Link href="/blog/write">글쓰기</Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>
      <motion.div
        className="bg-primary h-1 origin-left"
        style={{ scaleX: isMounted ? scaleX : 0 }}
      />
    </header>
  );
}
