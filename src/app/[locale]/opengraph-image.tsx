import { ImageResponse } from 'next/og';

export const alt = 'SIMA — websites and 3D experiences that sell for you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const generateStaticParams = () => [{ locale: 'en' }, { locale: 'ar' }];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0e0e0f', color: '#f5f4f0', padding: '72px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg viewBox="330 170 340 660" width="31" height="60">
            <path d="M660 180H500A160 160 0 0 0 500 500V400A60 60 0 0 1 500 280H660Z" fill="#f5f4f0" />
            <path d="M340 820H500A160 160 0 0 0 500 500V600A60 60 0 0 1 500 720H340Z" fill="#f5f4f0" />
            <circle cx="500" cy="500" r="24" fill="#e8a33a" />
          </svg>
          <span style={{ fontSize: 30, letterSpacing: 10, fontWeight: 700 }}>SIMA STUDIO</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3, fontWeight: 500 }}>We design and build websites</span>
          <span style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -3, fontWeight: 500, color: '#e8a33a' }}>that sell for you.</span>
        </div>
        <span style={{ fontSize: 24, color: '#8c8c91' }}>Designed and built in-house · Latest client launch: meritbrand.store</span>
      </div>
    ),
    size,
  );
}
