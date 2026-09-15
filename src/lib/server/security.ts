import 'server-only';
import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { db } from './db';

export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

/** Secret used for code hashing and anonymising visitor ids. Must be long and random in production. */
export function secret() {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET must be set (32+ characters)');
  return 'dev-only-secret-change-me-dev-only-secret';
}

export const hmac = (value: string) => createHmac('sha256', secret()).update(value).digest('hex');

export const randomToken = (bytes = 32) => randomBytes(bytes).toString('base64url');

/** Uniformly random 6-digit code. */
export const randomCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

export function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Fixed-window rate limit stored in Postgres, so it holds across serverless instances.
 * Returns true when the call is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const sql = db();
  if (!sql) return true;
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const rows = (await sql`
    insert into rate_limits (key, window_start, count) values (${key}, ${window}, 1)
    on conflict (key, window_start) do update set count = rate_limits.count + 1
    returning count`) as { count: number }[];
  if (Math.random() < 0.02) await sql`delete from rate_limits where window_start < ${window - 10}`;
  return (rows[0]?.count ?? 0) <= limit;
}

export type RequestMeta = {
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  userAgent: string;
};

const num = (v: string | null) => {
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Visitor IP and location from Vercel's edge headers (free on every plan). */
export function requestMeta(headers: Headers): RequestMeta {
  const forwarded = headers.get('x-forwarded-for');
  const city = headers.get('x-vercel-ip-city');
  return {
    ip: forwarded?.split(',')[0]?.trim() || headers.get('x-real-ip') || null,
    country: headers.get('x-vercel-ip-country'),
    region: headers.get('x-vercel-ip-country-region'),
    city: city ? safeDecode(city) : null,
    latitude: num(headers.get('x-vercel-ip-latitude')),
    longitude: num(headers.get('x-vercel-ip-longitude')),
    timezone: headers.get('x-vercel-ip-timezone'),
    userAgent: (headers.get('user-agent') ?? '').slice(0, 400),
  };
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
