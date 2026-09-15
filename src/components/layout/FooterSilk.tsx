'use client';

import dynamic from 'next/dynamic';

const FooterSilkScene = dynamic(() => import('@/components/three/footer/FooterSilkScene'), { ssr: false });

export function FooterSilk() {
  return <FooterSilkScene />;
}
