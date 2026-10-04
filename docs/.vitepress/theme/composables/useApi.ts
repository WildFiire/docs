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
  body?: unknown,
  method = body === undefined ? 'GET' : 'POST',
): Promise<T> {
  const response = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers:
      body instanceof FormData
        ? {}
        : body === undefined
          ? {}
          : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok)
    throw new ApiError(data.message || data.error || 'Cererea a eșuat', response.status, data);
  return data;
}
