import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getDashboard, RANGES } from '@/lib/server/analytics';
import { requireAdmin } from '@/lib/server/auth';
import { listTestimonials } from '@/lib/server/testimonials';
import { DashboardView } from './DashboardView';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  // Always render per request: auth and live data must never be baked in at build time.
  await connection();
  if (!process.env.DATABASE_URL) redirect('/admin/login');
  const admin = await requireAdmin();
  const { range } = await searchParams;
  const [data, testimonials] = await Promise.all([getDashboard(range), listTestimonials()]);
  return <DashboardView data={data} ranges={RANGES} me={admin} testimonials={testimonials} />;
}
