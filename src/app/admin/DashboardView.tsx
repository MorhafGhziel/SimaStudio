'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import type { Dashboard, RangeKey } from '@/lib/server/analytics';
import type { AdminTestimonial } from '@/lib/server/testimonials';
import { moderateTestimonialAction, revokeOthersAction, revokeSessionAction, signOutAction } from './actions';

type Props = { data: Dashboard; ranges: { key: RangeKey; label: string }[]; me: { email: string; sessionId: string }; testimonials: AdminTestimonial[] };
type Row = Record<string, unknown>;

const PALETTE = ['#3ec6ff', '#8b9dff', '#b340ff', '#ff2e9e', '#ff7338', '#5b8bff', '#22c55e', '#eab308', '#8d8d99'];
const TZ = 'Asia/Riyadh';
const EVENT_LABELS: Record<string, string> = {
  whatsapp_click: 'WhatsApp clicks',
  contact_submit: 'Contact form sent',
  email_click: 'Email clicks',
  instagram_click: 'Instagram clicks',
  tiktok_click: 'TikTok clicks',
  brand_pdf: 'Brand PDF opened',
  project_open: 'Project opened',
  cta_click: 'Start-a-project clicks',
  language_switch: 'Language switched',
  section_view: 'Section views',
  scroll: 'Scroll milestones',
};
const SECTION_ORDER = ['work', 'services', 'packages', 'process', 'faq', 'contact'];

const n = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);
const fmt = (v: number) => new Intl.NumberFormat('en-US').format(Math.round(v));
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const dur = (s: number) => {
  s = Math.round(s);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
};
const when = (v: unknown, opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' }) =>
  v ? new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: TZ }).format(new Date(v as string)) : '—';
const ago = (v: unknown) => {
  const s = Math.max(0, (Date.now() - new Date(v as string).getTime()) / 1000);
  return s < 60 ? `${Math.round(s)}s ago` : s < 3600 ? `${Math.round(s / 60)}m ago` : s < 86400 ? `${Math.round(s / 3600)}h ago` : `${Math.round(s / 86400)}d ago`;
};
const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
const flag = (code: unknown) => (typeof code === 'string' && /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '🌐');
const countryName = (code: unknown) => {
  if (typeof code !== 'string' || !/^[A-Z]{2}$/.test(code)) return 'Unknown';
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};
const delta = (cur: number, prev: number) => (prev === 0 ? (cur > 0 ? 1 : 0) : (cur - prev) / prev);
const shortUa = (ua: unknown) => {
  const s = String(ua ?? '');
  const os = /iPhone|iPad/.test(s) ? 'iOS' : /Android/.test(s) ? 'Android' : /Windows/.test(s) ? 'Windows' : /Mac/.test(s) ? 'macOS' : 'Other';
  const br = /Edg\//.test(s) ? 'Edge' : /Chrome|CriOS/.test(s) ? 'Chrome' : /Firefox|FxiOS/.test(s) ? 'Firefox' : /Safari/.test(s) ? 'Safari' : 'Browser';
  return `${br} · ${os}`;
};

