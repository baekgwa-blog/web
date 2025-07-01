import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Clock } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface PostDetailHeaderProps {
  title: string;
  tagList: string[];
  author: string;
  createdAt: string | Date;
  readingTime?: string;
}

export function PostDetailHeader({
  title,
  tagList,
  author,
  createdAt,
  readingTime = '5분 읽기',
}: PostDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          {tagList.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      </div>
      <div className="text-muted-foreground flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{author}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime}</span>
        </div>
      </div>
    </div>
  );
}
