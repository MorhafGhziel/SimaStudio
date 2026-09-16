import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Marks (or unmarks) this browser as one of ours, so our own visits are labelled in the
 * dashboard instead of looking like customer traffic.
 *
 * Visit /api/own on each phone and laptop once — the cookie lasts a year and, unlike the
 * admin session, does not expire after 12 hours or require being signed in.
 * Visit /api/own?off=1 to clear it.
 */

export const OWN_COOKIE = 'sima_own';
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function GET(request: Request) {
  const off = new URL(request.url).searchParams.get('off') === '1';
  const jar = await cookies();

  if (off) {
    jar.delete(OWN_COOKIE);
  } else {
    jar.set(OWN_COOKIE, '1', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_YEAR,
    });
  }

  return NextResponse.json({
    ok: true,
    marked: !off,
    message: off
      ? 'This device is no longer marked. Its visits will count as normal traffic again.'
      : 'This device is marked as yours. Its visits show as "You" in the dashboard and are left out of the totals.',
  });
}
