import { NextResponse } from 'next/server';

type ResponsePayload = {
  success?: boolean;
  message?: string;
  data?: any;
  error?: any;
};

export function GeneralResponse(
  payload: ResponsePayload,
  status: number = 200,
  options?: { logError?: boolean; headers?: Record<string, string> }
) {
  if (options?.logError && status >= 400) {
    //console.error('Error:', payload); USAR LIBRERIA LOGGER
  }

  const response = NextResponse.json(payload, { status });

  if (options?.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      response.headers.set(key, value);
    }
  }

  return response;
}
