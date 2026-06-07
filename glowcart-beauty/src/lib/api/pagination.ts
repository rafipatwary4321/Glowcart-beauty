export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function parsePagination(
  searchParams: URLSearchParams,
  defaults?: { page?: number; limit?: number }
): PaginationParams {
  const page = Math.max(1, Number(searchParams.get("page") ?? defaults?.page ?? 1));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? defaults?.limit ?? 20))
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildPaginationMeta(
  total: number,
  { page, limit }: Pick<PaginationParams, "page" | "limit">
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
