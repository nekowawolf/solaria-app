import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|img).*)',
  ],
};