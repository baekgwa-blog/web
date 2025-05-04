'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface DetailsProps {
  summary: string;
  children: React.ReactNode;
}

export function Details({ summary, children }: DetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-foreground/80 flex w-full items-center gap-2 text-left font-medium"
      >
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        {summary}
      </button>
      {isOpen && <div className="mt-2 pl-6">{children}</div>}
    </div>
  );
}
