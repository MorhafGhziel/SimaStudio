import { Alexandria, Schibsted_Grotesk } from 'next/font/google';

/** Latin — editorial grotesk for large, tight headlines and clean UI. */
const grotesk = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });

/** Arabic — geometric, modern, reads well at display sizes. */
const alexandria = Alexandria({ subsets: ['arabic', 'latin'], variable: '--font-alexandria', display: 'swap' });

export const fontVariables = `${grotesk.variable} ${alexandria.variable}`;
