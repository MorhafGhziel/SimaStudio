'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Mail, Phone } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { instagramUrl, studio, whatsappMessage, whatsappUrl } from '@/content/site';
import { PACKAGE_EVENT, type PackagePick } from '@/lib/events';
import { parseReach } from '@/lib/reach';
import { href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Fields = { name: string; brand: string; reach: string; need: string; budget: string; message: string; pkg: string; website: string };
const empty: Fields = { name: '', brand: '', reach: '', need: '', budget: '', message: '', pkg: '', website: '' };

const field =
  'mt-2 w-full rounded-xl border border-line bg-ink-2 px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-faint focus:border-accent/60 aria-[invalid=true]:border-red-400/60';

export function Contact() {
  const { locale, dict } = useLocale();
  const c = dict.contact;
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle');
  const [notice, setNotice] = useState<'' | 'reach' | 'limited'>('');

  // Package buttons pre-select the budget.
  useEffect(() => {
    const onPick = (e: Event) => {
      const pick = (e as CustomEvent<PackagePick>).detail;
      setValues((v) => ({ ...v, budget: c.budgets[pick.budget] ?? v.budget, pkg: pick.pkg }));
    };
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
    ...(values.pkg ? [`${c.pkg}: ${values.pkg}`] : []),
    '',
    values.message,
  ].join('\n');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice('');
    // The message is optional: the buttons above already say what is needed.
    const missing = (['name', 'brand', 'reach'] as (keyof Fields)[]).filter((k) => !values[k].trim());
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((k) => [k, true])));
      document.getElementById(`c-${missing[0]}`)?.focus();
      return;
    }
    // A number or address we cannot reach is a lost lead, so catch the typo now.
    if (!parseReach(values.reach)) {
      setErrors({ reach: true });
      setNotice('reach');
      document.getElementById('c-reach')?.focus();
      return;
    }
    setStatus('sending');
    try {
      let entry = '';
      let sid = '';
      try {
        entry = window.sessionStorage.getItem('sima_entry') ?? '';
        sid = window.sessionStorage.getItem('sima_sid') ?? '';
      } catch {
        // storage can be blocked; the request still goes through
      }
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, locale, entry, sid }) });
      if (res.status === 429) {
        setStatus('idle');
        setNotice('limited');
        return;
      }
      if (res.status === 422) {
        setStatus('idle');
        setErrors({ reach: true });
        setNotice('reach');
        return;
      }
      const data = (await res.json()) as { delivered?: boolean };
      const delivered = res.ok && !!data.delivered;
      window.dispatchEvent(new CustomEvent('sima:track', { detail: { name: 'contact_submit', props: { delivered: delivered ? 'yes' : 'no', need: values.need || 'none', budget: values.budget || 'none', pkg: values.pkg || 'none' } } }));
      setStatus(delivered ? 'sent' : 'fallback');
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
                { href: whatsappUrl(c.callText), label: c.call, value: c.callValue, icon: <Phone className="size-5" strokeWidth={1.6} /> },
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
                    <span className="text-sm text-mute transition-colors group-hover:text-paper" dir="auto">
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
                    <input id="c-reach" autoComplete="email" dir="ltr" value={values.reach} onChange={(e) => set('reach', e.target.value)} aria-invalid={errors.reach} className={cn(field, locale === 'ar' && 'text-right')} placeholder="05xxxxxxxx / name@company.com" aria-describedby="c-reach-hint" />
                    <p id="c-reach-hint" className={cn('mt-2 text-xs', notice === 'reach' ? 'text-red-300' : 'text-faint')}>
                      {notice === 'reach' ? c.reachInvalid : c.reachHint}
                    </p>
                  </div>
                  {/* Honeypot: hidden from people, irresistible to bots. Clipped in place, never pushed off-screen: in RTL that would widen the page. */}
                  <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden opacity-0 [clip:rect(0,0,0,0)]">
                    <label htmlFor="c-website">Website</label>
                    <input id="c-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
                  </div>

                  <fieldset className="sm:col-span-2">
                    <legend className="text-sm text-mute">{c.need}</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.needs.map((n) => (
                        <button key={n} type="button" aria-pressed={values.need === n} onClick={() => set('need', values.need === n ? '' : n)} className={cn('rounded-pill border px-4 py-2 text-sm transition-colors', values.need === n ? 'border-accent bg-accent text-ink' : 'border-line text-[#c4c4c0] hover:border-paper/30')}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="sm:col-span-2">
                    <legend className="flex w-full items-center justify-between gap-3 text-sm text-mute">
                      {c.budget}
                      {values.pkg && (
                        <button type="button" onClick={() => set('pkg', '')} className="inline-flex items-center gap-1.5 rounded-pill border border-accent/50 px-3 py-1 text-xs text-accent transition-colors hover:border-accent" dir="ltr">
                          {values.pkg} <span aria-hidden="true">×</span>
                          <span className="sr-only">{c.pkg}</span>
                        </button>
                      )}
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {c.budgets.map((b) => (
                        <button key={b} type="button" aria-pressed={values.budget === b} onClick={() => set('budget', values.budget === b ? '' : b)} className={cn('rounded-xl border px-3 py-3 text-sm transition-colors', values.budget === b ? 'border-accent bg-accent text-ink' : 'border-line text-[#c4c4c0] hover:border-paper/30')}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="sm:col-span-2">
                    {label('message', c.message, false)}
                    <textarea id="c-message" rows={5} value={values.message} onChange={(e) => set('message', e.target.value)} aria-invalid={errors.message} placeholder={c.messagePlaceholder} className={cn(field, 'resize-none')} />
                  </div>

                  {(notice === 'limited' || (Object.values(errors).some(Boolean) && notice !== 'reach')) && (
                    <p role="alert" className="text-sm text-red-300 sm:col-span-2">
                      {notice === 'limited' ? c.limited : c.required}
                    </p>
                  )}

                  <Button type="submit" disabled={status === 'sending'} arrow className="w-full sm:col-span-2">
                    {status === 'sending' ? c.sending : c.send}
                  </Button>
                  <ul className="space-y-1.5 text-xs text-faint sm:col-span-2">
                    {c.assure.map((line) => (
                      <li key={line} className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2} />
                        {line}
                      </li>
                    ))}
                    <li>
                      <Link href={href(locale, '/privacy')} className="underline-offset-4 transition-colors hover:text-paper hover:underline">
                        {c.privacy}
                      </Link>
                    </li>
                  </ul>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
