import { after } from 'next/server';
import { OWN_COOKIE } from '@/app/api/own/route';
import { SESSION_COOKIE } from '@/lib/server/auth';
import { db, ensureSchema } from '@/lib/server/db';
import { hmac, requestMeta } from '@/lib/server/security';
import { classifySource, isBot, parseUserAgent } from '@/lib/server/ua';

/**
 * First-party, cookieless analytics collector. The browser sends small beacons; everything
 * is validated and clipped here. Visitor ids are random per-browser values that are hashed
 * with a server secret before storage.
 */

const ID = /^[A-Za-z0-9_-]{8,64}$/;
const NAME = /^[a-z0-9_]{1,40}$/;
const str = (v: unknown, max: number) => (typeof v === 'string' && v.length ? v.slice(0, max) : null);

type Beacon = {
  type?: string;
  sid?: string;
  vid?: string;
  path?: string;
  name?: string;
  props?: Record<string, unknown>;
  referrer?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  screen?: string;
  language?: string;
  locale?: string;
};

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 4000 || !db()) return new Response(null, { status: 204 });

  const meta = requestMeta(request.headers);
  if (isBot(meta.userAgent)) return new Response(null, { status: 204 });

  // Our own visits are recorded but flagged, so the dashboard can show them as "You" and
  // still leave them out of every total. Either a live admin session or the long-lived
  // marker cookie from /api/own counts — the marker survives logout and works on phones.
  const cookie = request.headers.get('cookie') ?? '';
  const isOwn = cookie.includes(`${SESSION_COOKIE}=`) || cookie.includes(`${OWN_COOKIE}=1`);

  let data: Beacon;
  try {
    data = JSON.parse(body) as Beacon;
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = data.type;
  if (!type || !['pageview', 'event', 'ping'].includes(type) || !ID.test(data.sid ?? '') || !ID.test(data.vid ?? '')) {
    return new Response(null, { status: 400 });
  }
  const path = str(data.path, 300);
  if (!path?.startsWith('/')) return new Response(null, { status: 400 });

  after(async () => {
    const sql = db();
    if (!sql) return;
    await ensureSchema();
    const sid = data.sid!;
    const vid = hmac(`visitor:${data.vid}`).slice(0, 32);

    if (type === 'pageview') {
      let referrerHost: string | null = null;
      const referrer = str(data.referrer, 500);
      if (referrer) {
        try {
          referrerHost = new URL(referrer).hostname.toLowerCase();
        } catch {}
      }
      const utmSource = str(data.utm?.source, 80);
      const ua = parseUserAgent(meta.userAgent);
      await sql`
        insert into analytics_sessions (id, visitor_id, entry_path, exit_path, referrer, referrer_host, source, utm_source, utm_medium, utm_campaign,
          country, region, city, latitude, longitude, timezone, device, browser, os, screen, language, locale, is_new, is_own, pageviews)
        values (${sid}, ${vid}, ${path}, ${path}, ${referrer}, ${referrerHost}, ${classifySource(referrerHost, utmSource)}, ${utmSource},
          ${str(data.utm?.medium, 80)}, ${str(data.utm?.campaign, 120)}, ${meta.country}, ${meta.region}, ${meta.city}, ${meta.latitude}, ${meta.longitude},
          ${meta.timezone}, ${ua.device}, ${ua.browser}, ${ua.os}, ${str(data.screen, 20)}, ${str(data.language, 20)}, ${str(data.locale, 5)},
          not exists (select 1 from analytics_sessions where visitor_id = ${vid}), ${isOwn}, 1)
        on conflict (id) do update set last_seen = now(), exit_path = excluded.exit_path, pageviews = analytics_sessions.pageviews + 1
        where analytics_sessions.visitor_id = excluded.visitor_id`;
      await sql`insert into analytics_events (session_id, visitor_id, type, path) values (${sid}, ${vid}, 'pageview', ${path})`;
      return;
    }

    if (type === 'event') {
      const name = str(data.name, 40);
      if (!name || !NAME.test(name)) return;
      const props: Record<string, string> = {};
      for (const [k, v] of Object.entries(data.props ?? {}).slice(0, 8)) {
        if (NAME.test(k) && (typeof v === 'string' || typeof v === 'number')) props[k] = String(v).slice(0, 120);
      }
      await sql`insert into analytics_events (session_id, visitor_id, type, name, path, props) values (${sid}, ${vid}, 'event', ${name}, ${path}, ${JSON.stringify(props)}::jsonb)`;
    }

    await sql`update analytics_sessions set last_seen = now() where id = ${sid} and visitor_id = ${vid}`;
  });

  return new Response(null, { status: 204 });
}
