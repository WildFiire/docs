export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: any,
  ) {
    super(message);
  }
}
export async function api<T = any>(
  url: string,
  bodyOrOptions?: unknown,
  methodArg?: string,
): Promise<T> {
  let effectiveMethod = methodArg;
  let effectiveBody = bodyOrOptions;

  // Unpack fetch-style options if called as api(url, { method: 'POST', body: {...} })
  if (
    bodyOrOptions &&
    typeof bodyOrOptions === 'object' &&
    !Array.isArray(bodyOrOptions) &&
    !(bodyOrOptions instanceof FormData) &&
    'body' in bodyOrOptions &&
    ('method' in bodyOrOptions || methodArg === undefined)
  ) {
    const opts = bodyOrOptions as { method?: string; body?: unknown };
    if (opts.method) effectiveMethod = opts.method;
    effectiveBody = opts.body;
  }

  if (!effectiveMethod) {
    effectiveMethod = effectiveBody === undefined ? 'GET' : 'POST';
  }

  const response = await fetch(url, {
    method: effectiveMethod,
    credentials: 'same-origin',
    headers:
      effectiveBody instanceof FormData
        ? {}
        : effectiveBody === undefined
          ? {}
          : { 'Content-Type': 'application/json' },
    body:
      effectiveBody === undefined
        ? undefined
        : effectiveBody instanceof FormData
          ? effectiveBody
          : JSON.stringify(effectiveBody),
  });
  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!response.ok) {
      throw new ApiError(
        `Serverul API nu răspunde (HTTP ${response.status}: ${response.statusText || 'Bad Gateway'}). Backend-ul se repornește sau este offline.`,
        response.status,
        text,
      );
    }
    throw new ApiError('Răspuns invalid primit de la server', response.status, text);
  }
  if (!response.ok)
    throw new ApiError(data.message || data.error || 'Cererea a eșuat', response.status, data);
  return data;
}

