import { Injectable, Logger } from '@nestjs/common';
import type { EmailSender } from '../application/ports';
import type { UserRecord } from '../domain/auth.types';

@Injectable()
export class MailpitEmailSender implements EmailSender {
  private readonly logger = new Logger(MailpitEmailSender.name);
  private readonly mailpitUrl = process.env.MAILPIT_URL ?? 'http://127.0.0.1:8025';
  private readonly fromEmail = process.env.MAIL_FROM_EMAIL ?? 'no-reply@court-booking.local';
  private readonly fromName = process.env.MAIL_FROM_NAME ?? 'Court Booking';

  async sendVerification(user: UserRecord, token: string): Promise<void> {
    try {
      await fetch(`${this.mailpitUrl}/api/v1/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: { Email: this.fromEmail, Name: this.fromName },
          To: [{ Email: user.email, Name: user.name }],
          Subject: 'Verify your email',
          Text: `Verification token: ${token}`,
        }),
      });
      this.logger.log(`Account verification email sent to ${user.email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send verification email to Mailpit for ${user.email}: ${(error as Error).message}`,
      );
    }
  }

  async sendPasswordReset(user: UserRecord, token: string): Promise<void> {
    try {
      await fetch(`${this.mailpitUrl}/api/v1/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: { Email: this.fromEmail, Name: this.fromName },
          To: [{ Email: user.email, Name: user.name }],
          Subject: 'Reset your password',
          Text: `Password reset token: ${token}`,
        }),
      });
      this.logger.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send password reset email to Mailpit for ${user.email}: ${(error as Error).message}`,
      );
    }
  }
}
