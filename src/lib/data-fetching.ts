export async function fetchCivicData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Foundation for server-side data fetching
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from " + endpoint + ": " + response.statusText);
  }

  return response.json() as Promise<T>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export function buildPaginationQuery(params: PaginationParams): string {
  const offset = (params.page - 1) * params.limit;
  return "limit=" + params.limit + "&offset=" + offset;
}
