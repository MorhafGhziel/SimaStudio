import { getAdmin } from '@/lib/server/auth';
import { getSessionJourney } from '@/lib/server/analytics';

export async function GET(request: Request) {
  if (!(await getAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const id = new URL(request.url).searchParams.get('id') ?? '';
  const events = await getSessionJourney(id);
  return Response.json({ events }, { headers: { 'Cache-Control': 'no-store' } });
}
