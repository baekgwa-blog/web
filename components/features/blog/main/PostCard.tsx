'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Pencil, Eye } from 'lucide-react'; // [수정] Pencil 아이콘 추가
import Image from 'next/image';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/date';

interface PostCardProps {
  post: Post;
  isFirst?: boolean;
}

export function PostCard({ post, isFirst = false }: PostCardProps) {
  return (
    <Card className="group bg-card/50 hover:border-primary/20 flex flex-col overflow-hidden border p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg md:flex-row">
      {post.coverImage && (
        <div className="relative aspect-video w-full shrink-0 overflow-hidden md:aspect-auto md:w-48 lg:w-64">
          <div className="from-background/20 absolute inset-0 z-10 bg-gradient-to-t to-transparent md:bg-gradient-to-r" />
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 20vw"
            priority={isFirst}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge
            variant="default"
            className="bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
          >
            {post.category}
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h2 className="group-hover:text-primary mb-2 text-2xl font-bold tracking-tight transition-colors">
          {post.title}
        </h2>

        {post.description && (
          <p className="text-muted-foreground mb-4 line-clamp-1 leading-relaxed">
            {post.description}
          </p>
        )}
        <div className="flex-grow" />
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {post.author && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          )}
          {post.date && (
            <div className="flex items-center gap-1.5" title="작성일">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          )}
          {post.modifiedDate && (
            <div className="flex items-center gap-1.5" title="최근 수정일">
              <Pencil className="h-4 w-4" />
              <time dateTime={post.modifiedDate}>{formatDate(post.modifiedDate)}</time>
            </div>
          )}
          {post.viewCount != null && (
            <div className="flex items-center gap-1.5" title="조회수">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
