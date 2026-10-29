import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { structuredLogger } from './structured-logger';

type RequestWithId = Request & { id: string };

export class RequestIdMiddleware {
  use(request: RequestWithId, response: Response, next: NextFunction): void {
    const requestId = request.header('x-request-id') ?? randomUUID();
    request.id = requestId;
    response.setHeader('x-request-id', requestId);
    response.on('finish', () => {
      structuredLogger.info(
        {
          requestId,
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
        },
        'request completed',
      );
    });
    next();
  }
}
