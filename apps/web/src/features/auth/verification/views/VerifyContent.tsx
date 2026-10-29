import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../../layouts/AuthLayout';
import type { VerifyContentProps } from '../types';

export function VerifyContent({
  busy,
  email,
  message,
  resend,
  token,
  translate,
}: VerifyContentProps) {
  return (
    <AuthLayout>
      <section className="auth-card">
        <p className="eyebrow">{translate('ONE LAST STEP')}</p>
        <h1>{translate('Check your inbox.')}</h1>
        <p className="auth-copy">
          {translate('We sent a verification link to')} {email || translate('your email address')}
          {translate('. Open the link to activate your account.')}
        </p>
        <p className="verification-progress" role="status">
          {token
            ? busy
              ? translate('Activating your account…')
              : message
            : translate('Open the link in your email to activate your account.')}
        </p>
        <button className="text-button" onClick={() => void resend()} disabled={!email}>
          {translate('Resend verification email')}
        </button>
        <Link to="/auth/login">{translate('Back to sign in')}</Link>
      </section>
    </AuthLayout>
  );
}
