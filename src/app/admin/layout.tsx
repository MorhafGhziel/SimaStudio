import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'SIMA Admin',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: '#050507', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="min-h-svh bg-ink text-paper antialiased">{children}</body>
    </html>
  );
}
