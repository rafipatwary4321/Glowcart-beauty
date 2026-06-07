import { NextResponse } from "next/server";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function apiSuccess<T>(
  data: T,
  options?: {
    status?: number;
    message?: string;
    headers?: HeadersInit;
  }
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options?.message ? { message: options.message } : {}),
    },
    {
      status: options?.status ?? 200,
      headers: options?.headers,
    }
  );
}

export function apiError(
  error: string,
  options?: {
    status?: number;
    details?: unknown;
    headers?: HeadersInit;
  }
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(options?.details !== undefined ? { details: options.details } : {}),
    },
    {
      status: options?.status ?? 500,
      headers: options?.headers,
    }
  );
}
