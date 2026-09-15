import { NextResponse, type NextRequest } from 'next/server';

/**
 * Optimistic gate for /admin: without a session cookie, bounce to the login page before
 * rendering anything. The real check (cookie → database session) happens on the server in
 * requireAdmin(); this only saves work and never grants access on its own.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const hasSession = request.cookies.has('__Host-sima_admin');

  const response = !isLogin && !hasSession ? NextResponse.redirect(new URL('/admin/login', request.url)) : NextResponse.next();

  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
