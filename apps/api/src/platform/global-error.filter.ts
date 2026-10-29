import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { isDomainError } from '../domain/errors';
import { ZodError } from 'zod';

type RequestWithId = Request & { id: string };

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalErrorFilter.name);

  catch(error: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected server error occurred. Please try again.';
    let details: unknown = undefined;

    if (isDomainError(error)) {
      status = domainStatus(error.code);
      code = error.code;
      message = error.message;
      details = error.details;
    } else if (error instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_FAILED';
      const formattedIssues = error.issues
        ?.map((issue) => {
          const field = issue.path
            .filter((p) => typeof p === 'string' || typeof p === 'number')
            .join('.');
          return field ? `${field}: ${issue.message}` : issue.message;
        })
        .join(', ');
      message = formattedIssues || 'Request validation failed';
      details = error.flatten();
    } else if (error instanceof HttpException) {
      status = error.getStatus();
      const res = error.getResponse();
      if (typeof res === 'string') {
        message = res;
        code = defaultCodeForStatus(status);
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, unknown>;
        code = typeof obj.code === 'string' ? obj.code : defaultCodeForStatus(status);
        if (typeof obj.message === 'string') {
          message = obj.message;
        } else if (Array.isArray(obj.message)) {
          message = obj.message.join(', ');
        } else {
          message = error.message;
        }
        details = obj.details ?? obj;
      } else {
        message = error.message;
        code = defaultCodeForStatus(status);
      }
    } else if (error instanceof Error) {
      status = (error as { status?: number }).status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      code = (error as { code?: string }).code ?? 'INTERNAL_ERROR';
      message = error.message || 'An unexpected error occurred. Please try again.';
      this.logger.error(
        `[Unhandled] ${request.method} ${request.url}: ${error.message}`,
        error.stack,
      );
    } else {
      message =
        typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.';
    }

    if (status >= 500) {
      this.logger.error(
        `[${status}] ${request.method} ${request.url} [${request.id ?? 'no-id'}]: ${message}`,
      );
    }

    response.status(status).json({
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      requestId: request.id,
    });
  }
}

function defaultCodeForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHENTICATED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'RATE_LIMITED';
    default:
      return status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR';
  }
}

function domainStatus(code: string): number {
  if (
    code === 'UNAUTHENTICATED' ||
    code === 'INVALID_CREDENTIALS' ||
    code.startsWith('INVALID_') ||
    code === 'REFRESH_TOKEN_REUSE' ||
    code === 'SESSION_EXPIRED'
  )
    return 401;
  if (
    code === 'FORBIDDEN' ||
    code === 'UNAUTHORIZED' ||
    code === 'ACCOUNT_SUSPENDED' ||
    code === 'BLOCKED'
  )
    return 403;
  if (code === 'NOT_FOUND') return 404;
  if (code === 'RATE_LIMITED') return 429;
  if (code === 'ACCOUNT_DELETION_BLOCKED') return 409;
  if (code === 'EMAIL_ALREADY_REGISTERED') return 409;
  if (code === 'CONFLICT' || code === 'SLOT_ALREADY_BOOKED' || code === 'OVERLAPPING_RESERVATION')
    return 409;
  return 400;
}
