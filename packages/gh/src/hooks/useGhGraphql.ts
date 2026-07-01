import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhGraphqlOptions<TData = unknown> {
  /** Disable the query. Also disabled when `query` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<TData>;
}

/**
 * Executes a GitHub GraphQL query.
 *
 * @param query - GraphQL query document
 * @param variables - Optional GraphQL variables
 * @param options - Query options
 * @returns TanStack Query result with the typed GraphQL response
 */
export function useGhGraphql<TData = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options: UseGhGraphqlOptions<TData> = {},
): UseQueryResult<TData, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<TData, Error>({
    queryKey: ghQueryKeys.graphql(query, variables),
    queryFn: ({ signal }) => client.graphql<TData>(query, variables, signal),
    ...queryOptions,
    enabled: enabled && query.length > 0,
  });
}
