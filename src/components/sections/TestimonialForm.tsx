'use client';

import { useState, type FormEvent } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'invalid' | 'limited' | 'error';

/** Public review form. Submissions are held for admin approval before they appear. */
export function TestimonialForm() {
  const { locale, dict } = useLocale();
  const d = dict.testimonials;
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<Status>('idle');

  const field = 'mt-2 w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-paper outline-none transition-colors placeholder:text-faint focus:border-accent';

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('sending');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          brand: form.get('brand'),
          message: form.get('message'),
          website: form.get('website'),
          rating,
          locale,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) setStatus('sent');
      else setStatus(data.error === 'rate_limited' ? 'limited' : data.error === 'invalid' ? 'invalid' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <p role="status" className="mt-10 rounded-card border border-accent/40 bg-accent/[0.06] p-6 text-paper">
        {d.thanks}
      </p>
    );
  }

  return (
    <div className="mt-10">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="rounded-pill border border-line px-6 py-3 text-sm transition-colors hover:border-accent/60 hover:text-accent">
          {d.cta}
        </button>
      ) : (
        <form onSubmit={submit} className="grid gap-5 rounded-card border border-line bg-ink-2 p-7 md:grid-cols-2">
          <div>
            <label htmlFor="t-name" className="text-sm text-mute">
              {d.name}
            </label>
            <input id="t-name" name="name" required maxLength={60} className={field} />
          </div>
          <div>
            <label htmlFor="t-brand" className="text-sm text-mute">
              {d.brand} <span className="text-faint">({d.optional})</span>
            </label>
            <input id="t-brand" name="brand" maxLength={80} className={field} />
          </div>

          <fieldset className="md:col-span-2">
            <legend className="text-sm text-mute">{d.rating}</legend>
            <div className="mt-2 flex gap-1" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star} / 5`}
                  aria-pressed={rating === star}
                  className={cn('px-1 text-2xl transition-colors', star <= rating ? 'text-accent' : 'text-faint hover:text-mute')}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <div className="md:col-span-2">
            <label htmlFor="t-message" className="text-sm text-mute">
              {d.message}
            </label>
            <textarea id="t-message" name="message" required minLength={10} maxLength={600} rows={4} className={cn(field, 'resize-y')} />
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 size-px opacity-0" />

          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <button type="submit" disabled={status === 'sending'} className="rounded-pill bg-paper px-6 py-3 font-medium text-ink transition-colors hover:bg-accent disabled:opacity-50">
              {status === 'sending' ? d.sending : d.submit}
            </button>
            {status !== 'idle' && status !== 'sending' && (
              <p role="status" className="text-sm text-[#ff8a8a]">
                {status === 'invalid' ? d.invalid : status === 'limited' ? d.limited : d.error}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
