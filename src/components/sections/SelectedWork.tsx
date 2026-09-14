'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projects } from '@/content/projects';
import { ProjectCard } from './ProjectCard';

export function SelectedWork() {
  const { dict } = useLocale();
  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="container-x">
        <SectionHeading id="work-title" lines={[dict.work.title]} text={dict.work.text} aside={<span className="text-sm text-faint" dir="ltr">({String(projects.length).padStart(2, '0')})</span>} />
        <div className="mt-16 space-y-24 sm:mt-24 lg:space-y-36">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
