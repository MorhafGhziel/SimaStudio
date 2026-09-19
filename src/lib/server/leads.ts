import 'server-only';
import { requireAdmin } from './auth';
import { db, ensureSchema, requireDb } from './db';
import { hmac, rateLimit, type RequestMeta } from './security';

/** Project requests. Saved before anything else happens, so a failed email never loses one. */

export type LeadInput = {
  name: string;
  brand: string;
  reach: string;
  reachType: 'email' | 'phone';
  need: string;
  budget: string;
  pkg: string;
  message: string;
  locale: 'ar' | 'en';
  entryPath: string;
  sessionId: string;
};

export type Lead = {
  id: number;
  created_at: string;
  name: string;
  brand: string;
  reach: string;
  reach_type: string;
  need: string | null;
  budget: string | null;
  package: string | null;
  message: string | null;
  locale: string;
  entry_path: string | null;
  status: string;
  emailed: boolean;
  country: string | null;
  city: string | null;
};

export const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Returns the new row's id, `null` when there is no database, or 'rate_limited'. */
export async function saveLead(input: LeadInput, meta: RequestMeta): Promise<number | null | 'rate_limited'> {
  const sql = db();
  if (!sql) return null;
  await ensureSchema();
  const ipHash = hmac(`lead:${meta.ip ?? 'unknown'}`).slice(0, 32);
  // Generous for a real person retrying, tight enough that a script cannot flood the inbox.
  if (!(await rateLimit(`lead:${ipHash}`, 5, 3600))) return 'rate_limited';
  const rows = (await sql`
    insert into leads (name, brand, reach, reach_type, need, budget, package, message, locale, entry_path, session_id, ip_hash, country, city)
    values (${input.name}, ${input.brand}, ${input.reach}, ${input.reachType}, ${input.need || null}, ${input.budget || null}, ${input.pkg || null},
            ${input.message || null}, ${input.locale}, ${input.entryPath || null}, ${input.sessionId || null}, ${ipHash}, ${meta.country}, ${meta.city})
    returning id`) as { id: number }[];
  return rows[0]?.id ?? null;
}

export async function markLeadEmailed(id: number) {
  const sql = db();
  if (!sql) return;
  await sql`update leads set emailed = true where id = ${id}`;
}

export async function listLeads(): Promise<Lead[]> {
  await requireAdmin();
  const sql = requireDb();
  await ensureSchema();
  return (await sql`
    select id, created_at, name, brand, reach, reach_type, need, budget, package, message, locale, entry_path, status, emailed, country, city
    from leads order by (status = 'new') desc, created_at desc limit 200`) as Lead[];
}

export async function setLeadStatus(id: number, status: LeadStatus) {
  await requireAdmin();
  const sql = requireDb();
  await sql`update leads set status = ${status} where id = ${id}`;
}

export async function deleteLead(id: number) {
  await requireAdmin();
  const sql = requireDb();
  await sql`delete from leads where id = ${id}`;
}
