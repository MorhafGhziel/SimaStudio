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
  email: 'hello@sima.studio', // PLACEHOLDER
  whatsapp: '966500000000', // PLACEHOLDER — international format, no + or spaces
  whatsappDisplay: '+966 50 000 0000', // PLACEHOLDER
  instagram: 'sima.studio', // PLACEHOLDER — handle without @
  tiktok: 'sima.studio', // PLACEHOLDER
  location: { en: 'Working with brands worldwide', ar: 'نعمل مع البراندات حول العالم' } as T,
  startingPrice: 1500,
};

export const whatsappMessage: T = {
  en: "Hi, I'm interested in building a website for my brand. I'd like to know more about your packages.",
  ar: 'مرحبًا، أرغب في بناء موقع لبراندي، وأود معرفة المزيد عن باقاتكم.',
};

export const whatsappUrl = (text: string) => `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(text)}`;
export const instagramUrl = `https://instagram.com/${studio.instagram}`;
export const tiktokUrl = `https://www.tiktok.com/@${studio.tiktok}`;
