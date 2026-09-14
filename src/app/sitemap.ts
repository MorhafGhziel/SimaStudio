import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { studio } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...projects.map((p) => `/work/${p.slug}`)];
  return paths.map((path) => ({
    url: `${studio.url}/ar${path}`,
    changeFrequency: path ? 'monthly' : 'weekly',
    priority: path ? 0.7 : 1,
    alternates: { languages: { en: `${studio.url}/en${path}`, ar: `${studio.url}/ar${path}` } },
  }));
}
