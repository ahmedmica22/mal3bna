import { TextField } from '../../../../components/forms/TextField';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../../layouts/AuthLayout';
import type { RegisterContentProps } from '../types';

export function RegisterContent({
  error,
  fields,
  loading,
  role,
  setFields,
  setRole,
  submit,
  translate,
}: RegisterContentProps) {
  return (
    <AuthLayout>
      <section className="auth-card rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#13221f]/90">
        <p className="eyebrow text-xs font-black text-emerald-700 tracking-wider uppercase mb-1 dark:text-lime-400">
          {translate('JOIN MAL3BNA')}
        </p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6 dark:text-slate-100">
          {translate('Create your account.')}
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <TextField
            label={translate('Full name')}
            required
            placeholder={translate('Your name')}
            value={fields.name}
            onChange={(event) => setFields({ ...fields, name: event.target.value })}
          />

          <TextField
            label={translate('Email address')}
            required
            type="email"
            placeholder={translate('you@example.com')}
            value={fields.email}
            onChange={(event) => setFields({ ...fields, email: event.target.value })}
          />

          <TextField
            label={translate('Egyptian phone number (Optional)')}
            type="tel"
            placeholder={translate('01012345678 or +201012345678')}
            value={fields.phone}
            onChange={(event) => setFields({ ...fields, phone: event.target.value })}
          />

          <TextField
            label={translate('Password')}
            required
            minLength={8}
            type="password"
            placeholder={translate('At least 8 characters')}
            value={fields.password}
            onChange={(event) => setFields({ ...fields, password: event.target.value })}
          />

          <div className="pt-2">
            <span className="block text-xs font-bold text-slate-600 mb-2 dark:text-slate-300">
              {translate('I am joining as:')}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('player')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'player'
                    ? 'bg-lime-400/15 border-lime-400 text-emerald-700 shadow-sm dark:text-lime-300'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-[#0b1715] dark:border-white/15 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {translate('⚽ Player')}
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'owner'
                    ? 'bg-sky-400/15 border-sky-400 text-sky-700 shadow-sm dark:text-sky-300'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-[#0b1715] dark:border-white/15 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {translate('🏟️ Venue Owner')}
              </button>
            </div>
          </div>

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
            {loading ? translate('Creating account…') : translate('Create account')}
          </button>
        </form>

        <div className="auth-links mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>{translate('Already have an account?')}</span>
          <Link
            to="/auth/login"
            className="font-bold text-emerald-700 hover:underline dark:text-lime-400"
          >
            {translate('Sign in →')}
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}
