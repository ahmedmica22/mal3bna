import { TextField } from '../../../../components/forms/TextField';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../../layouts/AuthLayout';
import type { LoginContentProps } from '../types';

export function LoginContent({
  email,
  error,
  loading,
  password,
  setEmail,
  setPassword,
  submit,
  translate,
}: LoginContentProps) {
  return (
    <AuthLayout>
      <section className="auth-card rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#13221f]/90">
        <p className="eyebrow text-xs font-black text-emerald-700 tracking-wider uppercase mb-1 dark:text-lime-400">
          {translate('WELCOME BACK')}
        </p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6 dark:text-slate-100">
          {translate('Ready to play?')}
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <TextField
            label={translate('Email address')}
            id="login-email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder={translate('you@example.com')}
            required
          />

          <TextField
            label={translate('Password')}
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={8}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="error p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 text-xs font-semibold m-0 dark:text-rose-300">
              {translate(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button full w-full py-3 rounded-full text-sm font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-400/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? translate('Signing in…') : translate('Sign in to mal3bna')}
          </button>
        </form>

        <div className="auth-links mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>{translate('Need an account?')}</span>
          <Link
            to="/auth/register"
            className="font-bold text-emerald-700 hover:underline dark:text-lime-400"
          >
            {translate('Create account →')}
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}
