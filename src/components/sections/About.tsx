'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';

const stack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'GSAP', 'Motion', 'Astro', 'Figma'];

export function About() {
  const { dict } = useLocale();
  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x">
        <RevealLines lines={[dict.about.line1, dict.about.line2]} className="display-lg" />
        <span id="about-title" className="sr-only">
          {dict.about.line1} {dict.about.line2}
        </span>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <Reveal className="space-y-5 text-lg text-mute md:col-span-6 md:col-start-6 sm:text-xl">
            <p className="text-paper">{dict.about.p1}</p>
            <p>{dict.about.p2}</p>
          </Reveal>
        </div>
      </div>

      {/* Capabilities marquee — real tools we work with */}
      <Reveal delay={0.1} className="mt-20 sm:mt-28">
        <p className="container-x eyebrow">{dict.about.capabilities}</p>
        <div dir="ltr" className="mt-6 overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-12 motion-reduce:animate-none">
            {[...stack, ...stack].map((s, i) => (
              <span key={i} aria-hidden={i >= stack.length} className="text-2xl font-medium tracking-[-0.02em] text-[#58585b] sm:text-3xl">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
