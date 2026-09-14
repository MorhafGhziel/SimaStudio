import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal, RevealLines } from './Reveal';

export function SectionHeading({ id, lines, text, aside, className }: { id?: string; lines: string[]; text?: string; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-8 md:flex-row md:items-end md:justify-between', className)}>
      <div id={id}>
        <RevealLines lines={lines} className="display-lg max-w-[16ch]" />
        {text && (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[42ch] text-lg text-mute">{text}</p>
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </div>
  );
}
