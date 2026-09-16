import 'server-only';
import { requireAdmin } from './auth';
import { ensureSchema, requireDb } from './db';

/** Dashboard data access layer. Every entry point re-checks the admin session. */

export type RangeKey = '24h' | '7d' | '30d' | '90d' | '12m';
export const RANGES: { key: RangeKey; label: string }[] = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: '12m', label: 'Last 12 months' },
];

export function resolveRange(key: string | undefined) {
  const range = (RANGES.find((r) => r.key === key)?.key ?? '7d') as RangeKey;
  const to = new Date();
  const ms = { '24h': 864e5, '7d': 7 * 864e5, '30d': 30 * 864e5, '90d': 90 * 864e5, '12m': 365 * 864e5 }[range];
  const from = new Date(to.getTime() - ms);
  const prevFrom = new Date(from.getTime() - ms);
  const bucket = range === '24h' ? 'hour' : range === '12m' ? 'week' : 'day';
  return { range, from: from.toISOString(), to: to.toISOString(), prevFrom: prevFrom.toISOString(), bucket };
}

type Breakdown = { label: string; sessions: number; visitors: number }[];

/** Whitelisted columns only: identifiers never come from user input. */
const BREAKDOWN_COLUMNS = {
  source: 'source',
  referrer: 'referrer_host',
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  country: 'country',
  region: `coalesce(region || ', ', '') || country`,
  city: `city || ', ' || country`,
  device: 'device',
  browser: 'browser',
  os: 'os',
  screen: 'screen',
  language: 'language',
  locale: 'locale',
  entry: 'entry_path',
  exit: 'exit_path',
} as const;

