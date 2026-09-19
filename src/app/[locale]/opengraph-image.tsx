import { ImageResponse } from 'next/og';

export const alt = 'SIMA — Arabic-first websites and 3D experiences for Saudi companies and brands';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const generateStaticParams = () => [{ locale: 'en' }, { locale: 'ar' }];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#050507', color: '#f3f3f6', padding: '72px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontSize: 30, letterSpacing: 8, fontWeight: 600 }}>SIMA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3, fontWeight: 500 }}>Arabic-first websites</span>
          <span style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -3, fontWeight: 500, color: 'rgba(243,243,246,0.55)' }}>and 3D experiences.</span>
        </div>
        <span style={{ fontSize: 24, color: '#8d8d99' }}>For Saudi companies and brands · Latest client launch: nasaqksa.com</span>
      </div>
    ),
    size,
  );
}
