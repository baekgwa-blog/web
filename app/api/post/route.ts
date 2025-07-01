import { getPostList } from '@/lib/api/post';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get('category') || undefined;
  const sort = searchParams.get('sort') || undefined;
  const keyword = searchParams.get('keyword') || undefined;
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined;

  const response = await getPostList({
    category: category,
    sort: sort,
    page: page,
    keyword: keyword,
  });

  return NextResponse.json(response);
}