function Card({ title, children, className = '', action }: { title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={`rounded-card border border-line bg-ink-2 p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-mute">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty() {
  return <p className="py-8 text-center text-sm text-faint">No data in this period yet.</p>;
}

function tooltipStyle() {
  return { contentStyle: { background: '#0c0c11', border: '1px solid rgba(243,243,246,.12)', borderRadius: 12, color: '#f3f3f6', fontSize: 12 }, itemStyle: { color: '#f3f3f6' }, labelStyle: { color: '#8d8d99' } };
}

/** Horizontal bar list — the workhorse for every "top X" breakdown. */
function BarList({ rows, label = (r: Row) => String(r.label), value = 'sessions', limit = 10, onSelect }: { rows: Row[]; label?: (r: Row) => React.ReactNode; value?: string; limit?: number; onSelect?: (r: Row) => void }) {
  const [expanded, setExpanded] = useState(false);
  if (!rows.length) return <Empty />;
  const shown = expanded ? rows : rows.slice(0, limit);
  const max = Math.max(...rows.map((r) => n(r[value])), 1);
  const total = rows.reduce((s, r) => s + n(r[value]), 0) || 1;
  return (
    <div>
      <ul className="space-y-1.5">
        {shown.map((r, i) => (
          <li key={i}>
            <button type="button" onClick={() => onSelect?.(r)} className={`relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2 text-left text-sm ${onSelect ? 'hover:bg-ink-3' : 'cursor-default'}`}>
              <span aria-hidden="true" className="absolute inset-y-0 left-0 rounded-lg bg-accent/12" style={{ width: `${(n(r[value]) / max) * 100}%` }} />
              <span className="relative truncate">{label(r)}</span>
              <span className="relative shrink-0 tabular-nums text-mute">
                {fmt(n(r[value]))} <span className="text-faint">· {Math.round((n(r[value]) / total) * 100)}%</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {rows.length > limit && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-3 text-xs text-mute hover:text-paper">
          {expanded ? 'Show less' : `Show all ${rows.length}`}
        </button>
      )}
    </div>
  );
}

function Donut({ rows }: { rows: Row[] }) {
  if (!rows.length) return <Empty />;
  const data = rows.map((r) => ({ name: String(r.label), value: n(r.sessions) }));
  return (
    <div className="flex items-center gap-4">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={44} outerRadius={70} paddingAngle={2} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle()} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
        {data.slice(0, 6).map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="tabular-nums text-mute">{fmt(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { key: T; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-pill border border-line p-1">
      {options.map((o) => (
        <button key={o.key} type="button" onClick={() => onChange(o.key)} className={`rounded-pill px-3 py-1 text-xs transition-colors ${value === o.key ? 'bg-paper text-ink' : 'text-mute hover:text-paper'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Heatmap({ rows }: { rows: Row[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const grid = new Map(rows.map((r) => [`${n(r.dow)}-${n(r.hour)}`, n(r.sessions)]));
  const max = Math.max(1, ...grid.values());
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-[40px_repeat(24,1fr)] gap-1 text-[10px] text-faint">
        <span />
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} className="text-center">
            {h % 3 === 0 ? h : ''}
          </span>
        ))}
        {days.map((d, di) => (
          <div key={d} className="contents">
            <span className="self-center">{d}</span>
            {Array.from({ length: 24 }, (_, h) => {
              const v = grid.get(`${di + 1}-${h}`) ?? 0;
              return <span key={h} title={`${d} ${h}:00 — ${v} visits`} className="aspect-square rounded-[4px]" style={{ background: v ? `rgba(139,157,255,${0.12 + 0.88 * (v / max)})` : 'rgba(243,243,246,.04)' }} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Journey({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const [events, setEvents] = useState<Row[] | null>(null);
  useEffect(() => {
    let live = true;
    fetch(`/api/admin/journey?id=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { events?: Row[] }) => live && setEvents(d.events ?? []))
      .catch(() => live && setEvents([]));
    return () => {
      live = false;
    };
  }, [sessionId]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-ink-2 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Visit journey</h3>
          <button type="button" onClick={onClose} className="text-sm text-mute hover:text-paper">
            Close
          </button>
        </div>
        {!events ? (
          <p className="mt-8 text-sm text-mute">Loading…</p>
        ) : !events.length ? (
          <Empty />
        ) : (
          <ol className="mt-6 space-y-4 border-l border-line pl-5">
            {events.map((e, i) => {
              const props = (e.props ?? {}) as Record<string, string>;
              const detail = Object.entries(props).map(([k, v]) => `${k}: ${v}`).join(' · ');
              return (
                <li key={i} className="relative">
                  <span className={`absolute -left-[25px] top-1.5 size-2.5 rounded-full ${e.type === 'pageview' ? 'bg-accent' : 'bg-paper/50'}`} />
                  <p className="text-xs text-faint">{when(e.ts, { timeStyle: 'medium' })}</p>
                  <p className="text-sm">{e.type === 'pageview' ? `Viewed ${e.path}` : EVENT_LABELS[String(e.name)] ?? String(e.name)}</p>
                  {detail && <p className="text-xs text-mute">{detail}</p>}
                </li>
              );
            })}
          </ol>
        )}
      </aside>
    </div>
  );
}

export function DashboardView({ data, ranges, me, testimonials }: Props) {
  const router = useRouter();
  const [metric, setMetric] = useState<'visitors' | 'sessions' | 'pageviews'>('visitors');
  const [sourceTab, setSourceTab] = useState<'source' | 'referrer' | 'campaign' | 'medium'>('source');
  const [geoTab, setGeoTab] = useState<'country' | 'region' | 'city'>('country');
  const [techTab, setTechTab] = useState<'browser' | 'os' | 'screen' | 'language'>('browser');
  const [pageTab, setPageTab] = useState<'pages' | 'entry' | 'exit'>('pages');
  const [journey, setJourney] = useState<string | null>(null);
  const [updated, setUpdated] = useState(() => new Date());

  // Live: refresh server data every 30 seconds while the tab is open.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        router.refresh();
        setUpdated(new Date());
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, [router]);

  const cur = data.kpis.current as Row;
  const prev = data.kpis.previous as Row;
  const leads = data.leads as Row;
  const conversion = n(cur.sessions) ? n(leads.any_lead) / n(cur.sessions) : 0;
  const active = data.activeUsers as Row;
  const activeMinutes = (data.activeMinutes as Row[]).map((r) => ({ t: String(r.t), users: n(r.users) }));

  const kpis = [
    { label: 'Visitors', value: fmt(n(cur.visitors)), d: delta(n(cur.visitors), n(prev.visitors)) },
    { label: 'Visits', value: fmt(n(cur.sessions)), d: delta(n(cur.sessions), n(prev.sessions)) },
    { label: 'Page views', value: fmt(n(cur.pageviews)), d: delta(n(cur.pageviews), n(prev.pageviews)) },
    { label: 'Avg. visit time', value: dur(n(cur.avg_duration)), d: delta(n(cur.avg_duration), n(prev.avg_duration)) },
    { label: 'Bounce rate', value: pct(n(cur.bounce_rate)), d: delta(n(cur.bounce_rate), n(prev.bounce_rate)), invert: true },
    { label: 'New visitors', value: n(cur.visitors) ? pct(n(cur.new_visitors) / n(cur.visitors)) : '0%', d: delta(n(cur.new_visitors), n(prev.new_visitors)) },
    { label: 'Leads (form / WhatsApp / email)', value: fmt(n(leads.any_lead)), sub: `${pct(conversion)} of visits` },
  ];

  const series = useMemo(
    () =>
      (data.series as Row[]).map((r) => {
        const d = new Date(`${r.t}:00`);
        const label = data.bucket === 'hour' ? `${String(d.getHours()).padStart(2, '0')}:00` : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        return { label, visitors: n(r.visitors), sessions: n(r.sessions), pageviews: n(r.pageviews) };
      }),
    [data.series, data.bucket],
  );

  const b = data.breakdowns;
  const sourceRows = { source: b.source, referrer: b.referrer, campaign: b.campaign, medium: b.medium }[sourceTab] as Row[];
  const techRows = { browser: b.browser, os: b.os, screen: b.screen, language: b.language }[techTab] as Row[];
  const pageRows = pageTab === 'pages' ? (data.pages as Row[]).map((r) => ({ label: r.path, sessions: r.views, visitors: r.visitors })) : ((pageTab === 'entry' ? b.entry : b.exit) as Row[]);

  const geoRows = (geoTab === 'country' ? b.country : geoTab === 'region' ? b.region : b.city) as Row[];
  const geoLabel = (r: Row) => {
    const text = String(r.label);
    if (geoTab === 'country') return `${flag(text)}  ${countryName(text)}`;
    const code = text.split(', ').pop();
    return `${flag(code)}  ${text.replace(/, ([A-Z]{2})$/, (_, c: string) => `, ${countryName(c)}`)}`;
  };

  const sectionMap = new Map((data.sections as Row[]).map((r) => [String(r.section), n(r.sessions)]));
  const funnel = SECTION_ORDER.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), sessions: sectionMap.get(s) ?? 0 }));
  const scroll = [25, 50, 75, 100].map((d) => ({ label: `${d}%`, sessions: n((data.scroll as Row[]).find((r) => n(r.depth) === d)?.sessions) }));
  const events = (data.events as Row[]).filter((e) => e.name !== 'section_view' && e.name !== 'scroll');
  const points = (data.mapPoints as Row[]).map((p) => ({ x: n(p.lon), y: n(p.lat), z: n(p.sessions), name: `${p.city ?? 'Unknown'}, ${countryName(p.country)}` }));

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-6">
      <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink/85 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold tracking-[0.3em]">SIMA · ADMIN</p>
          <span className="hidden text-xs text-faint sm:inline">Updated {when(updated, { timeStyle: 'medium' })}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-pill border border-line p-1">
            {ranges.map((r) => (
              <Link key={r.key} href={`/admin?range=${r.key}`} className={`rounded-pill px-3 py-1 text-xs transition-colors ${data.range === r.key ? 'bg-paper text-ink' : 'text-mute hover:text-paper'}`}>
                {r.key}
              </Link>
            ))}
          </div>
          <a href={`/api/admin/export?range=${data.range}`} className="rounded-pill border border-line px-3 py-1.5 text-xs text-mute hover:text-paper">
            Export CSV
          </a>
          <form action={signOutAction}>
            <button className="rounded-pill border border-line px-3 py-1.5 text-xs text-mute hover:border-[#ff8a8a]/60 hover:text-[#ff8a8a]">Sign out</button>
          </form>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-mute">
            {ranges.find((r) => r.key === data.range)?.label} · Riyadh time · signed in as <span className="text-paper">{me.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-pill border border-line bg-ink-2 px-4 py-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#22c55e]" />
          </span>
          <span className="text-sm">
            <span className="font-medium tabular-nums">{fmt(data.realtime.active)}</span> on the site now
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {kpis.map((k) => {
          const up = (k.d ?? 0) >= 0;
          const good = k.invert ? !up : up;
          return (
            <div key={k.label} className="rounded-card border border-line bg-ink-2 p-4">
              <p className="text-xs text-mute">{k.label}</p>
              <p className="mt-2 text-2xl font-medium tabular-nums">{k.value}</p>
              {k.d !== undefined ? (
                <p className={`mt-1 text-xs tabular-nums ${Math.abs(k.d) < 0.005 ? 'text-faint' : good ? 'text-[#22c55e]' : 'text-[#ff8a8a]'}`}>
                  {up ? '▲' : '▼'} {Math.abs(k.d * 100).toFixed(0)}% vs previous
                </p>
              ) : (
                <p className="mt-1 text-xs text-faint">{k.sub}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Traffic chart */}
      <Card
        title="Traffic"
        className="mt-3"
        action={
          <Tabs
            value={metric}
            onChange={setMetric}
            options={[
              { key: 'visitors', label: 'Visitors' },
              { key: 'sessions', label: 'Visits' },
              { key: 'pageviews', label: 'Page views' },
            ]}
          />
        }
      >
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={series} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b9dff" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#8b9dff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(243,243,246,.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#55555f', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis allowDecimals={false} tick={{ fill: '#55555f', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle()} />
              <Area type="monotone" dataKey={metric} stroke="#8b9dff" strokeWidth={2} fill="url(#fill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card
          title="Where they came from"
          className="lg:col-span-2"
          action={
            <Tabs
              value={sourceTab}
              onChange={setSourceTab}
              options={[
                { key: 'source', label: 'Sources' },
                { key: 'referrer', label: 'Websites' },
                { key: 'campaign', label: 'Campaigns' },
                { key: 'medium', label: 'Medium' },
              ]}
            />
          }
        >
          <BarList rows={sourceRows} />
        </Card>
        <Card title="Source share">
          <Donut rows={b.source as Row[]} />
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="Visitor map" className="lg:col-span-2">
          {points.length ? (
            <div className="h-80">
              <ResponsiveContainer>
                <ScatterChart margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(243,243,246,.05)" />
                  <XAxis type="number" dataKey="x" domain={[-180, 180]} ticks={[-120, -60, 0, 60, 120]} tick={{ fill: '#55555f', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="y" domain={[-60, 80]} ticks={[-30, 0, 30, 60]} tick={{ fill: '#55555f', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <ZAxis type="number" dataKey="z" range={[40, 900]} />
                  <Tooltip {...tooltipStyle()} cursor={false} content={({ payload }) => {
                    const p = payload?.[0]?.payload as { name: string; z: number } | undefined;
                    return p ? <div className="rounded-xl border border-line bg-ink-2 px-3 py-2 text-xs">{p.name}: {fmt(p.z)} visits</div> : null;
                  }} />
                  <Scatter data={points} fill="#3ec6ff" fillOpacity={0.55} stroke="#8b9dff" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty />
          )}
          <p className="mt-2 text-xs text-faint">Each bubble is a city (longitude × latitude); bigger = more visits.</p>
        </Card>
        <Card
          title="Locations"
          action={
            <Tabs
              value={geoTab}
              onChange={setGeoTab}
              options={[
                { key: 'country', label: 'Countries' },
                { key: 'region', label: 'Regions' },
                { key: 'city', label: 'Cities' },
              ]}
            />
          }
        >
          <BarList rows={geoRows} label={geoLabel} />
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Devices">
          <Donut rows={b.device as Row[]} />
        </Card>
        <Card
          title="Technology"
          action={
            <Tabs
              value={techTab}
              onChange={setTechTab}
              options={[
                { key: 'browser', label: 'Browsers' },
                { key: 'os', label: 'OS' },
                { key: 'screen', label: 'Screens' },
                { key: 'language', label: 'Languages' },
              ]}
            />
          }
        >
          <BarList rows={techRows} limit={8} />
        </Card>
        <Card title="Site language chosen">
          <Donut rows={(b.locale as Row[]).map((r) => ({ ...r, label: r.label === 'ar' ? 'Arabic' : r.label === 'en' ? 'English' : r.label }))} />
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card
          title="Pages"
          action={
            <Tabs
              value={pageTab}
              onChange={setPageTab}
              options={[
                { key: 'pages', label: 'Top pages' },
                { key: 'entry', label: 'Entry' },
                { key: 'exit', label: 'Exit' },
              ]}
            />
          }
        >
          <BarList rows={pageRows} />
        </Card>
        <Card title="How far down the page they got">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={funnel} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis type="category" dataKey="label" tick={{ fill: '#8d8d99', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip {...tooltipStyle()} cursor={{ fill: 'rgba(243,243,246,.04)' }} />
                <Bar dataKey="sessions" name="Visits that saw it" radius={[0, 6, 6, 0]}>
                  {funnel.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
            {scroll.map((s) => (
              <div key={s.label} className="rounded-lg border border-line py-2">
                <p className="text-faint">Scrolled {s.label}</p>
                <p className="mt-0.5 tabular-nums">{fmt(s.sessions)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Interactions">
          <BarList rows={events.map((e) => ({ label: EVENT_LABELS[String(e.name)] ?? e.name, sessions: e.count }))} />
        </Card>
      </div>

      <Card title="When people visit (Riyadh time)" className="mt-3">
        <Heatmap rows={data.heatmap as Row[]} />
      </Card>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="Active users" className="lg:col-span-1">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Right now', value: n(active.now_5m) },
              { label: 'Last 30 min', value: n(active.last_30m) },
              { label: 'Today', value: n(active.today) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line px-3 py-2.5 text-center">
                <p className="text-2xl font-medium tabular-nums">{fmt(s.value)}</p>
                <p className="mt-0.5 text-[11px] text-faint">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 h-16">
            <ResponsiveContainer>
              <BarChart data={activeMinutes} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="t" hide />
                <YAxis hide allowDecimals={false} />
                <Tooltip {...tooltipStyle()} cursor={{ fill: 'rgba(243,243,246,.04)' }} />
                <Bar dataKey="users" fill="#22c55e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-xs text-faint">Active users per minute, last 30 minutes (Riyadh)</p>
          <p className="mb-2 mt-5 text-xs text-mute">On the site right now</p>
          {(data.realtime.sessions as Row[]).length ? (
            <ul className="space-y-3">
              {(data.realtime.sessions as Row[]).map((s, i) => (
                <li key={i} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate">
                      {flag(s.country)} {String(s.city ?? countryName(s.country))} · <span className="text-mute">{String(s.path)}</span>
                      {s.is_own ? <span className="ms-2 rounded-pill bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">You</span> : null}
                    </p>
                    <p className="text-xs text-faint">
                      {String(s.device)} · {String(s.browser)} · from {String(s.source)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">{ago(s.last_seen)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-faint">Nobody on the site right now.</p>
          )}
        </Card>
        <Card title="Recent visits" className="lg:col-span-2">
          {(data.recent as Row[]).length ? (
            <div className="-mx-2 max-h-[420px] overflow-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 bg-ink-2 text-xs text-faint">
                  <tr>
                    {['When', 'Where', 'From', 'Device', 'Pages', 'Time', ''].map((h) => (
                      <th key={h} className="px-2 py-2 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.recent as Row[]).map((s) => (
                    <tr key={String(s.id)} className="cursor-pointer border-t border-line hover:bg-ink-3" onClick={() => setJourney(String(s.id))}>
                      <td className="whitespace-nowrap px-2 py-2 text-mute">{when(s.started_at)}</td>
                      <td className="px-2 py-2">
                        {flag(s.country)} {[s.city, countryName(s.country)].filter((x) => x && x !== 'Unknown').join(', ') || 'Unknown'}
                      </td>
                      <td className="px-2 py-2">
                        {String(s.source)}
                        {s.utm_campaign ? <span className="text-faint"> · {String(s.utm_campaign)}</span> : null}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-mute">
                        {String(s.device)} · {String(s.os)}
                      </td>
                      <td className="px-2 py-2 tabular-nums">{fmt(n(s.pageviews))}</td>
                      <td className="px-2 py-2 tabular-nums">{dur(n(s.duration))}</td>
                      <td className="px-2 py-2 text-xs">
                        {s.is_own ? (
                          <span className="rounded-pill bg-emerald-400/15 px-2 py-0.5 text-emerald-300">You</span>
                        ) : s.is_new ? (
                          <span className="rounded-pill bg-accent/15 px-2 py-0.5 text-accent">New</span>
                        ) : (
                          <span className="text-faint">Returning</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
          <p className="mt-2 text-xs text-faint">Click a visit to see its full journey.</p>
        </Card>
      </div>

      {/* Client reviews — nothing appears on the website until it is approved here. */}
      <Card title={`Client reviews${testimonials.filter((t) => t.status === 'pending').length ? ` · ${testimonials.filter((t) => t.status === 'pending').length} waiting` : ''}`} className="mt-3">
        {testimonials.length ? (
          <ul className="max-h-[440px] space-y-3 overflow-auto">
            {testimonials.map((t) => (
              <li key={t.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="text-accent" dir="ltr">{'★'.repeat(t.rating)}</span> <span className="font-medium">{t.name}</span>
                      {t.brand ? <span className="text-mute"> · {t.brand}</span> : null}
                      <span className={`ms-2 rounded-pill px-2 py-0.5 text-xs ${t.status === 'approved' ? 'bg-[#22c55e]/15 text-[#22c55e]' : t.status === 'rejected' ? 'bg-[#ff8a8a]/15 text-[#ff8a8a]' : 'bg-accent/15 text-accent'}`}>{t.status}</span>
                    </p>
                    <p className="mt-2 text-sm text-[#cfcfd2]">{t.message}</p>
                    <p className="mt-2 text-xs text-faint">
                      {when(t.created_at)} · {String(t.locale).toUpperCase()} · {flag(t.country)} {[t.city, countryName(t.country)].filter((x) => x && x !== 'Unknown').join(', ') || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {t.status !== 'approved' && (
                      <form action={moderateTestimonialAction}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="action" value="approved" />
                        <button className="rounded-pill border border-line px-3 py-1 text-xs text-mute hover:border-[#22c55e]/60 hover:text-[#22c55e]">Approve</button>
                      </form>
                    )}
                    {t.status !== 'rejected' && (
                      <form action={moderateTestimonialAction}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="action" value="rejected" />
                        <button className="rounded-pill border border-line px-3 py-1 text-xs text-mute hover:text-paper">Hide</button>
                      </form>
                    )}
                    <form action={moderateTestimonialAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="action" value="delete" />
                      <button className="rounded-pill border border-line px-3 py-1 text-xs text-mute hover:border-[#ff8a8a]/60 hover:text-[#ff8a8a]">Delete</button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-faint">No reviews submitted yet. They appear here for approval before showing on the site.</p>
        )}
      </Card>

      {/* Security */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card
          title="Who is logged in"
          action={
            (data.admins as Row[]).length > 1 ? (
              <form action={revokeOthersAction}>
                <button className="text-xs text-mute hover:text-[#ff8a8a]">Sign out all other sessions</button>
              </form>
            ) : null
          }
        >
          <ul className="space-y-3">
            {(data.admins as Row[]).map((a) => {
              const self = a.id === me.sessionId;
              return (
                <li key={String(a.id)} className="flex items-center justify-between gap-3 rounded-xl border border-line p-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate">
                      {String(a.email)} {self && <span className="ml-1 rounded-pill bg-[#22c55e]/15 px-2 py-0.5 text-xs text-[#22c55e]">This device</span>}
                    </p>
                    <p className="text-xs text-faint">
                      {shortUa(a.user_agent)} · {flag(a.country)} {[a.city, countryName(a.country)].filter((x) => x && x !== 'Unknown').join(', ') || 'Unknown'} · active {ago(a.last_seen)} · signed in {when(a.created_at)}
                    </p>
                  </div>
                  <form action={revokeSessionAction}>
                    <input type="hidden" name="id" value={String(a.id)} />
                    <button className="shrink-0 rounded-pill border border-line px-3 py-1 text-xs text-mute hover:border-[#ff8a8a]/60 hover:text-[#ff8a8a]">{self ? 'Sign out' : 'Revoke'}</button>
                  </form>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Login history">
          <div className="max-h-[320px] overflow-auto">
            <ul className="space-y-2 text-sm">
              {(data.logins as Row[]).map((l, i) => (
                <li key={i} className="flex items-start justify-between gap-3 border-t border-line pt-2 first:border-0 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate">
                      <span className={l.success ? 'text-[#22c55e]' : 'text-[#ff8a8a]'}>{l.success ? '✓' : '✕'}</span> {String(l.email)}
                      {!l.success && <span className="text-faint"> · {String(l.reason).replace(/_/g, ' ')}</span>}
                    </p>
                    <p className="text-xs text-faint">
                      {shortUa(l.user_agent)} · {flag(l.country)} {[l.city, countryName(l.country)].filter((x) => x && x !== 'Unknown').join(', ') || 'Unknown'} · {String(l.ip ?? '')}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">{when(l.ts)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {journey && <Journey sessionId={journey} onClose={() => setJourney(null)} />}
    </div>
  );
}
