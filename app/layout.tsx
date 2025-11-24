import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'highlight.js/styles/stackoverflow-dark.min.css';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Providers from './providers';
import { Toaster } from '@/components/ui/sonner';
import { ChatButton } from '@/components/features/chatbot/ChatButton';
import { ChatDialog } from '@/components/features/chatbot/ChatDialog';
import { ChatController } from '@/components/features/chatbot/ChatController';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "백과's 블로그",
  description: '개발자 백과의 개인 블로그 입니다.',
};

const HeaderFallback = () => {
  return <div className="h-[var(--header-height)]" />;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="scroll-smooth"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<HeaderFallback />}>
              <Header />
            </Suspense>
            <main className="container flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" expand={false} closeButton richColors />
          </div>
          <ChatController />
          <ChatButton />
          <ChatDialog />
        </Providers>
      </body>
    </html>
  );
}