export async function getDashboard(rangeKey: string | undefined) {
  await requireAdmin();
  await ensureSchema();
  const sql = requireDb();
  const { range, from, to, prevFrom, bucket } = resolveRange(rangeKey);

  const kpi = (a: string, b: string) => sql`
    select count(*)::int as sessions,
           count(distinct visitor_id)::int as visitors,
           coalesce(sum(pageviews), 0)::int as pageviews,
           coalesce(avg(extract(epoch from (last_seen - started_at))), 0)::float as avg_duration,
           coalesce(avg(case when pageviews <= 1 and last_seen - started_at < interval '10 seconds' then 1 else 0 end), 0)::float as bounce_rate,
           count(distinct visitor_id) filter (where is_new)::int as new_visitors
    from analytics_sessions where not is_own and started_at >= ${a}::timestamptz and started_at < ${b}::timestamptz`;

  const breakdown = (column: keyof typeof BREAKDOWN_COLUMNS, limit = 12) =>
    sql.query(
      `select coalesce(${BREAKDOWN_COLUMNS[column]}, 'Unknown') as label, count(*)::int as sessions, count(distinct visitor_id)::int as visitors
       from analytics_sessions where not is_own and started_at >= $1::timestamptz and started_at < $2::timestamptz
       group by 1 order by 2 desc limit $3`,
      [from, to, limit],
    ) as unknown as Promise<Breakdown>;

  const [
    current,
    previous,
    series,
    pages,
    realtimeCount,
    realtimeList,
    events,
    sections,
    scroll,
    heatmap,
    mapPoints,
    recent,
    leads,
    admins,
    logins,
    activeUsers,
    activeMinutes,
    ...breakdowns
  ] = await Promise.all([
    kpi(from, to),
    kpi(prevFrom, from),
    sql`
      with buckets as (
        select generate_series(
          date_trunc(${bucket}, ${from}::timestamptz at time zone 'Asia/Riyadh'),
          date_trunc(${bucket}, ${to}::timestamptz at time zone 'Asia/Riyadh'),
          ('1 ' || ${bucket})::interval) as t
      )
      select to_char(b.t, 'YYYY-MM-DD"T"HH24:MI') as t,
             count(distinct s.visitor_id)::int as visitors,
             count(s.id)::int as sessions,
             coalesce(sum(s.pageviews), 0)::int as pageviews
      from buckets b
      left join analytics_sessions s
        on date_trunc(${bucket}, s.started_at at time zone 'Asia/Riyadh') = b.t
       and not s.is_own and s.started_at >= ${from}::timestamptz and s.started_at < ${to}::timestamptz
      group by b.t order by b.t`,
    sql`
      select path, count(*)::int as views, count(distinct visitor_id)::int as visitors
      from analytics_events e where type = 'pageview' and ts >= ${from}::timestamptz and ts < ${to}::timestamptz
        and not exists (select 1 from analytics_sessions s where s.id = e.session_id and s.is_own)
      group by path order by views desc limit 15`,
    sql`select count(distinct visitor_id)::int as active from analytics_sessions where not is_own and last_seen > now() - interval '5 minutes'`,
    // Our own devices stay in this list — labelled, not hidden — so we can see ourselves browsing.
    sql`
      select exit_path as path, country, city, device, browser, os, source, pageviews, is_own,
             extract(epoch from (last_seen - started_at))::int as duration, last_seen
      from analytics_sessions where last_seen > now() - interval '5 minutes'
      order by last_seen desc limit 20`,
    sql`
      select name, count(*)::int as count, count(distinct session_id)::int as sessions
      from analytics_events e where type = 'event' and ts >= ${from}::timestamptz and ts < ${to}::timestamptz
        and not exists (select 1 from analytics_sessions s where s.id = e.session_id and s.is_own)
      group by name order by count desc`,
    sql`
      select props->>'section' as section, count(distinct session_id)::int as sessions
      from analytics_events e where type = 'event' and name = 'section_view' and ts >= ${from}::timestamptz and ts < ${to}::timestamptz
        and not exists (select 1 from analytics_sessions s where s.id = e.session_id and s.is_own)
      group by 1 order by 2 desc`,
    sql`
      select (props->>'depth')::int as depth, count(distinct session_id)::int as sessions
      from analytics_events e where type = 'event' and name = 'scroll' and ts >= ${from}::timestamptz and ts < ${to}::timestamptz
        and not exists (select 1 from analytics_sessions s where s.id = e.session_id and s.is_own)
      group by 1 order by 1`,
    sql`
      select extract(isodow from started_at at time zone 'Asia/Riyadh')::int as dow,
             extract(hour from started_at at time zone 'Asia/Riyadh')::int as hour,
             count(*)::int as sessions
      from analytics_sessions where not is_own and started_at >= ${from}::timestamptz and started_at < ${to}::timestamptz
      group by 1, 2`,
    sql`
      select city, country, avg(latitude)::float as lat, avg(longitude)::float as lon, count(*)::int as sessions
      from analytics_sessions
      where not is_own and started_at >= ${from}::timestamptz and started_at < ${to}::timestamptz and latitude is not null and longitude is not null
      group by city, country order by sessions desc limit 300`,
    // Kept in the list and labelled, so we can tell our own browsing from real traffic.
    sql`
      select id, started_at, last_seen, entry_path, exit_path, pageviews, source, referrer_host, utm_campaign,
             country, region, city, device, browser, os, screen, language, locale, is_new, is_own,
             extract(epoch from (last_seen - started_at))::int as duration
      from analytics_sessions where started_at >= ${from}::timestamptz and started_at < ${to}::timestamptz
      order by started_at desc limit 100`,
    sql`
      select count(distinct session_id) filter (where name = 'contact_submit')::int as contact,
             count(distinct session_id) filter (where name = 'whatsapp_click')::int as whatsapp,
             count(distinct session_id) filter (where name in ('contact_submit', 'whatsapp_click', 'email_click'))::int as any_lead
      from analytics_events e where type = 'event' and ts >= ${from}::timestamptz and ts < ${to}::timestamptz
        and not exists (select 1 from analytics_sessions s where s.id = e.session_id and s.is_own)`,
    sql`
      select id, email, created_at, last_seen, expires_at, ip, country, city, user_agent
      from admin_sessions where revoked_at is null and expires_at > now()
      order by last_seen desc`,
    sql`
      select email, ts, success, reason, ip, country, city, user_agent
      from admin_logins order by ts desc limit 40`,
    sql`
      select count(distinct visitor_id) filter (where last_seen > now() - interval '5 minutes')::int as now_5m,
             count(distinct visitor_id) filter (where last_seen > now() - interval '30 minutes')::int as last_30m,
             count(distinct visitor_id) filter (where last_seen >= (date_trunc('day', now() at time zone 'Asia/Riyadh') at time zone 'Asia/Riyadh'))::int as today
      from analytics_sessions where not is_own and last_seen > now() - interval '2 days'`,
    // A visit counts as active in every minute between its first and last activity.
    sql`
      with minutes as (
        select generate_series(date_trunc('minute', now()) - interval '29 minutes', date_trunc('minute', now()), interval '1 minute') as t
      )
      select to_char(m.t at time zone 'Asia/Riyadh', 'HH24:MI') as t, count(distinct s.visitor_id)::int as users
      from minutes m
      left join analytics_sessions s on not s.is_own and s.started_at <= m.t + interval '1 minute' and s.last_seen >= m.t
      group by m.t order by m.t`,
    breakdown('source'),
    breakdown('referrer'),
    breakdown('utmCampaign'),
    breakdown('utmMedium'),
    breakdown('country', 30),
    breakdown('region', 20),
    breakdown('city', 25),
    breakdown('device'),
    breakdown('browser'),
    breakdown('os'),
    breakdown('screen'),
    breakdown('language'),
    breakdown('locale'),
    breakdown('entry'),
    breakdown('exit'),
  ]);

  const [source, referrer, campaign, medium, country, region, city, device, browser, os, screen, language, locale, entry, exit] = breakdowns as Breakdown[];

  return {
    range,
    bucket,
    from,
    to,
    kpis: { current: current[0], previous: previous[0] },
    series,
    pages,
    realtime: { active: (realtimeCount[0] as { active: number }).active, sessions: realtimeList },
    activeUsers: activeUsers[0],
    activeMinutes,
    events,
    sections,
    scroll,
    heatmap,
    mapPoints,
    recent,
    leads: leads[0],
    admins,
    logins,
    breakdowns: { source, referrer, campaign, medium, country, region, city, device, browser, os, screen, language, locale, entry, exit },
  };
}

