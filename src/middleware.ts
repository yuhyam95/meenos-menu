
import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If user is trying to access login page but is already logged in, redirect to admin
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If user is trying to access admin pages but is not logged in, redirect to login
  if (!session && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
