import 'server-only';
import { projects } from '@/content/projects';
import { requireAdmin } from './auth';
import { db, ensureSchema, requireDb } from './db';
import { hmac, rateLimit, type RequestMeta } from './security';

/**
 * Client reviews. Anyone can submit; nothing is published until an admin approves it,
 * so the site never shows unverified or abusive text.
 */

export type Testimonial = {
  id: number;
  name: string;
  brand: string | null;
  rating: number;
  message: string;
  locale: string;
  created_at: string;
};

export type AdminTestimonial = Testimonial & { status: string; country: string | null; city: string | null; reviewed_at: string | null };

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '');

export type SubmitResult = { ok: boolean; error?: 'invalid' | 'rate_limited' | 'unavailable' };

export async function submitTestimonial(input: { name?: unknown; brand?: unknown; rating?: unknown; message?: unknown; locale?: unknown }, meta: RequestMeta): Promise<SubmitResult> {
  const name = clean(input.name, 60);
  const brand = clean(input.brand, 80);
  const message = clean(input.message, 600);
  const rating = Number(input.rating);
  const locale = input.locale === 'en' ? 'en' : 'ar';

  // Validate before touching the database, so bad input is always reported as invalid.
  if (name.length < 2 || message.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: 'invalid' };

  const sql = db();
  if (!sql) return { ok: false, error: 'unavailable' };

  await ensureSchema();
  const ipHash = hmac(`testimonial:${meta.ip ?? 'unknown'}`).slice(0, 32);
  if (!(await rateLimit(`testimonial:${ipHash}`, 3, 86_400))) return { ok: false, error: 'rate_limited' };

  await sql`
    insert into testimonials (name, brand, rating, message, locale, ip_hash, country, city)
    values (${name}, ${brand || null}, ${rating}, ${message}, ${locale}, ${ipHash}, ${meta.country}, ${meta.city})`;
  return { ok: true };
}

/**
 * Names of our self-initiated concept projects. A concept has no client, so a review that
 * names one would contradict its "concept" label; those are never shown, even if approved.
 */
const conceptKeys = projects
  .filter((p) => !p.client)
  .flatMap((p) => [p.slug.split('-')[0], p.name.replace(/\(.*\)/, ''), p.arName.split(/[—(]/)[0]])
  .map((k) => k.trim().toLowerCase())
  .filter((k) => k.length >= 3);

const namesConcept = (r: Testimonial) => {
  const text = `${r.brand ?? ''} ${r.name} ${r.message}`.toLowerCase();
  return conceptKeys.some((k) => text.includes(k));
};

/** Public: only approved reviews, newest first. Safe to call from the website. */
export async function getApprovedTestimonials(limit = 12): Promise<Testimonial[]> {
  const sql = db();
  if (!sql) return [];
  try {
    await ensureSchema();
    const rows = (await sql`
      select id, name, brand, rating, message, locale, created_at
      from testimonials where status = 'approved'
      order by created_at desc limit ${limit + 10}`) as Testimonial[];
    return rows.filter((r) => !namesConcept(r)).slice(0, limit);
  } catch {
    return [];
  }
}

export async function listTestimonials(): Promise<AdminTestimonial[]> {
  await requireAdmin();
  const sql = requireDb();
  await ensureSchema();
  return (await sql`
    select id, name, brand, rating, message, locale, status, created_at, reviewed_at, country, city
    from testimonials
    order by (status = 'pending') desc, created_at desc limit 200`) as AdminTestimonial[];
}

export async function setTestimonialStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
  await requireAdmin();
  const sql = requireDb();
  if (!Number.isInteger(id)) return;
  await sql`update testimonials set status = ${status}, reviewed_at = now() where id = ${id}`;
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  const sql = requireDb();
  if (!Number.isInteger(id)) return;
  await sql`delete from testimonials where id = ${id}`;
}
