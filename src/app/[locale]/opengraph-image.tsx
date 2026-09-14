import { ImageResponse } from 'next/og';

export const alt = 'SIMA — Website design & development studio in Saudi Arabia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const generateStaticParams = () => [{ locale: 'en' }, { locale: 'ar' }];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0a0a09', color: '#f1eee8', padding: '72px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg viewBox="0 0 1000 1000" width="44" height="44">
            <path
              fill="#d2bc98"
              d="M500 110c-146 0-262 98-262 226 0 102 70 168 196 200l92 23c64 16 92 40 92 78 0 48-50 80-118 80-70 0-122-34-138-94l-150 36c30 136 150 221 288 221 158 0 272-94 272-232 0-112-74-178-208-212l-86-22c-58-15-82-36-82-70 0-42 42-70 100-70 58 0 102 28 116 78l148-40C730 184 628 110 500 110z"
            />
          </svg>
          <span style={{ fontSize: 30, letterSpacing: 8, fontWeight: 600 }}>SIMA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3, fontWeight: 500 }}>We build brands</span>
          <span style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -3, fontWeight: 500, color: 'rgba(241,238,232,0.55)' }}>their digital presence deserves.</span>
        </div>
        <span style={{ fontSize: 24, color: '#8f8b83' }}>Premium websites & digital experiences · Saudi Arabia</span>
      </div>
    ),
    size,
  );
}
