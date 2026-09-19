import Link from 'next/link';
import { href, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** The two-part S with its saffron pin — the SIMA STUDIO symbol. */
export function Symbol({ className, pin = true }: { className?: string; pin?: boolean }) {
  return (
    <svg viewBox="330 170 340 660" aria-hidden="true" className={className} fill="currentColor">
      <path d="M660 180H500A160 160 0 0 0 500 500V400A60 60 0 0 1 500 280H660Z" />
      <path d="M340 820H500A160 160 0 0 0 500 500V600A60 60 0 0 1 500 720H340Z" />
      {pin && <circle cx="500" cy="500" r="24" className="fill-accent" />}
    </svg>
  );
}

export function Logo({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Link href={href(locale)} aria-label="SIMA STUDIO — سِمة" className={cn('group inline-flex items-center gap-2.5', className)}>
      <Symbol className="h-7 w-auto" />
      <span className="font-[family-name:var(--font-condensed)] text-[1.3rem] font-bold uppercase leading-none tracking-[0.22em]" dir="ltr">
        SIMA
      </span>
      <span className="hidden text-sm text-mute sm:inline" lang="ar">
        سِمة
      </span>
    </Link>
  );
}
