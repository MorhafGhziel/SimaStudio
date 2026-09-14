'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/icons';
import { LinkButton } from '@/components/ui/Button';
import { instagramUrl, studio, tiktokUrl, whatsappMessage, whatsappUrl } from '@/content/site';
import { href, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const EASE = [0.22, 1, 0.36, 1] as const;

function LangSwitch({ className }: { className?: string }) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|ar)/, '');
  return (
    <div dir="ltr" className={cn('flex items-center gap-2 text-xs tracking-[0.14em]', className)}>
      {(['en', 'ar'] as Locale[]).map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="text-faint">|</span>}
          <Link
            href={`/${code}${rest}`}
            hrefLang={code}
            aria-current={code === locale ? 'true' : undefined}
            aria-label={code === 'ar' ? 'العربية' : 'English'}
            className={cn('py-2 transition-colors', code === locale ? 'text-paper' : 'text-faint hover:text-paper')}
          >
            {code.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function Navbar() {
  const { locale, dict } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'work', label: dict.nav.work },
    { id: 'services', label: dict.nav.services },
    { id: 'packages', label: dict.nav.packages },
    { id: 'process', label: dict.nav.process },
    { id: 'about', label: dict.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled && !open ? 'border-b border-white/[0.07] bg-ink/55 shadow-[inset_0_-1px_0_rgb(255_255_255/0.03)] backdrop-blur-2xl backdrop-saturate-150' : 'border-b border-transparent',
        )}
      >
        <div className="container-x flex h-[var(--nav)] items-center justify-between gap-6">
          <Logo locale={locale} className="relative z-10" />

          <nav aria-label={dict.nav.menu} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {links.map((l) => (
                <li key={l.id}>
                  <Link href={`${href(locale)}#${l.id}`} className="group relative py-2 text-[0.92rem] text-paper/80 transition-colors hover:text-paper">
                    {l.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-paper transition-transform duration-500 ease-out group-hover:scale-x-100 rtl:origin-right" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3 sm:gap-5">
            <LangSwitch className="hidden sm:flex" />
            <LinkButton href={`${href(locale)}#contact`} className="hidden h-11 px-5 text-sm sm:inline-flex sm:h-11">
              {dict.nav.start}
            </LinkButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.nav.close : dict.nav.menu}
              className="relative -me-2 grid size-11 place-items-center lg:hidden"
            >
              <span className={cn('absolute h-px w-6 bg-paper transition-transform duration-500 ease-out', open ? 'rotate-45' : '-translate-y-1')} />
              <span className={cn('absolute h-px w-6 bg-paper transition-transform duration-500 ease-out', open ? '-rotate-45' : 'translate-y-1')} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[var(--nav)] lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label={dict.nav.menu} className="container-x flex flex-1 flex-col overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
              <ul>
                {links.map((l, i) => (
                  <motion.li key={l.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: EASE }} className="border-b border-line">
                    <Link href={`${href(locale)}#${l.id}`} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4">
                      <span className="text-[2.4rem] font-medium leading-tight tracking-[-0.03em] rtl:tracking-normal">{l.label}</span>
                      <span className="text-xs text-faint" dir="ltr">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-auto space-y-6 pt-10">
                <LinkButton href={`${href(locale)}#contact`} onClick={() => setOpen(false)} magnetic={false} className="w-full">
                  {dict.nav.start}
                </LinkButton>
                <div className="flex items-center justify-between">
                  <LangSwitch />
                  <div className="flex gap-1 text-paper/70">
                    <a href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center">
                      <WhatsAppIcon className="size-5" />
                    </a>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-11 place-items-center">
                      <InstagramIcon className="size-5" />
                    </a>
                    <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid size-11 place-items-center">
                      <TikTokIcon className="size-5" />
                    </a>
                  </div>
                </div>
                <p className="text-xs text-faint">
                  {studio.email} · {studio.location[locale]}
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
