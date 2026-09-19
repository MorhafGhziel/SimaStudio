import { Alexandria, Barlow, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';

/** Latin body — Barlow, as set in the brand identity. */
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-barlow', display: 'swap' });

/** Latin display + the SIMA wordmark — Barlow Condensed. */
const condensed = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-condensed', display: 'swap' });

/** Small uppercase labels — IBM Plex Mono. Not preloaded: it is never in the first paint's critical text. */
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-mono', display: 'swap', preload: false });

/** Arabic — geometric, modern, reads well at display sizes. */
const alexandria = Alexandria({ subsets: ['arabic', 'latin'], variable: '--font-alexandria', display: 'swap' });

export const fontVariables = `${barlow.variable} ${condensed.variable} ${mono.variable} ${alexandria.variable}`;
