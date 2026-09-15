'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const onCode = state?.step === 'code';

  const input = 'mt-2 h-12 w-full rounded-xl border border-line bg-ink-2 px-4 text-paper outline-none transition-colors placeholder:text-faint focus:border-accent';
  const button = 'mt-5 h-12 w-full rounded-pill bg-paper font-medium text-ink transition-colors hover:bg-accent disabled:opacity-50';

  return (
    <div className="mt-8">
      {!onCode ? (
        <form action={action}>
          <input type="hidden" name="intent" value="send" />
          <label htmlFor="email" className="text-sm text-mute">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" placeholder="you@gmail.com" defaultValue={state?.email} className={input} />
          <button type="submit" disabled={pending} className={button}>
            {pending ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form action={action}>
          <input type="hidden" name="intent" value="verify" />
          <input type="hidden" name="email" value={state.email} />
          <p className="text-sm text-mute">
            Code sent to <span className="text-paper">{state.email}</span> if it&apos;s an admin email.
          </p>
          <label htmlFor="code" className="mt-5 block text-sm text-mute">
            6-digit code
          </label>
          <input
            id="code"
            name="code"
            required
            autoFocus
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="••••••"
            className={`${input} text-center text-2xl tracking-[0.5em]`}
          />
          <button type="submit" disabled={pending} className={button}>
            {pending ? 'Checking…' : 'Sign in'}
          </button>
          <button type="submit" name="intent" value="reset" formNoValidate className="mt-3 w-full text-sm text-mute hover:text-paper">
            Use a different email
          </button>
        </form>
      )}
      {state?.message && (
        <p role="status" className={`mt-5 text-sm ${state.ok ? 'text-mute' : 'text-[#ff8a8a]'}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}
