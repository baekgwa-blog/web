import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/blog/write', '/stack/create'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const isProtectedPath = protectedPaths.includes(pathname);

  if (isProtectedPath && !accessToken) {
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('auth_required', 'true');
    homeUrl.searchParams.set('redirect_to', pathname);

    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