export type Dashboard = Awaited<ReturnType<typeof getDashboard>>;

/** Full journey of one visit: every page view and interaction in order. */
export async function getSessionJourney(sessionId: string) {
  await requireAdmin();
  const sql = requireDb();
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) return [];
  return sql`
    select ts, type, name, path, props from analytics_events
    where session_id = ${sessionId} order by ts asc limit 300`;
}

/** CSV export of sessions in range (admin only). */
export async function exportSessionsCsv(rangeKey: string | undefined) {
  await requireAdmin();
  const sql = requireDb();
  const { from, to } = resolveRange(rangeKey);
  const rows = (await sql`
    select started_at, last_seen, extract(epoch from (last_seen - started_at))::int as duration_s, pageviews, entry_path, exit_path,
           source, referrer_host, utm_source, utm_medium, utm_campaign, country, region, city, device, browser, os, screen, language, locale, is_new
    from analytics_sessions where not is_own and started_at >= ${from}::timestamptz and started_at < ${to}::timestamptz
    order by started_at desc limit 50000`) as Record<string, unknown>[];
  const columns = ['started_at', 'last_seen', 'duration_s', 'pageviews', 'entry_path', 'exit_path', 'source', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign', 'country', 'region', 'city', 'device', 'browser', 'os', 'screen', 'language', 'locale', 'is_new'];
  const cell = (v: unknown) => {
    let s = v === null || v === undefined ? '' : v instanceof Date ? v.toISOString() : String(v);
    // Neutralise spreadsheet formula injection.
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [columns.join(','), ...rows.map((r) => columns.map((c) => cell(r[c])).join(','))].join('\n');
}
