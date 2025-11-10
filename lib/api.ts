export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const url = path.startsWith('/api')
    ? path
    : `/api${path.startsWith('/') ? '' : '/'}${path}`;

  const { headers, json, ...rest } = options;

  // Get token from localStorage
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const init: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  };

  const res = await fetch(url, init);

  let payload: unknown = null;
  const text = await res.text();
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!res.ok) {
    const data = payload as Record<string, unknown> | null;
    const messageCandidates: unknown[] = [
      data?.message,
      data?.error,
      data?.title,
    ].filter(Boolean);
    const message =
      (messageCandidates[0] as string | undefined) ||
      `Request failed with status ${res.status}`;
    const err: ApiError = {
      status: res.status,
      message,
      details: data || payload,
    };
    throw err;
  }

  // Unwrap the response if it's in the standard API format
  const apiResponse = payload as ApiResponse<T>;
  if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
    return apiResponse.data;
  }

  return payload as T;
}
