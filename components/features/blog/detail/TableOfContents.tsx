import { MobileToc } from './MobileToc';
import { DesktopToc } from './DesktopToc';
import { type FlatTocItem } from './TocList';

interface TableOfContentsProps {
  toc: FlatTocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  if (toc.length === 0) {
    return null;
  }

  return (
    <>
      {/* 모바일 전용 (md 사이즈 미만에서 보임) */}
      <div className="mb-6 md:hidden">
        <MobileToc toc={toc} />
      </div>

      {/* PC 전용 (md 사이즈 이상에서 보임) */}
      <aside className="relative hidden md:block">
        <DesktopToc toc={toc} />
      </aside>
    </>
  );
}
