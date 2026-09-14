import Link from 'next/link';
import { SimaMark } from '@/components/icons';
import { href, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function Logo({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Link href={href(locale)} aria-label="SIMA — سِمة" className={cn('group inline-flex items-center gap-2.5', className)}>
      <SimaMark className="size-6 transition-transform duration-700 ease-out group-hover:rotate-[20deg]" />
      <span className="text-[1.05rem] font-semibold tracking-[0.18em]" dir="ltr">
        SIMA
      </span>
      <span className="hidden text-sm text-mute sm:inline" lang="ar">
        سِمة
      </span>
    </Link>
  );
}
