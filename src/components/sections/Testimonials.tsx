import { dictionary } from '@/content/dictionary';
import type { Locale } from '@/lib/i18n';
import { getApprovedTestimonials } from '@/lib/server/testimonials';
import { TestimonialForm } from './TestimonialForm';

const Stars = ({ rating }: { rating: number }) => (
  <p className="text-sm tracking-[0.2em] text-accent" aria-label={`${rating} / 5`} dir="ltr">
    {'★'.repeat(rating)}
    <span className="text-faint">{'★'.repeat(5 - rating)}</span>
  </p>
);

/** Client reviews. Only approved entries are ever rendered. */
export async function Testimonials({ locale }: { locale: Locale }) {
  const d = dictionary[locale].testimonials;
  const items = await getApprovedTestimonials();

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y border-t border-line">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="testimonials-title" className="display-lg max-w-[14ch]">
              {d.title}
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg text-mute">{d.text}</p>
          </div>
        </div>

        {items.length > 0 ? (
          <ul className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col rounded-card border border-line bg-ink-2 p-7">
                <Stars rating={item.rating} />
                <blockquote className="mt-5 flex-1 text-[1.05rem] leading-relaxed text-[#d0cfca]">“{item.message}”</blockquote>
                <footer className="mt-6 border-t border-line pt-4">
                  <p className="font-medium">{item.name}</p>
                  {item.brand && <p className="text-sm text-mute">{item.brand}</p>}
                </footer>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-16 rounded-card border border-line bg-ink-2 p-7 text-mute sm:mt-20">{d.empty}</p>
        )}

        <TestimonialForm />
      </div>
    </section>
  );
}
