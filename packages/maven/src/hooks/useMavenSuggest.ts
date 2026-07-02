import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { MavenSearchResult, MavenSuggestParams } from 'maven-api-client';
import { mavenQueryKeys } from '../keys/mavenQueryKeys.js';
import { useMavenClient } from '../MavenClientContext.js';
import type { UseMavenQueryOptions } from './options.js';

/**
 * Suggests Maven Central artifacts for prefix or keyword matching.
 *
 * @param params - Suggestion parameters (`query` required, `rows` optional)
 * @param options - Query options
 * @returns TanStack Query result with {@link MavenSearchResult}
 */
export function useMavenSuggest(
  params: MavenSuggestParams,
  options: UseMavenQueryOptions = {},
): UseQueryResult<MavenSearchResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMavenClient();

  return useQuery<MavenSearchResult, Error>({
    queryKey: mavenQueryKeys.suggest(params),
    queryFn: ({ signal }) => client.suggest(params, signal),
    ...queryOptions,
    enabled: enabled && params.query.length > 0,
  });
}
