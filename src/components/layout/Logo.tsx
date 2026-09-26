import Link from 'next/link';
import { href, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** The wordmark: SIMA with the Arabic name سِمة beside it. */
export function Logo({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Link href={href(locale)} aria-label="SIMA STUDIO — سِمة" className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="font-[family-name:var(--font-condensed)] text-[1.3rem] font-bold uppercase leading-none tracking-[0.22em]" dir="ltr">
        SIMA
      </span>
      <span className="text-base font-bold leading-none" lang="ar">
        سِمة
      </span>
    </Link>
  );
}
