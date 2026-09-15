import 'server-only';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { db, ensureSchema, requireDb } from './db';
import { loginAlertMail, loginCodeMail, sendMail } from './email';
import { hmac, randomCode, randomToken, rateLimit, requestMeta, safeEqualHex, sha256 } from './security';
import { parseUserAgent } from './ua';

/** The only accounts that can ever sign in. Changing this list requires a code change and deploy. */
export const ADMIN_EMAILS = ['ghzielmorhaf@gmail.com', 'aghyadghziel@gmail.com'] as const;

export const SESSION_COOKIE = '__Host-sima_admin';
const SESSION_HOURS = 12;
const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const normalizeEmail = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase().slice(0, 254) : '');
export const isAdminEmail = (email: string) => (ADMIN_EMAILS as readonly string[]).includes(email);
const codeHash = (email: string, code: string) => hmac(`login-code:${email}:${code}`);

export type AuthResult = { ok: boolean; step: 'email' | 'code'; email?: string; message?: string };

/**
 * Step 1: email → code. The response is identical whether or not the email is an admin,
 * so the form can't be used to discover which emails are allowed.
 */
export async function requestLoginCode(rawEmail: unknown): Promise<AuthResult> {
  const email = normalizeEmail(rawEmail);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, step: 'email', message: 'Enter a valid email address.' };

  const sql = requireDb();
  await ensureSchema();
  const meta = requestMeta(await headers());
  const ipKey = sha256(meta.ip ?? 'unknown');
  const generic: AuthResult = { ok: true, step: 'code', email, message: 'If this email is authorised, a 6-digit code is on its way.' };

  if (!(await rateLimit(`code-ip:${ipKey}`, 10, 3600))) return { ok: false, step: 'email', message: 'Too many requests. Try again later.' };
  if (!isAdminEmail(email)) return generic;
  if (!(await rateLimit(`code-email:${email}`, 3, 900))) return { ...generic, message: 'A code was sent recently. Check your inbox or wait a few minutes.' };

  const code = randomCode();
  await sql`
    insert into admin_codes (email, code_hash, expires_at, attempts, created_at)
    values (${email}, ${codeHash(email, code)}, now() + make_interval(mins => ${CODE_MINUTES}), 0, now())
    on conflict (email) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, created_at = now()`;

  const mail = loginCodeMail(code);
  const sent = await sendMail({ to: [email], ...mail });
  if (!sent && process.env.NODE_ENV !== 'production') console.info(`[auth:dev] login code for ${email}: ${code}`);
  return generic;
}

/** Step 2: verify the code, create a session, alert both admins. */
export async function verifyLoginCode(rawEmail: unknown, rawCode: unknown): Promise<AuthResult> {
  const email = normalizeEmail(rawEmail);
  const code = typeof rawCode === 'string' ? rawCode.replace(/\D/g, '') : '';
  const fail = (message: string): AuthResult => ({ ok: false, step: 'code', email, message });
  if (code.length !== 6) return fail('Enter the 6-digit code.');

  const sql = requireDb();
  await ensureSchema();
  const h = await headers();
  const meta = requestMeta(h);
  const ipKey = sha256(meta.ip ?? 'unknown');
  if (!(await rateLimit(`verify-ip:${ipKey}`, 20, 900))) return fail('Too many attempts. Try again later.');

  const logAttempt = (success: boolean, reason: string) =>
    sql`insert into admin_logins (email, success, reason, ip, country, city, user_agent)
        values (${email.slice(0, 254)}, ${success}, ${reason}, ${meta.ip}, ${meta.country}, ${meta.city}, ${meta.userAgent})`;

  const rows = (await sql`select code_hash, expires_at, attempts from admin_codes where email = ${email}`) as { code_hash: string; expires_at: string; attempts: number }[];
  const row = rows[0];
  if (!isAdminEmail(email) || !row || new Date(row.expires_at).getTime() < Date.now()) {
    await logAttempt(false, 'expired_or_missing');
    return fail('This code is invalid or expired. Request a new one.');
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await sql`delete from admin_codes where email = ${email}`;
    await logAttempt(false, 'too_many_attempts');
    return fail('Too many wrong codes. Request a new one.');
  }
  if (!safeEqualHex(row.code_hash, codeHash(email, code))) {
    await sql`update admin_codes set attempts = attempts + 1 where email = ${email}`;
    await logAttempt(false, 'wrong_code');
    return fail('Wrong code. Check the email and try again.');
  }

  // One-time use: the code is gone the moment it succeeds.
  await sql`delete from admin_codes where email = ${email}`;
  const token = randomToken();
  await sql`
    insert into admin_sessions (id, email, expires_at, ip, country, city, user_agent)
    values (${sha256(token)}, ${email}, now() + make_interval(hours => ${SESSION_HOURS}), ${meta.ip}, ${meta.country}, ${meta.city}, ${meta.userAgent})`;
  await logAttempt(true, 'ok');

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });

  after(async () => {
    const ua = parseUserAgent(meta.userAgent);
    const when = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Riyadh' }).format(new Date());
    await sendMail({
      to: [...ADMIN_EMAILS],
      ...loginAlertMail({
        email,
        when: `${when} (Riyadh)`,
        where: [meta.city, meta.country].filter(Boolean).join(', ') || 'Unknown location',
        device: `${ua.browser} on ${ua.os} (${ua.device})`,
        ip: meta.ip ?? 'unknown',
      }),
    });
  });

  return { ok: true, step: 'code', email };
}

export type Admin = { email: string; sessionId: string };

/** Validates the session cookie against the database. Memoised per request. */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const sql = db();
  if (!token || !sql || token.length > 100) return null;
  await ensureSchema();
  const id = sha256(token);
  const rows = (await sql`
    update admin_sessions set last_seen = now()
    where id = ${id} and revoked_at is null and expires_at > now()
    returning email`) as { email: string }[];
  const email = rows[0]?.email;
  if (!email || !isAdminEmail(email)) return null;
  return { email, sessionId: id };
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

export async function signOut() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const sql = db();
  if (token && sql) await sql`update admin_sessions set revoked_at = now() where id = ${sha256(token)} and revoked_at is null`;
  (await cookies()).delete(SESSION_COOKIE);
}

export async function revokeSession(sessionId: string) {
  const admin = await requireAdmin();
  const sql = requireDb();
  await sql`update admin_sessions set revoked_at = now() where id = ${sessionId} and revoked_at is null`;
  return sessionId === admin.sessionId;
}

export async function revokeAllOtherSessions() {
  const admin = await requireAdmin();
  const sql = requireDb();
  await sql`update admin_sessions set revoked_at = now() where id <> ${admin.sessionId} and revoked_at is null`;
}
