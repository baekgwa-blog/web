'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LoginForm } from '../features/user/LoginForm';
import { useAuthStore } from '@/lib/store/auth';
import { LogoutButton } from '../features/user/LogoutButton';
import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const checkIsActive = (pathname: string, href: string): boolean => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

const navLinks = [
  { href: '/blog', label: '블로그' },
  { href: '/stack', label: '스택 시리즈' },
  { href: '/about', label: '소개' },
];

const wiggleVariant = {
  hover: {
    rotate: [-3, 3, -3],
    transition: {
      duration: 1,
      ease: 'easeInOut',
      repeat: Infinity,
    } as const,
  },
};

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authRequired = searchParams.get('auth_required');
    if (authRequired === 'true') {
      toast.error('로그인이 필요한 서비스입니다.');
    }
  }, [searchParams, pathname, router, isMounted]);

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
        <div className="hidden w-full grid-cols-[auto_1fr_auto] items-center md:grid">
          <div className="flex items-center justify-start">
            <Link href="/" className="text-2xl font-semibold">
              <motion.span className="font-title" whileHover="hover">
                <motion.span className="inline-block text-green-600" variants={wiggleVariant}>
                  백과
                </motion.span>
                <motion.span className="text-foreground/80 inline-block" variants={wiggleVariant}>
                  {' '}
                  블로그
                </motion.span>
              </motion.span>
            </Link>
          </div>

          <nav className="flex items-center justify-center gap-10 overflow-hidden whitespace-nowrap">
            {navLinks.map((link, index) => {
              const isActive = checkIsActive(pathname, link.href);

              return (
                <Link
                  key={`${link.href}-${index}`}
                  href={link.href}
                  className={cn(
                    'hover:text-primary truncate text-xl font-semibold transition-colors',
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

        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="text-2xl font-semibold">
            <span className="font-bold">백과 블로그</span>
          </Link>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
