'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requestLoginCode, revokeAllOtherSessions, revokeSession, SESSION_COOKIE, signOut, verifyLoginCode, type AuthResult } from '@/lib/server/auth';

/** Every action is a public POST endpoint: each one validates input and re-checks auth itself. */

export async function loginAction(_prev: AuthResult | undefined, formData: FormData): Promise<AuthResult> {
  const intent = formData.get('intent');
  if (intent === 'reset') return { ok: true, step: 'email' };
  if (intent === 'verify') {
    const result = await verifyLoginCode(formData.get('email'), formData.get('code'));
    if (result.ok) redirect('/admin');
    return result;
  }
  return requestLoginCode(formData.get('email'));
}

export async function signOutAction() {
  await signOut();
  redirect('/admin/login');
}

export async function revokeSessionAction(formData: FormData) {
  const id = formData.get('id');
  if (typeof id !== 'string' || !/^[a-f0-9]{64}$/.test(id)) return;
  const wasSelf = await revokeSession(id);
  if (wasSelf) {
    (await cookies()).delete(SESSION_COOKIE);
    redirect('/admin/login');
  }
  revalidatePath('/admin');
}

export async function revokeOthersAction() {
  await revokeAllOtherSessions();
  revalidatePath('/admin');
}
