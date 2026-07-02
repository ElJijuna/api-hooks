import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { MavenSearchParams, MavenSearchResult } from 'maven-api-client';
import { mavenQueryKeys } from '../keys/mavenQueryKeys.js';
import { useMavenClient } from '../MavenClientContext.js';
import type { UseMavenQueryOptions } from './options.js';

/**
 * Searches Maven Central artifacts by group ID, artifact ID, class name, or free text.
 *
 * @param params - Maven Central search parameters (`query`, `rows`, `start`)
 * @param options - Query options
 * @returns TanStack Query result with {@link MavenSearchResult}
 */
export function useMavenSearch(
  params: MavenSearchParams = {},
  options: UseMavenQueryOptions = {},
): UseQueryResult<MavenSearchResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMavenClient();

  return useQuery<MavenSearchResult, Error>({
    queryKey: mavenQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled,
  });
}
