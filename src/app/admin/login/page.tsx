import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getAdmin } from '@/lib/server/auth';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  await connection();
  const configured = Boolean(process.env.DATABASE_URL);
  if (configured && (await getAdmin())) redirect('/admin');

  return (
    <main className="grid min-h-svh place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-sm font-semibold tracking-[0.3em]">SIMA · ADMIN</p>
        <h1 className="mt-6 text-3xl font-medium tracking-tight">Sign in</h1>
        <p className="mt-2 text-mute">Enter your admin email and we&apos;ll send you a one-time code.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-8 rounded-card border border-line bg-ink-2 p-5 text-sm text-mute">The database isn&apos;t connected yet. Add <code className="text-paper">DATABASE_URL</code> to the environment, then reload.</p>
        )}
      </div>
    </main>
  );
}
