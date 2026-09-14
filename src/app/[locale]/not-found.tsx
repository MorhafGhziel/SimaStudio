'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { href } from '@/lib/i18n';

export default function NotFound() {
  const { locale, dict } = useLocale();
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-[var(--nav)]">
      <p className="text-[clamp(6rem,4rem+10vw,14rem)] font-medium leading-none tracking-[-0.06em] text-paper/10" dir="ltr">
        404
      </p>
      <h1 className="display-md mt-4">{dict.notFound.title}</h1>
      <div className="mt-10">
        <LinkButton href={href(locale)}>{dict.notFound.cta}</LinkButton>
      </div>
    </section>
  );
}
