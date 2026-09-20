import { getAdmin } from '@/lib/server/auth';
import { getVisitorProfile } from '@/lib/server/analytics';

export async function GET(request: Request) {
  if (!(await getAdmin())) return Response.json({ error: 'unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const id = new URL(request.url).searchParams.get('id') ?? '';
  const profile = await getVisitorProfile(id);
  return Response.json({ profile }, { headers: { 'Cache-Control': 'no-store' } });
}
