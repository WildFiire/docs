import type { Response } from 'express';
export function prepareResponse(
  res: Response,
  init: { status?: number; headers?: Record<string, string> } = {},
) {
  if (init.headers) res.set(init.headers);
  return res.status(init.status || 200);
}
export function jsonReply(res: Response, body: unknown, init = {}) {
  return prepareResponse(res, init).json(body);
}
export function sendReply(res: Response, body: any, init = {}) {
  return prepareResponse(res, init).send(body instanceof Uint8Array ? Buffer.from(body) : body);
}
export function setCookie(res: Response, nameOrOptions: any, value?: string, options: any = {}) {
  const cookie =
    typeof nameOrOptions === 'string' ? { name: nameOrOptions, value, ...options } : nameOrOptions;
  const { name, value: content, maxAge, ...rest } = cookie;
  res.cookie(name, content, {
    ...rest,
    ...(maxAge === undefined ? {} : { maxAge: maxAge * 1000 }),
  });
}
