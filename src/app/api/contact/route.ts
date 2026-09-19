import { NextResponse } from 'next/server';
import { studio } from '@/content/site';
import { parseReach } from '@/lib/reach';
import { markLeadEmailed, saveLead } from '@/lib/server/leads';
import { requestMeta } from '@/lib/server/security';
import { isBot } from '@/lib/server/ua';

const clean = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function resend(key: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Project requests. In order: keep bots out, check the contact detail can be reached, save
 * the request in the database, email it to the studio, then confirm to the client.
 *
 * `delivered` is true when the request is safely stored OR emailed. Only when neither worked
 * does the form offer WhatsApp / email instead, so no lead is silently lost.
 * Email needs RESEND_API_KEY + CONTACT_TO; the client's confirmation also needs CONTACT_FROM
 * (a verified sender), because Resend's test sender can only write to the account owner.
 */
export async function POST(request: Request) {
  const meta = requestMeta(request.headers);
  if (isBot(meta.userAgent)) return NextResponse.json({ delivered: false, error: 'invalid' }, { status: 400 });

  const raw = await request.text();
  if (raw.length > 8000) return NextResponse.json({ delivered: false, error: 'too_large' }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ delivered: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: a hidden field only a bot fills in. Answer as if it worked.
  if (typeof body.website === 'string' && body.website.length > 0) return NextResponse.json({ delivered: true });

  const data = {
    name: clean(body.name, 120),
    brand: clean(body.brand, 160),
    need: clean(body.need, 80),
    budget: clean(body.budget, 40),
    pkg: clean(body.pkg, 40),
    message: clean(body.message),
    locale: body.locale === 'en' ? ('en' as const) : ('ar' as const),
    entryPath: clean(body.entry, 200),
    sessionId: clean(body.sid, 80),
  };
  const reach = parseReach(clean(body.reach, 160));
  if (!data.name || !data.brand) return NextResponse.json({ delivered: false, error: 'missing_fields' }, { status: 422 });
  if (!reach) return NextResponse.json({ delivered: false, error: 'invalid_reach' }, { status: 422 });

  // 1 · Store it.
  let leadId: number | null = null;
  try {
    const saved = await saveLead({ ...data, reach: reach.value, reachType: reach.type }, meta);
    if (saved === 'rate_limited') return NextResponse.json({ delivered: false, error: 'rate_limited' }, { status: 429 });
    leadId = saved;
  } catch {
    leadId = null; // the email below is still a second chance
  }

  // 2 · Tell the studio.
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  let emailed = false;
  if (key && to) {
    const where = [meta.city, meta.country].filter(Boolean).join(', ');
    const text = [
      `Name: ${data.name}`,
      `Company: ${data.brand}`,
      reach.type === 'phone' ? `WhatsApp: ${reach.value}  →  https://wa.me/${reach.wa}` : `Email: ${reach.value}`,
      `Need: ${data.need || '—'}`,
      `Budget: ${data.budget || '—'}`,
      `Package clicked: ${data.pkg || '—'}`,
      '',
      data.message || '(no message)',
      '',
      `Language: ${data.locale.toUpperCase()}${data.entryPath ? ` · first page: ${data.entryPath}` : ''}${where ? ` · ${where}` : ''}`,
      leadId ? `Saved as request #${leadId}: ${studio.url}/admin` : 'NOT saved in the database. This email is the only copy.',
    ].join('\n');
    emailed = await resend(key, {
      from: process.env.CONTACT_FROM ?? 'SIMA Website <onboarding@resend.dev>',
      to: [to],
      reply_to: reach.type === 'email' ? reach.value : undefined,
      subject: `New project request — ${data.brand}${data.pkg ? ` (${data.pkg})` : ''}`,
      text,
    });
    if (emailed && leadId) await markLeadEmailed(leadId).catch(() => {});

    // 3 · Confirm to the client, when they left an email and we have a real sender.
    if (emailed && reach.type === 'email' && process.env.CONTACT_FROM) {
      const ar = data.locale === 'ar';
      await resend(key, {
        from: process.env.CONTACT_FROM,
        to: [reach.value],
        reply_to: to,
        subject: ar ? 'وصلنا طلبك — سِمة' : 'We have your request — SIMA',
        text: ar
          ? `${data.name}، السلام عليكم\n\nوصلنا طلبك بخصوص ${data.brand}. سنرد عليك خلال يوم عمل واحد بسعر ومدة واضحين.\n\nولرد أسرع، راسلنا عبر واتساب: https://wa.me/${studio.whatsapp}\n\nسِمة\n${studio.url}/ar`
          : `Hello ${data.name},\n\nWe have your request about ${data.brand}. You will hear back within one business day with a clear price and timeline.\n\nFor a faster reply, message us on WhatsApp: https://wa.me/${studio.whatsapp}\n\nSIMA\n${studio.url}/en`,
      });
    }
  }

  return NextResponse.json({ delivered: leadId !== null || emailed }, { headers: { 'Cache-Control': 'no-store' } });
}
