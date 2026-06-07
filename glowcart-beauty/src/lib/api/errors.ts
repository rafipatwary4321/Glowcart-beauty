import { DbConnectionError } from "@/lib/db";

export class ApiRouteError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "ApiRouteError";
    this.status = status;
    this.details = details;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRouteError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export function getErrorStatus(error: unknown): number {
  if (error instanceof ApiRouteError) {
    return error.status;
  }

  if (error instanceof DbConnectionError) {
    return 503;
  }

  return 500;
}

export function getErrorDetails(error: unknown): unknown {
  if (error instanceof ApiRouteError) {
    return error.details;
  }

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return error.stack;
  }

  return undefined;
}
