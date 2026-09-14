import Link from 'next/link';
import { LiquidView } from '@/components/liquid/LiquidView';
import { dictionary } from '@/content/dictionary';
import { instagramUrl, studio, tiktokUrl, whatsappMessage, whatsappUrl } from '@/content/site';
import { href, type Locale } from '@/lib/i18n';
import { Logo } from './Logo';

export function Footer({ locale }: { locale: Locale }) {
  const d = dictionary[locale];
  const nav = [
    { id: 'work', label: d.nav.work },
    { id: 'services', label: d.nav.services },
    { id: 'packages', label: d.nav.packages },
    { id: 'about', label: d.nav.about },
    { id: 'contact', label: d.footer.contact },
  ];
  const link = 'text-paper/70 transition-colors hover:text-paper';

  return (
    <footer className="border-t border-line">
      {/* The site's closing signature: a slow liquid horizon that settles into the footer. */}
      <div aria-hidden="true" className="relative h-[clamp(11rem,24vw,22rem)]">
        <LiquidView mode="footer" className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-ink" />
      </div>
      <div className="container-x grid gap-12 pb-16 pt-4 md:grid-cols-12 md:pb-20">
        <div className="md:col-span-5">
          <Logo locale={locale} />
          <p className="mt-5 max-w-[30ch] text-mute">{d.footer.statement}</p>
          <p className="mt-6 text-sm text-faint">{studio.location[locale]}</p>
        </div>
        <nav aria-label={d.nav.menu} className="md:col-span-2">
          <ul className="space-y-3 text-[0.95rem]">
            {nav.map((n) => (
              <li key={n.id}>
                <Link href={`${href(locale)}#${n.id}`} className={link}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <p className="eyebrow">{d.footer.social}</p>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Instagram
              </a>
            </li>
            <li>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={link}>
                TikTok
              </a>
            </li>
            <li>
              <a href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow">{d.footer.contact}</p>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            <li>
              <a href={`mailto:${studio.email}`} className={link}>
                {studio.email}
              </a>
            </li>
            <li>
              <a href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" className={link} dir="ltr">
                {studio.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-faint sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} SIMA · سِمة. {d.footer.rights}
        </p>
        <p dir="ltr">sima.studio</p>
      </div>
    </footer>
  );
}
