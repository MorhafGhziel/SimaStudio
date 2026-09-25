import type { T } from '@/lib/i18n';

/**
 * ─────────────────────────────────────────────────────────────
 *  Studio settings — replace every value marked PLACEHOLDER
 *  before launching.
 * ─────────────────────────────────────────────────────────────
 */
export const studio = {
  name: 'SIMA',
  arName: 'سِمة',
  url: 'https://www.simastudio.it.com', // canonical production domain (apex redirects here)
  email: 'simastudio7@gmail.com',
  whatsapp: '966582737120', // international format, no + or spaces
  whatsappDisplay: '+966 58 273 7120',
  instagram: 'simastudio7', // handle without @
  tiktok: 'simastudio7',
  x: 'simastudio7',
  linkedin: 'sima-studio7', // company page slug
};

/**
 * The people behind the studio. The "who is behind SIMA" section stays hidden while this is
 * empty. Real names and real photos only (`/public/team/…`).
 */
export type Person = { name: T; role: T; city: T; bio: T; photo: string; linkedin?: string };
export const team: Person[] = [];

/**
 * Legal identity shown in the footer: a commercial registration or freelance document number.
 * `null` hides the line. Never put a number here that is not yours and currently valid.
 */
export const legal: { label: T; value: string } | null = null;

/**
 * How clients can pay. Written once here; the FAQ, pricing terms and landing pages read it.
 * No crypto: SAMA and the Ministry of Finance state virtual currencies are not approved in the
 * Kingdom, so a Saudi business site must not advertise them as a way to pay.
 */
export const paymentMethods: T = {
  en: 'Bank transfer or STC Pay in Saudi Arabia, and Wise or PayPal for clients abroad.',
  ar: 'تحويل بنكي أو STC Pay داخل السعودية، أو عبر Wise أو PayPal للعملاء من خارجها.',
};

export const whatsappMessage: T = {
  en: "Hello, I'd like a website for my company. Could you share the details and prices?",
  ar: 'السلام عليكم، أرغب في موقع لشركتي، وأود معرفة التفاصيل والأسعار.',
};

/**
 * Launch offer: the original prices stay available for seven days, then the site
 * falls back to full prices on its own. Ends 23 Sep 2026, 23:59 Riyadh.
 */
export const launchOfferEnds = '2026-09-23T20:59:59Z';

export function launchOffer(now: Date = new Date()) {
  const msLeft = new Date(launchOfferEnds).getTime() - now.getTime();
  // Whole days remaining: 7 on day one, 0 on the final day (the UI then says "Last day").
  return { active: msLeft > 0, daysLeft: Math.max(0, Math.floor(msLeft / 86_400_000)) };
}

export const whatsappUrl = (text: string) => `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(text)}`;
export const instagramUrl = `https://www.instagram.com/${studio.instagram}/`;
export const tiktokUrl = `https://www.tiktok.com/@${studio.tiktok}`;
export const xUrl = `https://x.com/${studio.x}`;
export const linkedinUrl = `https://www.linkedin.com/company/${studio.linkedin}/`;
