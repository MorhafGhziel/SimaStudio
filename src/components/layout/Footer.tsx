import Link from 'next/link';
import { dictionary } from '@/content/dictionary';
import { landings } from '@/content/landing';
import { instagramUrl, legal, linkedinUrl, studio, tiktokUrl, whatsappMessage, whatsappUrl, xUrl } from '@/content/site';
import { href, type Locale } from '@/lib/i18n';
import { FooterSilk } from './FooterSilk';
import { Logo } from './Logo';

export function Footer({ locale }: { locale: Locale }) {
  const d = dictionary[locale];
  const nav = [
    { id: 'work', label: d.nav.work },
    { id: 'services', label: d.nav.services },
    { id: 'packages', label: d.nav.packages },
    { id: 'process', label: d.nav.process },
    { id: 'contact', label: d.footer.contact },
  ];
  const link = 'text-[#adaca8] transition-colors hover:text-paper';

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-ink">
      <div className="absolute inset-0 -z-10">
        <FooterSilk />
      </div>
      <div className="container-x grid grid-cols-2 gap-x-8 gap-y-10 pb-40 pt-14 md:grid-cols-12 md:gap-12 md:pb-56 md:pt-20">
        <div className="col-span-2 md:col-span-4">
          <Logo locale={locale} arabic />
          <p className="mt-5 max-w-[30ch] text-mute">{d.footer.statement}</p>
          <a
            href="/brand/SIMA-STUDIO-Brand-Identity.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="open"
            className="group mt-7 inline-flex items-center gap-3 rounded-pill border border-line px-5 py-3 text-sm text-paper transition-colors hover:border-accent/50"
          >
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-accent text-xs text-ink transition-transform duration-500 group-hover:translate-y-0.5">
              ↗
            </span>
            {d.footer.brand}
            <span className="text-xs text-faint" dir="ltr">
              PDF · 20 MB
            </span>
          </a>
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
        <nav aria-label={d.footer.explore} className="md:col-span-2">
          <p className="eyebrow">{d.footer.explore}</p>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            {landings.map((l) => (
              <li key={l.slug}>
                <Link href={href(locale, `/${l.slug}`)} className={link}>
                  {l.title[locale]}
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
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={link}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={xUrl} target="_blank" rel="noopener noreferrer" className={link}>
                X
              </a>
            </li>
            <li>
              <a href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
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
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {legal && (
            <span>
              {legal.label[locale]}: <span dir="ltr">{legal.value}</span>
            </span>
          )}
          <Link href={href(locale, '/privacy')} className="transition-colors hover:text-paper">
            {d.footer.privacy}
          </Link>
          <span dir="ltr">{studio.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
        </p>
      </div>
    </footer>
  );
}
