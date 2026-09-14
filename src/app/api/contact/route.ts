import { NextResponse } from 'next/server';

type Payload = { name?: string; brand?: string; reach?: string; need?: string; budget?: string; message?: string; locale?: string };

const clean = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Project requests.
 * Delivers by email through Resend when RESEND_API_KEY and CONTACT_TO are set
 * (CONTACT_FROM optional, must be a verified sender). Without them it answers
 * `delivered: false` and the form offers WhatsApp / email instead, so no lead
 * is silently lost.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ delivered: false, error: 'invalid_json' }, { status: 400 });
  }

  const data = {
    name: clean(body.name, 120),
    brand: clean(body.brand, 160),
    reach: clean(body.reach, 160),
    need: clean(body.need, 80),
    budget: clean(body.budget, 40),
    message: clean(body.message),
  };
  if (!data.name || !data.brand || !data.reach || !data.message) {
    return NextResponse.json({ delivered: false, error: 'missing_fields' }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) return NextResponse.json({ delivered: false, reason: 'not_configured' });

  const text = [`Name: ${data.name}`, `Brand: ${data.brand}`, `Contact: ${data.reach}`, `Need: ${data.need || '—'}`, `Budget: ${data.budget || '—'}`, '', data.message].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? 'SIMA Website <onboarding@resend.dev>',
        to: [to],
        reply_to: data.reach.includes('@') ? data.reach : undefined,
        subject: `New project request — ${data.brand}`,
        text,
      }),
    });
    return NextResponse.json({ delivered: res.ok });
  } catch {
    return NextResponse.json({ delivered: false, reason: 'send_failed' });
  }
}
