'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useWebGL } from '@/lib/capabilities';
import { cn } from '@/lib/utils';
import type { LiquidMode } from './shader';

const LiquidViewInner = dynamic(() => import('./LiquidViewInner'), { ssr: false });
const LiquidStage = dynamic(() => import('./LiquidStage'), { ssr: false });

/**
 * A region of the page where the shared liquid is drawn. Purely decorative:
 * without WebGL it simply stays empty.
 */
export function LiquidView({ mode, className, opacity }: { mode: LiquidMode; className?: string; opacity?: number }) {
  const { locale } = useLocale();
  const webgl = useWebGL();
  const reduce = useReducedMotion() ?? false;
  return (
    <div aria-hidden="true" className={cn('pointer-events-none', className)}>
      {webgl && <LiquidViewInner mode={mode} mirror={locale === 'ar'} reduced={reduce} opacity={opacity} />}
    </div>
  );
}

/** Mount once in the layout. */
export function LiquidStageMount() {
  const webgl = useWebGL();
  return webgl ? <LiquidStage /> : null;
}
