import { Injectable } from '@nestjs/common';
import type { EmailSender } from '../application/ports';
import type { UserRecord } from '../domain/auth.types';

@Injectable()
export class InMemoryEmailSender implements EmailSender {
  readonly verificationMessages: Array<{ email: string; token: string }> = [];
  readonly resetMessages: Array<{ email: string; token: string }> = [];
  async sendVerification(user: UserRecord, token: string): Promise<void> {
    this.verificationMessages.push({ email: user.email, token });
  }
  async sendPasswordReset(user: UserRecord, token: string): Promise<void> {
    this.resetMessages.push({ email: user.email, token });
  }
}
