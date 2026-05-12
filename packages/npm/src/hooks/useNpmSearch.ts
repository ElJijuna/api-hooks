
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmSearchResult, type NpmSearchParams } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmSearchOptions extends Omit<NpmSearchParams, 'text'> {
  /** Disable the query. Also disabled when `text` is empty. */
  enabled?: boolean;
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
  options: UseNpmSearchOptions = {}
): UseQueryResult<NpmSearchResult, Error> {
  const { enabled = true, ...rest } = options;
  const client = useNpmClient();

  const params: NpmSearchParams = { text, ...rest };

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    enabled: enabled && text.length > 0,
  });
}
