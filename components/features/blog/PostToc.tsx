import Link from 'next/link';

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

interface TableOfContentsLinkProps {
  item: TocEntry;
}

function TableOfContentsLink({ item }: TableOfContentsLinkProps) {
  return (
    <div className="space-y-2">
      <Link
        key={item.id}
        href={`#${item.id}`}
        className={`hover:text-foreground text-muted-foreground block font-medium transition-colors`}
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2 pl-4">
          {item.children.map((subItem) => (
            <TableOfContentsLink key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}

interface PostTocProps {
  toc: TocEntry[];
  className?: string;
}

export function PostToc({ toc, className = '' }: PostTocProps) {
  return (
    <nav className={`space-y-3 text-sm ${className}`}>
      {toc?.map((item) => <TableOfContentsLink key={item.id} item={item} />)}
    </nav>
  );
}

export type { TocEntry };
