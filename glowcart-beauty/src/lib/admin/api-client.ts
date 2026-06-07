import type { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api/response";

export type DataSource = "api" | "fallback";

export type AdminFetchResult<T> = {
  data: T;
  source: DataSource;
  message?: string;
};

export type AdminMutationResult<T> = {
  ok: boolean;
  data?: T;
  source: DataSource;
  error?: string;
  message?: string;
};

/** In-memory fallback is only used during local development when the API is unreachable. */
export function isDevFallbackEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

async function parseResponse<T>(response: Response): Promise<AdminMutationResult<T>> {
  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || !json.success) {
    return {
      ok: false,
      source: "api",
      error: "error" in json ? json.error : "Request failed.",
    };
  }

  return {
    ok: true,
    data: json.data,
    source: "api",
    message: "message" in json ? json.message : undefined,
  };
}

export async function adminGet<T>(
  url: string,
  fallback: () => T
): Promise<AdminFetchResult<T>> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    const result = await parseResponse<T>(response);

    if (!result.ok || result.data === undefined) {
      throw new Error(result.error);
    }

    return { data: result.data, source: "api", message: result.message };
  } catch (error) {
    if (isDevFallbackEnabled()) {
      return { data: fallback(), source: "fallback" };
    }

    throw error instanceof Error ? error : new Error("Unable to reach the server.");
  }
}

export async function adminMutate<T>(
  url: string,
  options: RequestInit,
  fallback?: () => T
): Promise<AdminMutationResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const result = await parseResponse<T>(response);

    if (!result.ok) {
      if (fallback && isDevFallbackEnabled()) {
        return {
          ok: true,
          data: fallback(),
          source: "fallback",
          message: "Saved locally — database unavailable.",
        };
      }
      return result;
    }

    return result;
  } catch (error) {
    if (fallback && isDevFallbackEnabled()) {
      return {
        ok: true,
        data: fallback(),
        source: "fallback",
        message: "Saved locally — database unavailable.",
      };
    }

    return {
      ok: false,
      source: "api",
      error: error instanceof Error ? error.message : "Unable to reach the server.",
    };
  }
}
