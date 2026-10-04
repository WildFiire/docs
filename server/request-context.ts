import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request, Response, NextFunction } from 'express';
const context = new AsyncLocalStorage<Request>();
export function requestContext(req: Request, _res: Response, next: NextFunction) {
  context.run(req, next);
}
export function currentRequest(): Request {
  const req = context.getStore();
  if (!req) throw new Error('Request context unavailable');
  return req;
}
