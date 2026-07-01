import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmSearchParams, NpmSearchResult } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmSearchOptions extends Omit<NpmSearchParams, 'text'> {
  /** Disable the query. Also disabled when `text` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmSearchResult>;
}

/**
 * Full-text search across the npm registry.
 *
 * @param text - Search query (e.g. `'react state management'`)
 * @param options - Pagination and scoring weights (`size`, `from`, `quality`, `popularity`, `maintenance`)
 * @returns TanStack Query result with {@link NpmSearchResult}
 */
export function useNpmSearch(
  text: string,
  options: UseNpmSearchOptions = {},
): UseQueryResult<NpmSearchResult, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const client = useNpmClient();

  const params: NpmSearchParams = { text, ...rest };

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled: enabled && text.length > 0,
  });
}
