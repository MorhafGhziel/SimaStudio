import 'server-only';

type Mail = { to: string[]; subject: string; text: string; html: string };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Sends through Resend. Returns false (never throws) so auth flows can respond uniformly. */
export async function sendMail({ to, subject, text, html }: Mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') console.info(`[mail:dev] to=${to.join(',')} subject="${subject}"\n${text}`);
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.AUTH_FROM ?? process.env.CONTACT_FROM ?? 'SIMA Admin <onboarding@resend.dev>', to, subject, text, html }),
    });
    if (!res.ok && process.env.NODE_ENV !== 'production') console.warn('[mail] Resend rejected the message:', res.status, await res.text());
    return res.ok;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('[mail] send failed', error);
    return false;
  }
}

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#050507;font-family:Segoe UI,Arial,sans-serif;color:#f3f3f6">
<div style="max-width:480px;margin:0 auto;padding:40px 28px">
<p style="font-weight:700;letter-spacing:.22em;font-size:14px;margin:0 0 28px">SIMA · ADMIN</p>
${body}
<p style="color:#55555f;font-size:12px;margin-top:36px">You receive this because your email is an authorised SIMA admin.</p>
</div></body></html>`;

export function loginCodeMail(code: string) {
  return {
    subject: `SIMA admin code: ${code}`,
    text: `Your SIMA admin login code is ${code}.\n\nIt expires in 30 minutes and can only be used once. If you didn't request it, ignore this email.`,
    html: shell(`<p style="color:#8d8d99;margin:0 0 14px">Your login code</p>
<p style="font-size:40px;letter-spacing:.3em;font-weight:700;margin:0 0 18px">${code}</p>
<p style="color:#8d8d99;margin:0">Expires in 30 minutes and works once. If you didn't request it, ignore this email.</p>`),
  };
}

export function loginAlertMail(info: { email: string; when: string; where: string; device: string; ip: string }) {
  const rows = [
    ['Who', info.email],
    ['When', info.when],
    ['Where', info.where],
    ['Device', info.device],
    ['IP', info.ip],
  ];
  return {
    subject: `New SIMA admin login: ${info.email}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nIf this wasn't one of you, open the dashboard and sign out all sessions.`,
    html: shell(`<p style="font-size:20px;margin:0 0 20px">New admin login</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">${rows
      .map(([k, v]) => `<tr><td style="color:#8d8d99;padding:8px 0;border-top:1px solid #1c1c24;width:80px">${k}</td><td style="padding:8px 0;border-top:1px solid #1c1c24">${escapeHtml(v)}</td></tr>`)
      .join('')}</table>
<p style="color:#8d8d99;margin:22px 0 0">If this wasn't one of you, open the dashboard and sign out all sessions.</p>`),
  };
}
