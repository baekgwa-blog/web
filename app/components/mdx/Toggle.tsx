'use client';

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  summary: string;
  children: React.ReactNode;
}

export function Toggle({ summary, children }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-1 text-left text-base font-medium"
      >
        <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')} />
        <span>{summary}</span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'mt-2 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pl-5">{children}</div>
      </div>
    </div>
  );
}
