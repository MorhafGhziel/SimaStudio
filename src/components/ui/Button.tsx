import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Magnetic } from './Magnetic';

type Variant = 'solid' | 'outline' | 'ghost';

const base =
  'group/btn relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-pill px-6 text-[0.95rem] font-medium transition-[background-color,color,border-color,transform] duration-500 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 sm:h-13 sm:px-7';

const variants: Record<Variant, string> = {
  solid: 'bg-accent text-ink hover:bg-paper',
  outline: 'border border-line text-paper hover:border-paper/40 hover:bg-paper/5',
  ghost: 'px-0 text-paper hover:text-accent sm:px-0',
};

export const buttonClass = (variant: Variant = 'solid', className?: string) => cn(base, variants[variant], className);

/** Sliding label + arrow: the text rolls up on hover. */
function Label({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out group-hover/btn:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out group-hover/btn:translate-y-0">
          {children}
        </span>
      </span>
      {arrow && <ArrowUpRight className="size-4 transition-transform duration-500 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={1.6} />}
    </>
  );
}

type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'className'> & { variant?: Variant; className?: string; arrow?: boolean; magnetic?: boolean; children: ReactNode };

export function LinkButton({ variant = 'solid', className, arrow, magnetic = true, children, ...props }: LinkButtonProps) {
  const link = (
    <Link data-cursor="open" className={buttonClass(variant, className)} {...props}>
      <Label arrow={arrow}>{children}</Label>
    </Link>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

type AnchorButtonProps = ComponentProps<'a'> & { variant?: Variant; arrow?: boolean; magnetic?: boolean };

export function AnchorButton({ variant = 'solid', className, arrow, magnetic = true, children, ...props }: AnchorButtonProps) {
  const a = (
    <a data-cursor="open" className={buttonClass(variant, className)} {...props}>
      <Label arrow={arrow}>{children}</Label>
    </a>
  );
  return magnetic ? <Magnetic>{a}</Magnetic> : a;
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; arrow?: boolean };

export function Button({ variant = 'solid', className, arrow, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} data-cursor="open" className={buttonClass(variant, className)} {...props}>
      <Label arrow={arrow}>{children}</Label>
    </button>
  );
}
