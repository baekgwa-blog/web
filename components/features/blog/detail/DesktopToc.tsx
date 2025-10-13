import { TocList, type FlatTocItem } from './TocList';
import { List } from 'lucide-react';

interface DesktopTocProps {
  toc: FlatTocItem[];
}

export function DesktopToc({ toc }: DesktopTocProps) {
  return (
    <div className="sticky top-[var(--sticky-top)]">
      <div className="bg-muted/40 space-y-4 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5" />
          <h3 className="text-lg font-semibold">목차</h3>
        </div>
        <TocList toc={toc} />
      </div>
    </div>
  );
}
