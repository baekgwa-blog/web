import { TocList, type FlatTocItem } from './TocList';

interface MobileTocProps {
  toc: FlatTocItem[];
}

export function MobileToc({ toc }: MobileTocProps) {
  return (
    <details className="bg-muted/60 rounded-lg p-4 backdrop-blur-sm">
      <summary className="cursor-pointer text-lg font-semibold">목차</summary>
      <div className="mt-3">
        <TocList toc={toc} />
      </div>
    </details>
  );
}
