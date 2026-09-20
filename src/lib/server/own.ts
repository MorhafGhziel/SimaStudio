import 'server-only';
import { cookies } from 'next/headers';

/**
 * "This browser is one of ours." A year-long marker, separate from the 12-hour admin session,
 * so our own visits stay out of the numbers after the session ends and on devices where we
 * only ever open the public site.
 *
 * It is set two ways: automatically at sign-in, and by visiting /api/own on a device once.
 * The collector (/api/t) treats a marked browser as ours for good: see `is_own` there.
 */
export const OWN_COOKIE = 'sima_own';
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function markThisBrowserAsOwn() {
  (await cookies()).set(OWN_COOKIE, '1', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: ONE_YEAR });
}

export async function unmarkThisBrowser() {
  (await cookies()).delete(OWN_COOKIE);
}
