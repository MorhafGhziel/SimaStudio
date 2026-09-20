import { after } from 'next/server';
import { SESSION_COOKIE } from '@/lib/server/auth';
import { db, ensureSchema } from '@/lib/server/db';
import { OWN_COOKIE } from '@/lib/server/own';
import { hmac, requestMeta } from '@/lib/server/security';
import { classifySource, isBot, parseUserAgent } from '@/lib/server/ua';

/**
 * First-party, cookieless analytics collector. The browser sends small beacons; everything
 * is validated and clipped here. Visitor ids are random per-browser values that are hashed
 * with a server secret before storage.
 */

const ID = /^[A-Za-z0-9_-]{8,64}$/;
const NAME = /^[a-z0-9_]{1,40}$/;
/** Which ad platform's click id was on the landing URL. Only the kind is kept, never the id itself. */
const CLICK_IDS = ['google', 'meta', 'tiktok', 'linkedin', 'microsoft', 'snapchat', 'x'];
const str = (v: unknown, max: number) => (typeof v === 'string' && v.length ? v.slice(0, max) : null);

type Beacon = {
  type?: string;
  sid?: string;
  vid?: string;
  path?: string;
  name?: string;
  props?: Record<string, unknown>;
  referrer?: string;
  utm?: { source?: string; medium?: string; campaign?: string; term?: string; content?: string };
  clickId?: string;
  screen?: string;
  language?: string;
  locale?: string;
};

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 4000 || !db()) return new Response(null, { status: 204 });

  const meta = requestMeta(request.headers);
  if (isBot(meta.userAgent)) return new Response(null, { status: 204 });

  // Our own visits are recorded but flagged, and left out of every number. Either a live admin
  // session or the year-long marker (set at sign-in, or by /api/own) counts.
  //
  // The flag belongs to the browser, not to one visit: the moment a browser is known to be ours,
  // every visit it ever made is flagged too, and so is every later one — even if the cookie is
  // gone by then, because its visitor id is already on record as ours.
  const cookie = request.headers.get('cookie') ?? '';
  const signedIn = cookie.includes(`${SESSION_COOKIE}=`);
  const isOwn = signedIn || cookie.includes(`${OWN_COOKIE}=1`);

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

      // Two more ways a visit is ours, neither of which needs a cookie:
      //   known   — this browser's id is already on record as ours;
      //   network — it comes from the same internet connection an admin was signed in from in the last
      //             7 days. This is what catches our own link opened inside Instagram, TikTok, WhatsApp
      //             or LinkedIn, whose built-in browsers share no cookies with the one we sign in from.
      // The visitor's IP is only compared here, never stored. "Not me" in the dashboard exempts a browser
      // from the network rule, for a customer who happens to share our Wi-Fi or mobile carrier address.
      const [seen] = (await sql`
        select exists (select 1 from analytics_sessions where visitor_id = ${vid} and is_own) as known,
               (${meta.ip}::text is not null
                and exists (select 1 from admin_sessions a where a.ip = ${meta.ip} and a.last_seen > now() - interval '7 days')
                and not exists (select 1 from analytics_not_own n where n.visitor_id = ${vid})) as network`) as { known: boolean; network: boolean }[];
      const own = isOwn || seen.known || seen.network;
      const ownReason = signedIn ? 'signed_in' : isOwn || seen.known ? 'device' : seen.network ? 'network' : null;
      const ua = parseUserAgent(meta.userAgent);
      await sql`
        insert into analytics_sessions (id, visitor_id, entry_path, exit_path, referrer, referrer_host, source, utm_source, utm_medium, utm_campaign,
          country, region, city, latitude, longitude, timezone, device, browser, os, screen, language, locale, is_new, is_own, pageviews,
          utm_term, utm_content, click_id, own_reason)
        values (${sid}, ${vid}, ${path}, ${path}, ${referrer}, ${referrerHost}, ${classifySource(referrerHost, utmSource)}, ${utmSource},
          ${str(data.utm?.medium, 80)}, ${str(data.utm?.campaign, 120)}, ${meta.country}, ${meta.region}, ${meta.city}, ${meta.latitude}, ${meta.longitude},
          ${meta.timezone}, ${ua.device}, ${ua.browser}, ${ua.os}, ${str(data.screen, 20)}, ${str(data.language, 20)}, ${str(data.locale, 5)},
          not exists (select 1 from analytics_sessions where visitor_id = ${vid}),
          ${own}, 1,
          ${str(data.utm?.term, 120)}, ${str(data.utm?.content, 120)}, ${CLICK_IDS.includes(data.clickId ?? '') ? data.clickId : null}, ${ownReason})
        on conflict (id) do update set last_seen = now(), exit_path = excluded.exit_path, pageviews = analytics_sessions.pageviews + 1,
          is_own = analytics_sessions.is_own or excluded.is_own,
          own_reason = coalesce(analytics_sessions.own_reason, excluded.own_reason)
        where analytics_sessions.visitor_id = excluded.visitor_id`;
      await sql`insert into analytics_events (session_id, visitor_id, type, path) values (${sid}, ${vid}, 'pageview', ${path})`;
      if (own) await sql`update analytics_sessions set is_own = true, own_reason = coalesce(own_reason, ${ownReason}) where visitor_id = ${vid} and not is_own`;
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
    // Signed in halfway through a visit: that visit, and the ones before it, are ours too.
    if (isOwn) await sql`update analytics_sessions set is_own = true where visitor_id = ${vid} and not is_own`;
  });

  return new Response(null, { status: 204 });
}
