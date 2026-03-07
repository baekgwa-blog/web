'use client';

import { useEffect } from 'react';
import { incrementViewCount } from '@/lib/api/post';

interface PostViewTrackerProps {
  slug: string;
}

export function PostViewTracker({ slug }: PostViewTrackerProps) {
  useEffect(() => {
    incrementViewCount(slug).catch(() => {});
  }, [slug]);

  return null;
}
