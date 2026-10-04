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

