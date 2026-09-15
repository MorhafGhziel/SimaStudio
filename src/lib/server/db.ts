import 'server-only';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Neon Postgres over HTTP (free tier). Returns null when DATABASE_URL is missing so the
 * public site keeps working locally without a database.
 */
let client: NeonQueryFunction<false, false> | null = null;

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  client ??= neon(url);
  return client;
}

export function requireDb() {
  const sql = db();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  return sql;
}

/** Idempotent schema. Also run once explicitly with `npm run db:setup`. */
export const SCHEMA: string[] = [
  `create table if not exists analytics_sessions (
    id text primary key,
    visitor_id text not null,
    started_at timestamptz not null default now(),
    last_seen timestamptz not null default now(),
    entry_path text not null,
    exit_path text not null,
    referrer text,
    referrer_host text,
    source text not null default 'Direct',
    utm_source text,
    utm_medium text,
    utm_campaign text,
    country text,
    region text,
    city text,
    latitude double precision,
    longitude double precision,
    timezone text,
    device text,
    browser text,
    os text,
    screen text,
    language text,
    locale text,
    is_new boolean not null default true,
    pageviews integer not null default 0
  )`,
  `create index if not exists analytics_sessions_started_idx on analytics_sessions (started_at)`,
  `create index if not exists analytics_sessions_last_seen_idx on analytics_sessions (last_seen)`,
  `create index if not exists analytics_sessions_visitor_idx on analytics_sessions (visitor_id)`,
  `create table if not exists analytics_events (
    id bigserial primary key,
    session_id text not null,
    visitor_id text not null,
    ts timestamptz not null default now(),
    type text not null,
    name text,
    path text,
    props jsonb
  )`,
  `create index if not exists analytics_events_ts_idx on analytics_events (ts)`,
  `create index if not exists analytics_events_session_idx on analytics_events (session_id)`,
  `create table if not exists admin_codes (
    email text primary key,
    code_hash text not null,
    expires_at timestamptz not null,
    attempts integer not null default 0,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists admin_sessions (
    id text primary key,
    email text not null,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null,
    last_seen timestamptz not null default now(),
    ip text,
    country text,
    city text,
    user_agent text,
    revoked_at timestamptz
  )`,
  `create table if not exists admin_logins (
    id bigserial primary key,
    email text not null,
    ts timestamptz not null default now(),
    success boolean not null,
    reason text,
    ip text,
    country text,
    city text,
    user_agent text
  )`,
  `create index if not exists admin_logins_ts_idx on admin_logins (ts)`,
  `create table if not exists rate_limits (
    key text not null,
    window_start bigint not null,
    count integer not null default 0,
    primary key (key, window_start)
  )`,
];

let schemaReady: Promise<void> | null = null;

/** Creates tables on first use per server instance (cheap no-ops afterwards). */
export function ensureSchema() {
  const sql = db();
  if (!sql) return Promise.resolve();
  schemaReady ??= (async () => {
    for (const statement of SCHEMA) await sql.query(statement);
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}
