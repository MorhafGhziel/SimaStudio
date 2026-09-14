'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Mail } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { instagramUrl, studio, whatsappMessage, whatsappUrl } from '@/content/site';
import { PACKAGE_EVENT } from '@/lib/events';
import { cn } from '@/lib/utils';

type Fields = { name: string; brand: string; reach: string; need: string; budget: string; message: string };
const empty: Fields = { name: '', brand: '', reach: '', need: '', budget: '', message: '' };

const field =
  'mt-2 w-full rounded-xl border border-line bg-ink-2 px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-faint focus:border-accent/60 aria-[invalid=true]:border-red-400/60';

export function Contact() {
  const { locale, dict } = useLocale();
  const c = dict.contact;
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle');

  // Package buttons pre-select the budget.
  useEffect(() => {
    const onPick = (e: Event) => setValues((v) => ({ ...v, budget: c.budgets[(e as CustomEvent<number>).detail] ?? v.budget }));
    window.addEventListener(PACKAGE_EVENT, onPick);
    return () => window.removeEventListener(PACKAGE_EVENT, onPick);
  }, [c.budgets]);

  const set = (key: keyof Fields, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const summary = [
    `${c.name}: ${values.name}`,
    `${c.brand}: ${values.brand}`,
    `${c.reach}: ${values.reach}`,
    `${c.need}: ${values.need || '—'}`,
    `${c.budget}: ${values.budget || '—'}`,
    '',
    values.message,
  ].join('\n');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const missing = (['name', 'brand', 'reach', 'message'] as (keyof Fields)[]).filter((k) => !values[k].trim());
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((k) => [k, true])));
      document.getElementById(`c-${missing[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, locale }) });
      const data = (await res.json()) as { delivered?: boolean };
      setStatus(res.ok && data.delivered ? 'sent' : 'fallback');
    } catch {
      setStatus('fallback');
    }
  };

  const label = (key: keyof Fields, text: string, required = true) => (
    <label htmlFor={`c-${key}`} className="text-sm text-mute">
      {text}
      {required && <span className="text-accent"> *</span>}
    </label>
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y border-t border-line">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <RevealLines lines={[c.title]} className="display-lg" />
          <span id="contact-title" className="sr-only">
            {c.title}
          </span>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[34ch] text-lg text-mute">{c.text}</p>
            <p className="mt-12 text-sm text-faint">{c.direct}</p>
            <ul className="mt-4 space-y-2">
              {[
                { href: whatsappUrl(whatsappMessage[locale]), label: 'WhatsApp', value: studio.whatsappDisplay, icon: <WhatsAppIcon className="size-5" /> },
                { href: instagramUrl, label: 'Instagram', value: `@${studio.instagram}`, icon: <InstagramIcon className="size-5" /> },
                { href: `mailto:${studio.email}`, label: 'Email', value: studio.email, icon: <Mail className="size-5" strokeWidth={1.6} /> },
              ].map((ch) => (
                <li key={ch.label}>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    data-cursor="open"
                    className="group flex items-center gap-4 rounded-2xl border border-line px-5 py-4 transition-colors hover:border-accent/40"
                  >
                    <span className="text-accent">{ch.icon}</span>
                    <span className="flex-1">{ch.label}</span>
                    <span className="text-sm text-mute transition-colors group-hover:text-paper" dir="ltr">
                      {ch.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-card border border-line bg-ink-2/50 p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'sent' || status === 'fallback' ? (
                <motion.div key="done" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-10 text-center">
                  <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="mx-auto grid size-16 place-items-center rounded-full border border-accent/50 text-accent">
                    <Check className="size-7" strokeWidth={1.5} />
                  </motion.span>
                  <h3 className="mt-8 text-3xl font-medium tracking-[-0.02em]">{status === 'sent' ? c.successTitle : c.fallbackTitle}</h3>
                  <p className="mx-auto mt-4 max-w-[38ch] text-mute">{status === 'sent' ? c.successText : c.fallbackText}</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a href={whatsappUrl(summary)} target="_blank" rel="noopener noreferrer" data-cursor="open" className="inline-flex h-12 items-center gap-2 rounded-pill bg-paper px-6 font-medium text-ink transition-colors hover:bg-accent">
                      <WhatsAppIcon className="size-4" /> {c.successWhatsapp}
                    </a>
                    {status === 'fallback' && (
                      <a href={`mailto:${studio.email}?subject=${encodeURIComponent(`Project request — ${values.brand}`)}&body=${encodeURIComponent(summary)}`} data-cursor="open" className="inline-flex h-12 items-center gap-2 rounded-pill border border-line px-6 transition-colors hover:border-paper/40">
                        <Mail className="size-4" strokeWidth={1.6} /> {c.email}
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setValues(empty);
                      setStatus('idle');
                    }}
                    className="mt-8 text-sm text-faint underline-offset-4 hover:text-paper hover:underline"
                  >
                    {c.another}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="grid gap-6 sm:grid-cols-2">
                  <div>
                    {label('name', c.name)}
                    <input id="c-name" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} aria-invalid={errors.name} className={field} />
                  </div>
                  <div>
                    {label('brand', c.brand)}
                    <input id="c-brand" autoComplete="organization" value={values.brand} onChange={(e) => set('brand', e.target.value)} aria-invalid={errors.brand} className={field} />
                  </div>
                  <div className="sm:col-span-2">
                    {label('reach', c.reach)}
                    <input id="c-reach" autoComplete="email" dir="ltr" value={values.reach} onChange={(e) => set('reach', e.target.value)} aria-invalid={errors.reach} className={cn(field, locale === 'ar' && 'text-right')} placeholder="05X XXX XXXX / name@brand.com" />
                  </div>

                  <fieldset className="sm:col-span-2">
                    <legend className="text-sm text-mute">{c.need}</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.needs.map((n) => (
                        <button key={n} type="button" aria-pressed={values.need === n} onClick={() => set('need', values.need === n ? '' : n)} className={cn('rounded-pill border px-4 py-2 text-sm transition-colors', values.need === n ? 'border-accent bg-accent text-ink' : 'border-line text-paper/80 hover:border-paper/30')}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="sm:col-span-2">
                    <legend className="text-sm text-mute">{c.budget}</legend>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {c.budgets.map((b) => (
                        <button key={b} type="button" aria-pressed={values.budget === b} onClick={() => set('budget', values.budget === b ? '' : b)} className={cn('rounded-xl border px-3 py-3 text-sm transition-colors', values.budget === b ? 'border-accent bg-accent text-ink' : 'border-line text-paper/80 hover:border-paper/30')}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="sm:col-span-2">
                    {label('message', c.message)}
                    <textarea id="c-message" rows={5} value={values.message} onChange={(e) => set('message', e.target.value)} aria-invalid={errors.message} placeholder={c.messagePlaceholder} className={cn(field, 'resize-none')} />
                  </div>

                  {Object.values(errors).some(Boolean) && (
                    <p role="alert" className="text-sm text-red-300 sm:col-span-2">
                      {c.required}
                    </p>
                  )}

                  <Button type="submit" disabled={status === 'sending'} arrow className="w-full sm:col-span-2">
                    {status === 'sending' ? c.sending : c.send}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
