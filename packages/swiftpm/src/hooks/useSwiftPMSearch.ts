import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SwiftSearchParams, SwiftSearchResult } from 'swiftpm-api-client';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { UseSwiftPMQueryOptions } from './options.js';

/**
 * Searches Swift packages using the Swift Package Index API.
 *
 * @param params - Search parameters (`query` required, `page`, `pageSize`)
 * @param options - Query options
 * @returns TanStack Query result with {@link SwiftSearchResult}
 */
export function useSwiftPMSearch(
  params: SwiftSearchParams,
  options: UseSwiftPMQueryOptions = {},
): UseQueryResult<SwiftSearchResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useSwiftPMClient();

  return useQuery<SwiftSearchResult, Error>({
    queryKey: swiftpmQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled: enabled && params.query.length > 0,
  });
}
