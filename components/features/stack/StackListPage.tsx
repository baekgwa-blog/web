import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/date';
import type { GetAllStackListResponse } from '@/lib/api/stack';
import { Badge } from '@/components/ui/badge';
import { ApiResponse } from '@/lib/api-client';
import { CalendarDays, Layers } from 'lucide-react';

const DEFAULT_IMAGE_URL =
  'https://baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com/stack/20251025_7db17a92';

interface StackListPageProps {
  promiseData: Promise<ApiResponse<GetAllStackListResponse[]>>;
}

export async function StackListPage({ promiseData }: StackListPageProps) {
  const response = await promiseData;

  if (!response.isSuccess || !response.data) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        스택 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  const stackList = response.data;

  if (stackList.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        아직 등록된 스택 시리즈가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      {stackList.map((stack) => {
        const imageUrl = stack.thumbnailImage || DEFAULT_IMAGE_URL;

        return (
          <Link
            key={stack.stackId}
            href={`/stack/${stack.stackId}`}
            className="bg-card text-card-foreground block overflow-hidden rounded-lg border shadow-sm transition-transform duration-200 hover:scale-[1.01] hover:shadow-md"
          >
            <div className="relative h-48 w-full">
              <Image
                src={imageUrl}
                alt={stack.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 via-black/20 to-transparent p-4 text-white">
                <h2 className="line-clamp-2 text-2xl font-bold">{stack.title}</h2>
                <p className="line-clamp-1 text-sm opacity-90">{stack.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4">
              <Badge variant="default" className="w-fit">
                {stack.category}
              </Badge>

              <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span className="font-medium">{stack.count} Posts</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(stack.updatedAt)} 업데이트</span>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
