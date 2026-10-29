import pino, { type Logger } from 'pino';
import type { LoggerService } from '@nestjs/common';

export const structuredLogger: Logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: null,
  redact: ['authorization', 'password', 'token', 'refreshToken', 'paymentPayload'],
});

export class StructuredLogger implements LoggerService {
  log(message: unknown, context?: string): void {
    structuredLogger.info({ context }, String(message));
  }

  error(message: unknown, trace?: string, context?: string): void {
    structuredLogger.error({ context, trace }, String(message));
  }

  warn(message: unknown, context?: string): void {
    structuredLogger.warn({ context }, String(message));
  }

  debug(message: unknown, context?: string): void {
    structuredLogger.debug({ context }, String(message));
  }

  verbose(message: unknown, context?: string): void {
    structuredLogger.trace({ context }, String(message));
  }

  fatal(message: unknown, context?: string): void {
    structuredLogger.fatal({ context }, String(message));
  }
}
