import { NextResponse, type NextRequest } from 'next/server';

import { COOKIE, currencyForCountry, isCurrency } from '@/lib/currency';

/**
 * Optimistic gate for /admin: without a session cookie, bounce to the login page before
 * rendering anything. The real check (cookie → database session) happens on the server in
 * requireAdmin(); this only saves work and never grants access on its own.
 */
function admin(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === '/admin/login';
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

/**
 * Public pages: note where the visitor is, once, in a cookie the browser can read.
 *
 * The page itself stays statically cached — nothing here changes the HTML. The <Price> component
 * reads this cookie after the page loads and swaps the number into the visitor's own currency.
 * `x-vercel-ip-country` only exists on Vercel; locally there is no cookie and prices fall back to
 * riyals on the Arabic side and dollars on the English one.
 */
function currency(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(COOKIE)?.value;
  if (existing && isCurrency(existing)) return response; // already set, or chosen by the visitor

  const code = currencyForCountry(request.headers.get('x-vercel-ip-country'));
  if (code) {
    response.cookies.set(COOKIE, code, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      httpOnly: false, // the price component reads it in the browser
    });
  }
  return response;
}

export function proxy(request: NextRequest) {
  return request.nextUrl.pathname.startsWith('/admin') ? admin(request) : currency(request);
}

export const config = {
  // everything except Next's own assets, the API, and files with an extension
  matcher: ['/((?!_next/|api/|.*\\.).*)'],
};
