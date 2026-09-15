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
  url: 'https://sima.studio', // PLACEHOLDER — production domain
  email: 'simastudio7@gmail.com',
  whatsapp: '966582737120', // international format, no + or spaces
  whatsappDisplay: '+966 58 273 7120',
  instagram: 'simastudio7', // handle without @
  tiktok: 'simastudio7',
  startingPrice: 1500,
};

export const whatsappMessage: T = {
  en: "Hi, I'm interested in building a website for my brand. I'd like to know more about your packages.",
  ar: 'مرحبًا، أرغب في بناء موقع لعلامتي التجارية، وأود معرفة المزيد عن باقاتكم.',
};

export const whatsappUrl = (text: string) => `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(text)}`;
export const instagramUrl = `https://www.instagram.com/${studio.instagram}/`;
export const tiktokUrl = `https://www.tiktok.com/@${studio.tiktok}`;
