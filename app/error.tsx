'use client';

import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react'; // 404(Ghost) 대신 에러 아이콘
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in-up">
        <ServerCrash className="text-destructive mb-4 inline h-16 w-16" />
        <h1 className="mb-2 text-4xl font-bold">이런, 오류가 발생했어요</h1>
        <p className="text-muted-foreground mb-6">
          요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>

        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} className="text-base">
            다시 시도
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="text-base"
          >
            홈으로 돌아가기
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <pre className="bg-muted mt-6 w-full max-w-lg overflow-auto rounded-md p-4 text-left text-xs text-red-500">
            {error?.message}
          </pre>
        )}
      </div>
    </div>
  );
}
