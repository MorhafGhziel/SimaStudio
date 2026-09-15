import { getAdmin } from '@/lib/server/auth';
import { exportSessionsCsv } from '@/lib/server/analytics';

export async function GET(request: Request) {
  if (!(await getAdmin())) return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const range = new URL(request.url).searchParams.get('range') ?? undefined;
  const csv = await exportSessionsCsv(range);
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sima-visits-${range ?? '7d'}-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
