import { ApiEnvelope, ApiErrorEnvelope } from '@/frontend/types/dashboard';

function isErrorEnvelope(payload: unknown): payload is ApiErrorEnvelope {
  return typeof payload === 'object' && payload !== null && 'error' in payload;
}

function isSuccessEnvelope<T>(payload: unknown): payload is ApiEnvelope<T> {
  return typeof payload === 'object' && payload !== null && 'data' in payload;
}

export async function fetchApi<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { method: 'GET', signal, headers: { Accept: 'application/json' } });
  let payload: unknown = null;
  let jsonParseFailed = false;

  try {
    payload = await response.json();
  } catch {
    jsonParseFailed = true;
  }

  if (!response.ok) {
    if (isErrorEnvelope(payload) && payload.error?.message) {
      throw new Error(payload.error.message);
    }
    throw new Error(`Request failed (${response.status})`);
  }

  if (jsonParseFailed) {
    throw new Error('Invalid JSON response from API');
  }

  if (isErrorEnvelope(payload)) {
    throw new Error(payload.error?.message ?? 'Unknown API error');
  }

  if (isSuccessEnvelope<T>(payload)) {
    return payload.data;
  }

  throw new Error('Unexpected API response shape');
}
