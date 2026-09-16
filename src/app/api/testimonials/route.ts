import { requestMeta } from '@/lib/server/security';
import { submitTestimonial } from '@/lib/server/testimonials';
import { isBot } from '@/lib/server/ua';

/** Public review submissions. Stored as pending; an admin approves before anything is shown. */
export async function POST(request: Request) {
  const meta = requestMeta(request.headers);
  if (isBot(meta.userAgent)) return Response.json({ ok: false, error: 'invalid' }, { status: 400 });

  const body = await request.text();
  if (body.length > 4000) return Response.json({ ok: false, error: 'invalid' }, { status: 413 });

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  // Honeypot: a hidden field only a bot fills in.
  if (typeof data.website === 'string' && data.website.length > 0) return Response.json({ ok: true });

  const result = await submitTestimonial(data, meta);
  const status = result.ok ? 200 : result.error === 'rate_limited' ? 429 : result.error === 'unavailable' ? 503 : 422;
  return Response.json(result, { status, headers: { 'Cache-Control': 'no-store' } });
}
