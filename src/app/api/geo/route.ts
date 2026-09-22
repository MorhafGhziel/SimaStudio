import { currencyForCountry } from '@/lib/currency';

/**
 * Which currency this visitor should see, from where the connection comes.
 *
 * This exists instead of a cookie: the privacy page promises no cookies for visitors, and the
 * pages themselves stay statically cached, so the country cannot be read while rendering them.
 * The browser asks once, caches the answer for an hour, and nothing is stored on the device.
 *
 * `x-vercel-ip-country` only exists on Vercel. Anywhere else the answer is null and prices stay
 * at the language default — riyals in Arabic, dollars in English.
 */
export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const currency = currencyForCountry(request.headers.get('x-vercel-ip-country'));
  return Response.json(
    { currency },
    {
      headers: {
        // per visitor, never on a shared cache, and re-asked at most once an hour
        'Cache-Control': 'private, max-age=3600',
        'X-Robots-Tag': 'noindex',
      },
    },
  );
}
