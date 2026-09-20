import { NextResponse } from 'next/server';
import { markThisBrowserAsOwn, unmarkThisBrowser } from '@/lib/server/own';

/**
 * Marks (or unmarks) this browser as one of ours, so our own visits never count as traffic.
 *
 * Signing in to /admin does this automatically. Visit /api/own once on a phone or laptop you
 * never sign in from — the marker lasts a year. Visit /api/own?off=1 to clear it.
 */
export async function GET(request: Request) {
  const off = new URL(request.url).searchParams.get('off') === '1';
  if (off) await unmarkThisBrowser();
  else await markThisBrowserAsOwn();

  return NextResponse.json({
    ok: true,
    marked: !off,
    message: off
      ? 'This device is no longer marked. New visits from it count as normal traffic. Visits already recorded as yours stay excluded; use "Not me" in the dashboard to bring them back.'
      : 'This device is marked as yours. Every visit from it, past and future, is left out of the analytics.',
  });
}
