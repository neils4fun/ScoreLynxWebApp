import type { APIResponse } from '../types/common';

export function handleAPIError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected error occurred');
}

export function validateAPIResponse<T>(response: APIResponse<T>): void {
  if (response.status.code !== 0) {
    throw new Error(response.status.message);
  }
}