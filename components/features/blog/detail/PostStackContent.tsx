'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ApiResponse } from '@/lib/api-client';
import { GetStackRelativePostResponse } from '@/lib/api/stack';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PostStackContentProps {
  stackResponse: ApiResponse<GetStackRelativePostResponse>;
  currentPostId: number;
}

export function PostStackContent({ stackResponse, currentPostId }: PostStackContentProps) {
  const stackData = stackResponse.data;
  if (
    !stackResponse.isSuccess ||
    !stackData ||
    !stackData.stackPostInfoList ||
    stackData.stackPostInfoList.length === 0
  ) {
    return null;
  }

  const sortedList = [...stackData.stackPostInfoList].sort((a, b) => a.sequence - b.sequence);

  const currentIndex = sortedList.findIndex((post) => post.postId === currentPostId);

  const previousPost = currentIndex > 0 ? sortedList[currentIndex - 1] : undefined;
  const nextPost = currentIndex < sortedList.length - 1 ? sortedList[currentIndex + 1] : undefined;

  return (
    <div className="mb-10">
      <Accordion type="single" collapsible className="rounded-lg border px-5">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="flex items-center justify-between py-5">
            <div className="flex flex-col text-left">
              <span className="text-muted-foreground text-sm font-medium">스택 시리즈</span>
              <Link
                href={`/stack/${stackData.stackId}`}
                className="text-2xl font-bold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {stackData.title}
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="grid grid-cols-[minmax(0,1fr)_100px]">
              <ol className="mb-5 list-decimal space-y-2.5 text-base">
                {sortedList.map((post) => {
                  const isCurrent = post.postId === currentPostId;
                  return (
                    <li key={post.postId} className="overflow-hidden pl-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        prefetch={false}
                        className={`flex max-w-full items-center gap-2 truncate font-semibold transition-colors hover:underline ${
                          isCurrent ? 'text-primary' : 'hover:text-foreground'
                        }`}
                      >
                        <FileText className="h-4 w-4 shrink-0 opacity-70" />
                        <span className="truncate">{post.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>

              {currentIndex !== -1 && (
                <>
                  <div className="flex flex-col items-center justify-start gap-2">
                    <span className="text-sm font-medium">
                      {currentIndex + 1} / {sortedList.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={previousPost ? `/blog/${previousPost.slug}` : '#'}
                        className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                          !previousPost
                            ? 'text-muted-foreground cursor-not-allowed opacity-50'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        } `}
                        aria-disabled={!previousPost}
                        tabIndex={!previousPost ? -1 : undefined}
                        onClick={(e) => !previousPost && e.preventDefault()}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Link>

                      <Link
                        href={nextPost ? `/blog/${nextPost.slug}` : '#'}
                        className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                          !nextPost
                            ? 'text-muted-foreground cursor-not-allowed opacity-50'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        } `}
                        aria-disabled={!nextPost}
                        tabIndex={!nextPost ? -1 : undefined}
                        onClick={(e) => !nextPost && e.preventDefault()}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
